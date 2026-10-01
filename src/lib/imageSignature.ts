/**
 * Prüft, ob der tatsächliche Byte-Inhalt einer Datei zu ihrem deklarierten
 * MIME-Typ passt — anhand von Magic Numbers statt blindem Vertrauen in den
 * vom Client gesendeten `Content-Type`.
 * Verifies that a file's actual byte content matches its declared MIME
 * type, using magic-number signatures instead of trusting the
 * client-supplied `Content-Type`.
 *
 * Warum das wichtig ist: Ein Browser oder Angreifer kann beim Upload
 * beliebig `file.type` setzen. Die MIME-Prüfung allein (siehe
 * api/admin/upload/route.ts) fängt nur offensichtlich falsche Uploads —
 * nicht eine bösartige Datei, die sich mit gefälschtem MIME als Bild tarnt.
 *
 * Why this matters: a browser or attacker can set any `file.type` value on
 * a multipart upload, so the MIME check alone only rejects obviously-wrong
 * uploads, not a malicious file dressed up with a spoofed image MIME type.
 * Magic numbers are the first bytes every format mandates — they can't be
 * faked without breaking the file.
 */

function matchesSignature(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[offset + i] !== signature[i]) return false;
  }
  return true;
}

function isJpeg(bytes: Uint8Array): boolean {
  return matchesSignature(bytes, [0xff, 0xd8, 0xff]);
}

function isPng(bytes: Uint8Array): boolean {
  return matchesSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function isGif(bytes: Uint8Array): boolean {
  return matchesSignature(bytes, [0x47, 0x49, 0x46, 0x38]); // "GIF8" (87a or 89a)
}

function isWebp(bytes: Uint8Array): boolean {
  // RIFF....WEBP: "RIFF" at offset 0, "WEBP" at offset 8.
  return matchesSignature(bytes, [0x52, 0x49, 0x46, 0x46]) && matchesSignature(bytes, [0x57, 0x45, 0x42, 0x50], 8);
}

const SIGNATURE_CHECKS: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": isJpeg,
  "image/png": isPng,
  "image/gif": isGif,
  "image/webp": isWebp,
};

/** Returns false for MIME types this module doesn't know how to verify. */
export function matchesImageSignature(bytes: Uint8Array, declaredMimeType: string): boolean {
  const check = SIGNATURE_CHECKS[declaredMimeType];
  return check ? check(bytes) : false;
}
