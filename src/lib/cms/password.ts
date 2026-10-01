// ⚠️ AI-assisted – password hashing with scrypt and the timing-attack
// countermeasure below are the kind of security details that require
// specialist knowledge to get right.
// (Passwort-Hashing und Timing-Angriff-Gegenmaßnahmen – mit KI-Hilfe gebaut.)

// Why scrypt? / Warum scrypt?
// scrypt is a "slow" hashing function designed for passwords – it deliberately
// uses a lot of CPU and memory, making brute-force attacks much more expensive.
// Regular hashes like SHA-256 are too fast and easy to brute-force.
// (SHA-256 und MD5 sind zu schnell – ein Angreifer kann Millionen Passwörter
// pro Sekunde ausprobieren. scrypt macht das absichtlich langsam und teuer.)

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

// Hashes a password with a random salt – stores both together as "salt:hash".
// Hasht ein Passwort mit einem zufälligen Salt – speichert "salt:hash" zusammen.
// The random salt ensures that two users with the same password get different
// hashes in the database.
// (Zufälliger Salt stellt sicher, dass zwei Nutzer mit gleichem Passwort
// trotzdem unterschiedliche Hashes in der Datenbank haben.)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  if (candidate.length !== hashBuffer.length) return false;
  // timingSafeEqual always takes the same time regardless of where the bytes differ.
  // Immer gleich schnell – egal ob erstes oder letztes Byte falsch ist.
  return timingSafeEqual(candidate, hashBuffer);
}

// Fixed dummy salt – only used below to simulate password verification work.
// Fester Dummy-Salt – wird nur unten verwendet um Rechenarbeit zu simulieren.
// (Wird nie zum Speichern eines echten Passworts verwendet.)
const DUMMY_SALT = "0".repeat(32);

// When a username doesn't exist we still do the full scrypt computation
// before returning "wrong credentials" – otherwise the login endpoint would
// respond noticeably faster for nonexistent users, letting attackers figure
// out which usernames are valid just by measuring response time.
// (Wenn ein Nutzername nicht existiert, rechnen wir trotzdem – sonst antwortet
// die Seite für unbekannte Nutzer schneller und ein Angreifer kann daraus
// schließen welche Nutzernamen es gibt.)
export function burnPasswordVerificationTime(password: string): void {
  scryptSync(password, DUMMY_SALT, KEY_LENGTH);
}
