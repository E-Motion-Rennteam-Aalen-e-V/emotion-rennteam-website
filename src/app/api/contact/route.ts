import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { deliverFormSubmission } from "@/lib/formDelivery";
import { hasJsonContentType, isTrustedOrigin } from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 403 });
  }
  if (!hasJsonContentType(request)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 415 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = validateContactForm(body);
  if (!result.valid) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  // Second limiter keyed by the submitted address (shared across all three
  // form endpoints, see rateLimit.ts) so rotating IPs can't be used to spam
  // the same inbox past the per-IP limit above.
  if (!checkRateLimit(`email:${result.data.email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  if (!result.isBot) {
    try {
      await deliverFormSubmission("contact", result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Interner Fehler.";
      return NextResponse.json({ ok: false, error: message }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true });
}
