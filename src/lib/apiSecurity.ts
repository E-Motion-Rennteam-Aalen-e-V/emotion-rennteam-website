// ⚠️ AI-assisted – CSRF and Origin validation are security-critical and
// surprisingly easy to implement wrong. This was built with AI help.
// (CSRF-Schutz ist knifflig – mit KI-Hilfe gebaut.)

import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

/**
 * Leichtgewichtige CSRF-Abwehr für die cookielosen JSON-Formular-Endpunkte
 * (OWASP "Verifying Origin with Standard Headers").
 * Lightweight CSRF defense for the site's cookie-less JSON form endpoints
 * (OWASP "Verifying Origin with Standard Headers").
 *
 * Eine fremde Seite kann zwar einen POST an diese Routes auslösen, aber
 * Browser hängen an same-site Fetches den `Origin`-Header an — und den
 * kann eine cross-origin Anfrage nicht fälschen. Anfragen mit falschem
 * Origin werden direkt abgelehnt; Anfragen *ohne* Origin (z. B. curl,
 * Postman) kommen durch, da es nichts zu prüfen gibt — Rate Limiter und
 * Validierung greifen dort trotzdem.
 *
 * A cross-site page can still trigger a POST to these routes, but browsers
 * attach `Origin` to same-site fetches, which a forged cross-origin request
 * cannot spoof. Requests with a wrong Origin are rejected outright; requests
 * with no Origin at all (some non-browser clients) are allowed through since
 * there's nothing to check — the rate limiter and validation layer still
 * apply to those.
 */
export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originHostname = new URL(origin).hostname;
    // Compare against the "host" header too, not just SITE_URL – this way
    // all Vercel preview deployments work without extra config.
    // (Vercel gibt jeder Preview-URL einen anderen Hostnamen, deshalb
    // schauen wir auf den aktuellen Host statt nur auf SITE_URL.)
    const host = request.headers.get("host");
    if (host && originHostname === host.split(":")[0]) return true;
    // Fallback for the configured production domain
    return new URL(origin).origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}

// Sanity check before we even try to parse the body.
// Kurzer Check: Requests die kein JSON ankündigen sofort ablehnen –
// spart uns unnötiges Parsen und fängt kaputte Requests früh ab.
export function hasJsonContentType(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().includes("application/json");
}
