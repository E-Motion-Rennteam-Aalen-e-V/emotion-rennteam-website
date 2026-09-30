// ⚠️ AI-assisted – magic-number file verification is well-known security
// practice but the exact byte sequences need to be looked up and verified.
// (Magic-Number-Prüfung – Byte-Sequenzen wurden mit KI-Hilfe zusammengestellt.)

// Checks if an uploaded file is actually the image type it claims to be.
// Prüft ob eine hochgeladene Datei wirklich das ist, was sie behauptet zu sein.
//
// Why not just trust the Content-Type header? / Warum nicht einfach dem Header vertrauen?
// Because anyone can upload a file called "photo.jpg" with MIME type "image/jpeg"
// that actually contains something completely different (e.g. a script or executable).
// Browsers and attackers can set file.type to whatever they want.
//
// Instead we look at the actual first bytes of the file – the "magic numbers".
// Every image format starts with a specific sequence of bytes that identifies it.
// (Jedes Bildformat fängt mit einer bestimmten Byte-Folge an – das kann man
// nicht fälschen ohne die Datei selbst zu verändern.)

function matchesSignature(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[offset + i] !== signature[i]) return false;
  }
  return true;
}

function isJpeg(bytes: Uint8Array): boolean {
  // JPEG always starts with FF D8 FF
  return matchesSignature(bytes, [0xff, 0xd8, 0xff]);
}

function isPng(bytes: Uint8Array): boolean {
  // PNG header is always exactly these 8 bytes
  return matchesSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function isGif(bytes: Uint8Array): boolean {
  // "GIF8" – covers both GIF87a and GIF89a variants
  return matchesSignature(bytes, [0x47, 0x49, 0x46, 0x38]);
}

function isWebp(bytes: Uint8Array): boolean {
  // WebP is a RIFF container – starts with "RIFF" and has "WEBP" at offset 8.
  // (WebP steckt in einem RIFF-Container: "RIFF" am Anfang, "WEBP" an Position 8.)
  return matchesSignature(bytes, [0x52, 0x49, 0x46, 0x46]) && matchesSignature(bytes, [0x57, 0x45, 0x42, 0x50], 8);
}

const SIGNATURE_CHECKS: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": isJpeg,
  "image/png": isPng,
  "image/gif": isGif,
  "image/webp": isWebp,
};

// Returns false for any MIME type we don't know how to verify.
// Gibt false zurück für Dateitypen die wir nicht kennen – lieber ablehnen.
export function matchesImageSignature(bytes: Uint8Array, declaredMimeType: string): boolean {
  const check = SIGNATURE_CHECKS[declaredMimeType];
  return check ? check(bytes) : false;
}
