// Session handling for the custom CMS admin. Uses a signed, expiring cookie
// (HMAC-SHA256 over a JSON payload) rather than a library, verified with Web
// Crypto so it also works from the edge-runtime middleware.

export const SESSION_COOKIE = "cms_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  u: string;
  exp: number;
  iat: number;
  /** Muss vor weiterer Nutzung erst ein eigenes Passwort vergeben. */
  p?: boolean;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecret(): string {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "CMS_SESSION_SECRET ist nicht gesetzt (oder zu kurz). Bitte einen zufälligen String mit mindestens 32 Zeichen in .env.local eintragen (openssl rand -hex 32)."
    );
  }
  return secret;
}

export async function createSessionToken(username: string, mustChangePassword = false): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    u: username,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    ...(mustChangePassword ? { p: true } : {}),
  };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadB64 = base64UrlEncode(payloadBytes);
  const key = await hmacKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ username: string; mustChangePassword: boolean; iat: number } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const key = await hmacKey(secret);
  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  let providedSig: Uint8Array;
  try {
    providedSig = base64UrlDecode(sigB64);
  } catch {
    return null;
  }
  const expected = new Uint8Array(expectedSig);
  if (expected.length !== providedSig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ providedSig[i];
  if (diff !== 0) return null;

  try {
    const payload: SessionPayload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof payload.u !== "string" || !payload.u) return null;
    const iat = typeof payload.iat === "number" ? payload.iat : 0;
    return { username: payload.u, mustChangePassword: payload.p === true, iat };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/** Reads and verifies the session cookie from an incoming request. */
export async function getSessionUser(
  request: Request
): Promise<{ username: string; mustChangePassword: boolean } | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
  const session = await verifySessionToken(token);
  if (!session) return null;
  // In Node.js runtime (API routes), also check against the file-based
  // revocation store. Sessions issued before a password change are rejected.
  // This import is intentionally dynamic so this file remains importable from
  // the edge runtime (middleware), where `users.ts` (which uses `fs`) cannot
  // be imported synchronously.
  try {
    const { isSessionValid } = await import("./users");
    if (!isSessionValid(session.username, session.iat)) return null;
  } catch {
    // Edge runtime or unavailable — skip revocation check.
  }
  return session;
}
