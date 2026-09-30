// ⚠️ This file was built with AI assistance – the flood-detection edge cases
// and IP-spoofing details are the kind of thing that's really easy to get
// wrong without knowing the attack vectors beforehand.
// (Dieser Teil wurde mit KI-Hilfe gebaut – die Angriffs-Szenarien sind
// tricky und man tritt leicht in eine Falle wenn man sie nicht kennt.)

import type { NextRequest } from "next/server";

// We track request counts per "route + IP" in memory to stop spam bots.
// One bucket per key, resets after the time window expires.
// Heads up: this only works on a single Node.js process. If the site ever
// runs on multiple Vercel instances in parallel, each has its own memory and
// won't know what the others have seen – you'd need Redis for that.
// (Für uns reicht das erstmal, weil wir keinen riesigen Traffic haben.)

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Hard limit on how many IPs we track at once.
// Without this, a bot flooding us with thousands of fake IPs would grow this
// Map forever and crash the server – not ideal.
// Bei 5000 Einträgen räumen wir auf: erst alte löschen, wenn immer noch
// voll → ältesten rauswerfen (JavaScript Maps merken sich die Reihenfolge).
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

// Extracts the real client IP from the request.
// Liest die echte Client-IP aus den Request-Headern.
//
// This one is subtle / Hier steckt eine Falle:
// x-forwarded-for looks like "clientIP, proxy1, proxy2" – each hop appends
// its own address. The LAST entry is what our trusted Vercel proxy added,
// so that's the only one we can believe.
// If we'd take the FIRST entry instead, any attacker could just set their
// own x-forwarded-for header and bypass rate limiting completely.
// (Den ersten nehmen = Angreifer kann sich eine beliebige IP ausdenken.)
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
