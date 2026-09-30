// ⚠️ AI-assisted – CSRF and Origin validation are security-critical and
// surprisingly easy to implement wrong. This was built with AI help.
// (CSRF-Schutz ist knifflig – mit KI-Hilfe gebaut.)

import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

// Checks if a request comes from our own website and not from some random
// external page trying to abuse our forms.
// Prüft ob ein Request wirklich von unserer eigenen Seite kommt.
//
// How it works / Wie es funktioniert:
// Browsers automatically attach an "Origin" header to cross-site requests,
// and that header can't be spoofed by JavaScript on a foreign page (that's
// the whole point of the browser's Same-Origin Policy).
// So if Origin is set and doesn't match our domain → blocked.
// If Origin is missing (e.g. curl, server-to-server) → we let it through,
// because there's nothing to check – the rate limiter covers those anyway.
//
// (Wenn kein Origin-Header da ist, z.B. bei curl-Requests, lassen wir
// durch – da können wir eh nichts prüfen, und der Rate-Limiter greift noch.)
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
