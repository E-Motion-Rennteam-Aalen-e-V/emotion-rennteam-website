import { NextRequest, NextResponse } from "next/server";
import { validateNewsletterForm } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { hasJsonContentType, isTrustedOrigin } from "@/lib/apiSecurity";
import { addNewsletterSubscriber, sendNewsletterNotifications } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 403 });
  }
  if (!hasJsonContentType(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 415 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anmeldeversuche. Bitte versuche es später erneut." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = validateNewsletterForm(body);
  if (!result.valid) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  // Rate limit per email
  if (!checkRateLimit(`newsletter:${result.data.email.toLowerCase()}`, 1, 30 * 24 * 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Diese E-Mail-Adresse ist bereits angemeldet." },
      { status: 429, headers: { "Retry-After": "2592000" } }
    );
  }

  if (result.isBot) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";

  if (!apiKey) {
    console.error("[newsletter] ACTION REQUIRED: RESEND_API_KEY is not configured");
    return NextResponse.json(
      { ok: false, error: "Newsletter-System nicht verfügbar. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }

  try {
    // 1. In Resend als Kontakt speichern
    const subscriberAdded = await addNewsletterSubscriber(result.data.email, apiKey);
    if (!subscriberAdded) {
      throw new Error("Failed to add subscriber to Resend");
    }

    // 2. Benachrichtigungen versenden
    const { adminNotified, userWelcomed } = await sendNewsletterNotifications(
      result.data.email,
      apiKey,
      fromEmail
    );

    if (!adminNotified || !userWelcomed) {
      console.warn(
        `[newsletter] Notifications partially failed for ${result.data.email}: admin=${adminNotified}, user=${userWelcomed}`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Interner Fehler.";
    console.error("[newsletter] Subscription failed:", message, err);
    return NextResponse.json(
      { ok: false, error: "Newsletter-Anmeldung fehlgeschlagen. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }
}
