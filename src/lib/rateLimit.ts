// ⚠️ This file was built with AI assistance – the flood-detection edge cases
// and IP-spoofing details are the kind of thing that's really easy to get
// wrong without knowing the attack vectors beforehand.
// (Dieser Teil wurde mit KI-Hilfe gebaut – die Angriffs-Szenarien sind
// tricky und man tritt leicht in eine Falle wenn man sie nicht kennt.)

import type { NextRequest } from "next/server";

/**
 * Minimaler In-Memory-Rate-Limiter mit festem Zeitfenster (Fixed Window).
 * Minimal in-memory fixed-window rate limiter.
 *
 * Reicht aus, um naive Form-Spam-Bots auf einem einzelnen, langlebigen
 * Node.js-Prozess zu bremsen. Funktioniert aber *nicht* über mehrere
 * Serverless-Instanzen hinweg, weil jeder Prozess seinen eigenen Speicher
 * hat. Bei Multi-Instance-Deployment bitte durch einen gemeinsamen Store
 * ersetzen (Redis / Upstash o. Ä.).
 *
 * Good enough to blunt naive form-spam bots on a single long-lived Node.js
 * server process. It does *not* work across multiple serverless
 * instances/regions since each process has its own memory — if the site
 * moves to a multi-instance deployment, swap this for a shared store
 * (Redis/Upstash, etc.).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Maximale Anzahl gleichzeitig verfolgter Keys (Route + IP).
 * Upper bound on how many distinct keys (route + IP) we track at once.
 *
 * Serverless-Funktionen laufen keinen Hintergrundcode zwischen zwei
 * Anfragen — abgelaufene Buckets werden also nie automatisch aufgeräumt.
 * Ohne diese Obergrenze würde die Map bei vielen verschiedenen IPs (oder
 * einem Flood mit gefälschten `x-forwarded-for`-Werten) endlos wachsen.
 * Sobald das Limit erreicht ist, räumen wir abgelaufene Einträge auf,
 * bevor wir einen neuen hinzufügen.
 *
 * Serverless functions don't get to run background work between
 * invocations — so without a cap, a long-lived process fielding traffic
 * from many distinct IPs (or a flood of spoofed `x-forwarded-for` values)
 * would grow this map forever. Once the map hits the cap we sweep expired
 * entries before inserting a new one, keeping steady-state memory bounded.
 */
const MAX_TRACKED_BUCKETS = 5000;

function sweepExpiredBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_BUCKETS) {
      sweepExpiredBuckets(now);
      // Tricky edge case: during an active flood, ALL buckets are still valid
      // (none have expired yet), so sweeping does nothing. Without a fallback
      // the map would just keep growing past the cap.
      // Lösung: ältesten Eintrag rauswerfen – das ist der erste in der Map,
      // weil JS Maps die Insertionsreihenfolge beibehalten.
      if (buckets.size >= MAX_TRACKED_BUCKETS) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey !== undefined) buckets.delete(oldestKey);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

// Only used in tests to check that the cleanup logic actually works
export function _getTrackedBucketCountForTesting(): number {
  return buckets.size;
}

/**
 * Ermittelt die Client-IP hinter einem einzelnen, vertrauenswürdigen
 * Reverse Proxy (z. B. Vercels Edge-Netzwerk).
 * Best-effort client IP extraction behind a single trusted reverse proxy
 * (e.g. Vercel's edge network).
 *
 * `x-forwarded-for` ist eine kommaseparierte Liste, die jeder Hop *anhängt*
 * statt zu ersetzen. Der Client kann beliebige Werte vor den Proxy-Eintrag
 * setzen — deshalb ist nur der *letzte* Eintrag vertrauenswürdig (der vom
 * Proxy selbst stammt). Den ersten Eintrag zu nehmen würde Rate-Limiting
 * durch simple Header-Manipulation aushebeln.
 *
 * `x-forwarded-for` is a comma-separated list that each hop *appends* to
 * rather than replaces, so a client can freely set their own value before
 * the request reaches the proxy — only the *last* entry is the one the
 * trusted proxy itself added and is safe to key rate limits on. Taking the
 * first (leftmost, client-controlled) entry would let anyone bypass rate
 * limiting simply by sending a different `x-forwarded-for` value on every
 * request.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
