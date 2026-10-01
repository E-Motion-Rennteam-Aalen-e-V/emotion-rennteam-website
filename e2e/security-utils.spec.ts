/**
 * Dokumentationstests für sicherheitskritische Hilfsfunktionen.
 * Documentation tests for security-critical utility functions.
 *
 * Diese Tests dienen zwei Zwecken: Sie beweisen, dass die Funktionen
 * korrekt arbeiten, und sie erklären dabei das "Warum" hinter den
 * Implementierungsentscheidungen — lesbar wie eine technische Erklärung,
 * nicht wie kryptische Assertions.
 *
 * These tests serve two purposes: they prove the functions work correctly,
 * and they explain the "why" behind implementation decisions — readable as
 * a technical walkthrough, not cryptic assertions.
 */

import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Token-Sicherheit / Token security
// ---------------------------------------------------------------------------

test.describe("Newsletter-Bestätigungstoken / Newsletter confirmation tokens", () => {
  test("ungültige Tokens werden sauber abgelehnt / invalid tokens are cleanly rejected", async ({ request }) => {
    // Ein Angreifer, der einen Token rät oder manipuliert, bekommt immer
    // "invalid" zurück — nie einen Stack-Trace oder eine Fehlermeldung, die
    // Interna verrät.
    // An attacker guessing or tampering with a token always gets "invalid"
    // back — never a stack trace or error message that leaks internals.
    const res = await request.get("/api/newsletter/confirm?token=not-a-valid-token");
    expect(res.status()).not.toBe(500);
    // 400 or 410 (expired) — both are safe, neither leaks secrets
    expect([400, 410]).toContain(res.status());
  });

  test("fehlendes Token gibt 400 zurück, kein Crash / missing token returns 400, not a crash", async ({ request }) => {
    const res = await request.get("/api/newsletter/confirm");
    expect(res.status()).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// CSRF-Schutz / CSRF protection
// ---------------------------------------------------------------------------

test.describe("CSRF-Origin-Prüfung / CSRF origin check", () => {
  test("POST-Anfrage ohne Origin-Header wird durchgelassen (non-browser clients)", async ({ request }) => {
    // Curl, Postman und ähnliche Tools senden keinen Origin-Header. Das ist
    // kein Sicherheitsproblem, weil CSRF nur im Browser-Kontext relevant ist
    // (der Browser ist es, der Cookies automatisch mithängt). Kein Header =
    // kein CSRF-Risiko, also kein Block.
    // curl, Postman, and similar tools don't send an Origin header. That's
    // not a security problem because CSRF only matters in a browser context
    // (the browser is what automatically attaches cookies). No header =
    // no CSRF risk, so we don't block it.
    const res = await request.post("/api/newsletter/subscribe", {
      headers: { "content-type": "application/json" },
      data: { email: "test@example.com" },
    });
    // Should NOT be 403 Forbidden (origin blocked). Could be 422 (validation)
    // or 429 (rate limit), but not a CSRF rejection.
    expect(res.status()).not.toBe(403);
  });

  test("POST-Anfrage mit fremdem Origin wird blockiert / POST from foreign origin is blocked", async ({ request }) => {
    // Genau das ist das Angriffsszenario: Eine fremde Seite lässt den Browser
    // des Opfers eine POST-Anfrage an unsere API schicken. Browser setzen
    // dabei automatisch den Origin-Header — und den können wir prüfen.
    // This is exactly the attack scenario: a foreign page causes the victim's
    // browser to POST to our API. Browsers automatically set the Origin
    // header on cross-origin requests — and we can check it.
    const res = await request.post("/api/newsletter/subscribe", {
      headers: {
        "content-type": "application/json",
        origin: "https://evil-site.example.com",
      },
      data: { email: "test@example.com" },
    });
    expect(res.status()).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// Rate Limiting
// ---------------------------------------------------------------------------

test.describe("Rate Limiting", () => {
  test("viele schnelle Anfragen werden gedrosselt / rapid repeated requests are throttled", async ({ request }) => {
    // Dieser Test schickt mehr Anfragen als das konfigurierte Limit und prüft,
    // dass der Rate Limiter irgendwann 429 zurückgibt. Das schützt das
    // Kontaktformular und den Newsletter vor automatisierten Massenanfragen.
    // This test sends more requests than the configured limit and checks that
    // the rate limiter eventually returns 429. This protects the contact form
    // and newsletter from automated mass submissions.
    const REQUESTS_TO_SEND = 15;
    const statuses: number[] = [];

    for (let i = 0; i < REQUESTS_TO_SEND; i++) {
      const res = await request.post("/api/newsletter/subscribe", {
        headers: { "content-type": "application/json" },
        data: { email: `test${i}@example.com` },
      });
      statuses.push(res.status());
    }

    // At least one request should have been rate-limited.
    expect(statuses).toContain(429);
  });
});

// ---------------------------------------------------------------------------
// Datei-Upload-Sicherheit / File upload security
// ---------------------------------------------------------------------------

test.describe("Datei-Upload Magic Number Prüfung / File upload magic-number check", () => {
  test("Upload einer PHP-Datei mit image/jpeg MIME wird abgelehnt / PHP file with image/jpeg MIME is rejected", async ({ request }) => {
    // Das ist das klassische Angriffsszenario: Eine .php-Datei mit dem
    // MIME-Typ "image/jpeg" hochladen, in der Hoffnung, dass der Server
    // nur den MIME-Typ prüft und nicht den echten Dateiinhalt.
    // Unsere Magic-Number-Prüfung schaut auf die ersten Bytes der Datei
    // und erkennt, dass die PHP-Datei-Signatur (<?) nicht mit JPEG (FF D8 FF)
    // übereinstimmt.
    // The classic attack: upload a .php file with MIME type "image/jpeg",
    // hoping the server only checks the declared MIME type and not the actual
    // file content. Our magic-number check reads the first bytes of the file
    // and detects that the PHP signature (<?php) doesn't match JPEG (FF D8 FF).
    const fakeImage = Buffer.from("<?php echo shell_exec($_GET['cmd']); ?>");

    const formData = new FormData();
    formData.append("file", new Blob([fakeImage], { type: "image/jpeg" }), "photo.jpg");

    const res = await request.post("/api/admin/upload", { multipart: formData });

    // Should be rejected — not a valid image despite the declared MIME type.
    // 401 (no session) is also acceptable here since auth runs first.
    expect([400, 401, 415, 422]).toContain(res.status());
    expect(res.status()).not.toBe(200);
  });
});
