"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#f5f5f5",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Etwas ist schiefgelaufen.
        </h1>
        <p style={{ color: "#999", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Ein unerwarteter Fehler ist aufgetreten.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              background: "#0071b5",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              background: "#1a1a1a",
              color: "#f5f5f5",
              border: "1px solid #333",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Zurück zur Startseite
          </a>
        </div>
      </body>
    </html>
  );
}
