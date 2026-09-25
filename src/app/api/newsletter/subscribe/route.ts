import { NextRequest, NextResponse } from "next/server";
import { validateNewsletterForm } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { hasJsonContentType, isTrustedOrigin } from "@/lib/apiSecurity";
import { createConfirmToken } from "@/lib/newsletterToken";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 403 });
  }
  if (!hasJsonContentType(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 415 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`newsletter_sub:${ip}`, 3, 60 * 60 * 1000)) {
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

  if (!checkRateLimit(`newsletter_sub:${result.data.email.toLowerCase()}`, 1, 30 * 24 * 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Diese E-Mail-Adresse wurde bereits angemeldet. Bitte prüfe dein Postfach." },
      { status: 429, headers: { "Retry-After": "2592000" } }
    );
  }

  if (result.isBot) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emotion-rennteam.de";

  if (!apiKey) {
    console.error("[newsletter/subscribe] RESEND_API_KEY not configured");
    return NextResponse.json(
      { ok: false, error: "Newsletter-System nicht verfügbar. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }

  if (!process.env.NEWSLETTER_CONFIRM_SECRET) {
    console.error("[newsletter/subscribe] NEWSLETTER_CONFIRM_SECRET not configured");
    return NextResponse.json(
      { ok: false, error: "Newsletter-System nicht verfügbar. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }

  try {
    const token = createConfirmToken(result.data.email);
    const confirmUrl = `${siteUrl}/newsletter/confirm?token=${token}`;
    const client = new Resend(apiKey);

    const sendResult = await client.emails.send({
      from: fromEmail,
      to: result.data.email,
      subject: "Bitte bestätige deine Newsletter-Anmeldung",
      html: `
        <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto">
          <h2 style="color:#1a1a1a">Fast geschafft! ✉️</h2>
          <p>Bitte bestätige deine Anmeldung zum <strong>E-Motion Rennteam Newsletter</strong>, indem du auf den Button klickst:</p>
          <p style="margin:32px 0">
            <a href="${confirmUrl}" style="display:inline-block;padding:14px 28px;background:#0071b5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px">
              Newsletter bestätigen
            </a>
          </p>
          <p style="font-size:13px;color:#666">Dieser Link ist 24 Stunden gültig.</p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
          <p style="font-size:12px;color:#999">Wenn du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.</p>
        </body></html>
      `,
    });

    if (sendResult.error) {
      console.error("[newsletter/subscribe] Confirmation email failed:", sendResult.error);
      return NextResponse.json(
        { ok: false, error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." },
        { status: 503 }
      );
    }

    console.log(`[newsletter/subscribe] Confirmation email sent to ${result.data.email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter/subscribe] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Newsletter-Anmeldung fehlgeschlagen. Bitte versuche es später erneut." },
      { status: 503 }
    );
  }
}
