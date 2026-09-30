// ⚠️ AI-assisted – session tokens, cryptographic signing, and timing-safe
// comparison are genuinely hard to get right. Built with AI help.
// (Session-Kryptographie ist fehleranfällig – mit KI-Hilfe umgesetzt.)

// Session management for the CMS admin login.
// Verwaltet die Login-Sessions für das CMS-Backend.
//
// Instead of using a library, we roll our own signed cookie:
// - The session data (username, expiry) is JSON-encoded and base64-URL-encoded
// - Then signed with HMAC-SHA256 so nobody can tamper with it
// - On every request the signature is verified before trusting the payload
//
// Wir nutzen keine fertige Bibliothek, sondern bauen das selbst mit Web Crypto –
// das funktioniert auch in Vercel's Edge Runtime (Middleware), die kein
// vollständiges Node.js hat.

export const SESSION_COOKIE = "cms_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 Tage / 7 days

// What we store in the cookie (short field names to keep the cookie small)
// Was im Cookie steht (kurze Feldnamen um Platz zu sparen)
interface SessionPayload {
  u: string;  // username / Benutzername
  exp: number; // expiry timestamp (Unix seconds) / Ablaufzeitpunkt
  iat: number; // issued-at timestamp / Ausstellungszeitpunkt (für Widerruf)
  /** Must set own password before using the CMS / Muss erst Passwort vergeben */
  p?: boolean;
}

// Standard base64 doesn't work well in URLs (uses +, /, =).
// Base64URL is the URL-safe variant that swaps those characters.
// (Standard Base64 hat Zeichen die in URLs nicht gut funktionieren –
// Base64URL tauscht sie aus.)
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

// Loads the secret as a Web Crypto key so we can use it for HMAC signing.
// (Web Crypto API erwartet ein CryptoKey-Objekt, nicht einfach einen String.)
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

// Creates a signed session token: payload.signature
// Erstellt ein signiertes Session-Token: Nutzdaten.Signatur
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
  // Timing-safe comparison – compare every byte even if we find a mismatch early.
  // Timing-sicherer Vergleich: Wir prüfen alle Bytes auch wenn wir schon wissen
  // dass die Signatur falsch ist. Sonst könnte man aus der Antwortzeit ablesen
  // an welcher Stelle genau die Signatur abweicht (Timing-Angriff).
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

// Reads the session cookie from the request and verifies it.
// Liest und prüft den Session-Cookie aus dem Request.
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
  // In Node.js (API routes) we also check the revocation list – sessions
  // created before a password change get invalidated this way.
  // We use a dynamic import here on purpose: this file must stay importable
  // from Edge Runtime (middleware), which can't use Node's `fs` module.
  // (Dynamischer Import damit diese Datei auch in der Edge Runtime lädt –
  // users.ts nutzt fs, das die Edge Runtime nicht kennt.)
  try {
    const { isSessionValid } = await import("./users");
    if (!isSessionValid(session.username, session.iat)) return null;
  } catch {
    // Edge runtime – skip revocation check, signature is still verified above.
    // Edge Runtime – Widerruf-Check überspringen, Signaturprüfung gilt noch.
  }
  return session;
}
