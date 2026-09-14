"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fehler – E-Motion Rennteam Aalen</title>
        <style>{`
          body { margin: 0; background: #06070d; color: #f5f6f8; font-family: system-ui, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .box { text-align: center; padding: 2rem; max-width: 480px; }
          h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.5rem; }
          p { color: #9aa0b4; margin: 0 0 1.5rem; }
          button { background: #0071b5; color: #fff; border: none; border-radius: 0.5rem; padding: 0.625rem 1.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; margin: 0.25rem; }
          button.secondary { background: transparent; border: 1px solid #232635; color: #9aa0b4; }
        `}</style>
      </head>
      <body>
        <div className="box">
          <p style={{ fontSize: "3rem", margin: "0 0 1rem" }}>⚠️</p>
          <h1>Etwas ist schiefgelaufen</h1>
          <p>Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.</p>
          <button onClick={reset}>Erneut versuchen</button>
          <button className="secondary" onClick={() => { window.location.href = "/"; }}>
            Zur Startseite
          </button>
        </div>
      </body>
    </html>
  );
}
