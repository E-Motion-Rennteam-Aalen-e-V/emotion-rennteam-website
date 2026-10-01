/**
 * Zeitlich begrenzte, HMAC-signierte Bestätigungstoken für Newsletter-Opt-in.
 * Time-limited HMAC-signed confirmation tokens for newsletter opt-in.
 *
 * Aufbau des Tokens: base64url( E-Mail | Ablaufzeit-ms | HMAC-SHA256-Hex )
 * Token structure:   base64url( email | expiresAt_ms | HMAC-SHA256-hex )
 *
 * Warum nicht einfach eine zufällige UUID in der Datenbank speichern?
 * Mit einem signierten Token brauchen wir keinen Datenbank-Lookup zur
 * Validierung — die Signatur selbst beweist, dass wir das Token ausgestellt
 * haben, und die Ablaufzeit steckt direkt drin.
 *
 * Why not just store a random UUID in the database? A signed token needs no
 * DB lookup to validate — the signature proves we issued it, and the
 * expiry is embedded directly in the payload.
 *
 * timingSafeEqual verhindert Timing-Angriffe: Bei einem normalen `===`
 * bricht der Vergleich beim ersten falschen Byte ab. Ein Angreifer könnte
 * durch Zeitmessung herausfinden, wie viele Bytes seines gefälschten Tokens
 * schon stimmen. timingSafeEqual läuft immer gleich lang.
 *
 * timingSafeEqual prevents timing attacks: a plain `===` short-circuits on
 * the first wrong byte, leaking how many bytes of a forged token are
 * already correct via response-time measurement. timingSafeEqual always
 * takes the same time regardless of where the bytes differ.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 Stunden / 24 hours

function getSecret(): string {
  const s = process.env.NEWSLETTER_CONFIRM_SECRET;
  if (!s) throw new Error("NEWSLETTER_CONFIRM_SECRET is not configured");
  return s;
}

// Builds the confirmation token and encodes it as base64url (URL-safe).
// Erstellt den Bestätigungstoken und kodiert ihn als URL-sicheres base64url.
export function createConfirmToken(email: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${email}|${expiresAt}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export type VerifyResult =
  | { valid: true; email: string }
  | { valid: false; reason: "expired" | "invalid" };

export function verifyConfirmToken(token: string): VerifyResult {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return { valid: false, reason: "invalid" };
    const [email, expiresAtStr, sig] = parts;
    const payload = `${email}|${expiresAtStr}`;
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    // timingSafeEqual compares all bytes even if the first one already differs.
    // timingSafeEqual prüft immer alle Bytes, auch wenn schon der erste falsch ist.
    // Why? / Warum? A normal === or early-exit comparison leaks information
    // through response timing – an attacker could guess the correct signature
    // one byte at a time by measuring how long the check takes.
    // (Normaler Vergleich: je mehr Bytes stimmen, desto länger dauert es –
    // das verrät wie "nah dran" ein Angriffversuch war.)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false, reason: "invalid" };
    }
    if (Date.now() > Number(expiresAtStr)) {
      return { valid: false, reason: "expired" };
    }
    return { valid: true, email };
  } catch {
    return { valid: false, reason: "invalid" };
  }
}
