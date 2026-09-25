import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

function getSecret(): string {
  const s = process.env.NEWSLETTER_CONFIRM_SECRET;
  if (!s) throw new Error("NEWSLETTER_CONFIRM_SECRET is not configured");
  return s;
}

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
