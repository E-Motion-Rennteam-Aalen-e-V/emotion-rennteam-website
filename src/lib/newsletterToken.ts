// ⚠️ AI-assisted – HMAC tokens and timing-safe comparison are easy to mess up.
// (HMAC-Token-Logik und Timing-Angriff-Schutz – mit KI-Hilfe gebaut.)

// Generates and verifies single-use confirmation tokens for newsletter sign-ups.
// Erstellt und prüft Bestätigungslinks für Newsletter-Anmeldungen.
//
// How it works / Wie es funktioniert:
// Token = base64url( email | expiryTimestamp | HMAC-SHA256-signature )
// The signature covers "email|expiry" so neither the email nor the expiry
// can be modified without the signature breaking.
// (Niemand kann die E-Mail-Adresse oder das Ablaufdatum im Token verändern
// ohne dass die Signatur ungültig wird.)

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
