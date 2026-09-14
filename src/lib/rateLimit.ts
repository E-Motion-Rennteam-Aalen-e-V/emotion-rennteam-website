import type { NextRequest } from "next/server";

/**
 * Minimal in-memory fixed-window rate limiter. Good enough to blunt naive
 * form-spam bots on a single long-lived Node.js server process. It does
 * *not* work across multiple serverless instances/regions since each
 * process has its own memory — if the site moves to a multi-instance
 * deployment, swap this for a shared store (Redis/Upstash, etc.).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Upper bound on how many distinct keys (route + IP) we track at once.
 * Expired buckets are never actively evicted on a timer — Vercel/Node
 * serverless functions don't get to run background work between
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
      // A sustained flood of distinct keys inside a single window (e.g.
      // spoofed `x-forwarded-for` values arriving faster than any of
      // them expire) leaves nothing for the sweep above to reclaim — all
      // buckets are still legitimately "active". Without a fallback the
      // map would keep growing past MAX_TRACKED_BUCKETS for as long as
      // the flood lasts, silently defeating the cap. Evict the oldest
      // entry (first in Map insertion order) so the cap is a true bound
      // even under that load, not just when traffic happens to be idle
      // enough for buckets to expire on their own.
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

/** Test-only escape hatch to observe the internal map size. */
export function _getTrackedBucketCountForTesting(): number {
  return buckets.size;
}

/**
 * Best-effort client IP extraction behind a single trusted reverse proxy
 * (e.g. Vercel's edge network). `x-forwarded-for` is a comma-separated list
 * that each hop *appends* to rather than replaces, so a client can freely
 * set their own value before the request reaches the proxy — only the
 * *last* entry is the one the trusted proxy itself added and is safe to
 * key rate limits on. Taking the first (leftmost, client-controlled) entry
 * would let anyone bypass rate limiting simply by sending a different
 * `x-forwarded-for` value on every request.
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
