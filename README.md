<div align="center">

# 🏎️ E-Motion Rennteam Aalen — Website

**Offizieller Webauftritt des Formula-Student-Electric-Teams der Hochschule Aalen**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](./LICENSE)

[![Rendering](https://img.shields.io/badge/Rendering-Static_%2F_SSG-brightgreen?style=flat-square)]()
[![Bundler](https://img.shields.io/badge/Bundler-Turbopack-0096FF?style=flat-square)]()
[![A11y](https://img.shields.io/badge/A11y-axe--core_getestet-8A2BE2?style=flat-square)]()
[![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)]()

</div>

---

## 📖 Über dieses Projekt

Diese Website ist der offizielle Online-Auftritt des **E-Motion Rennteam Aalen**,
dem Formula-Student-Electric-Team der Hochschule Aalen. Sie dient als
zentrale Anlaufstelle für Sponsoren, Presse, Bewerber:innen und Fans:
Team- und Fahrzeugvorstellung, Renn-/Erfolgshistorie, News, Bildergalerie
sowie Kontakt-, Bewerbungs-, Sponsoring- und Mediakit-Anfragen.

Die Seite ist als **statisch generierte Next.js-Anwendung** gebaut: Inhalte
werden zur Build-Zeit aus Markdown-Dateien gelesen und als vorgerenderte
HTML-Seiten ausgeliefert — dadurch sind Ladezeiten sehr kurz und es ist
kein Datenbankserver nötig.

---

## 🏗️ Architektur & Tech-Stack

| Bereich | Technologie | Zweck |
| :-- | :-- | :-- |
| Framework | **Next.js 16** (App Router, Turbopack) | Routing, SSG/SSR, Bild-/Font-Optimierung |
| UI | **React 19** + **TypeScript 5** | Komponenten, Typsicherheit |
| Styling | **Tailwind CSS 4** | Utility-first CSS, Dark-mode-fähiges Theme |
| Animationen | **Framer Motion** | Seitenübergänge, Reveal-/Stagger-Effekte |
| Content | **Markdown + Gray-Matter** | Redaktionelle Inhalte ohne Datenbank |
| Rendering | **Marked** + **sanitize-html** | Sicheres Rendern von Markdown-Inhalten |
| Tests | **Vitest**, **Testing Library**, **axe-core/Playwright** | Unit-, Komponenten- und Accessibility-Tests |

**Rendering-Strategie:** Fast alle Seiten werden **statisch (SSG)**
vorgerendert (`○` im Build-Output). Nur Formular-Endpunkte (`/api/*`) sowie
einzelne dynamische Detailseiten (`/blog/[slug]`, `/news/[slug]`) laufen
serverseitig on-demand (`ƒ`).

---

## 🗺️ Seitenstruktur — was ist alles drin

| Route | Inhalt |
| :-- | :-- |
| `/` | Startseite mit Team-Highlights |
| `/team` | Teammitglieder & Abteilungen |
| `/fahrzeuge` | Fahrzeughistorie & technische Daten |
| `/formula-student` | Formula-Student-Regelwerk & Wettbewerbsformat |
| `/erfolge` | Rennergebnisse & Erfolge |
| `/sponsoren` | Sponsoren nach Tier (Platin/Gold/Silber/Partner) + Sponsoring-Formular |
| `/mediakit` | Bild-/Videomaterial-Anfrage für Presse & Sponsoren |
| `/galerie` | Bildergalerie nach Alben sortiert |
| `/news` & `/news/[slug]` | Team-News |
| `/blog` & `/blog/[slug]` | Blog-Beiträge |
| `/mitmachen` | Offene Positionen & Bewerbungsformular |
| `/kontakt` | Kontaktformular & Anfahrt (Karte) |
| `/impressum`, `/datenschutz` | Rechtliche Pflichtseiten |
| `/sitemap.xml`, `/robots.txt` | SEO-Metadaten |
| `/admin` (& `/admin/*`) | Redaktions-CMS (Login-geschützt, siehe unten) |

**Formular-Backends** (`src/app/api/`): `contact`, `mitmachen`, `sponsoring`,
`mediakit` — jeweils mit serverseitiger Validierung, Rate-Limiting und
Honeypot-Spam-Schutz.

---

## ⚡ Performance

Gemessen an einem lokalen Produktions-Build (`next build` + `next start`,
Turbopack, statisch generierte Startseite):

| Metrik | Wert |
| :-- | :-- |
| Server-Antwortzeit (TTFB, lokal) | **~4–5 ms** |
| HTML-Größe Startseite | **~55 KB** |
| Gesamtgröße statische Assets (`.next/static`) | **~1,2 MB** |
| Seiten als Static/SSG vorgerendert | **22 von 26** Routen |

> Werte stammen aus einem lokalen Build in dieser Entwicklungsumgebung und
> nicht von einer produktiven CDN-Auslieferung — reale Ladezeiten im
> Browser hängen zusätzlich von Netzwerk, Hosting-Standort und Caching ab.
> Zur laufenden Kontrolle: `npm run analyze` erzeugt einen Bundle-Report
> unter `.next/diagnostics/analyze/index.html`.

---

## 🧩 Content-Pflege

Redaktionelle Inhalte (Team, Fahrzeuge, Sponsoren, News, Blog, Galerie,
Erfolge, offene Positionen, Seitentexte) liegen als Markdown-Dateien in
`content/` und werden zur Build-Zeit gelesen — keine Datenbank, keine
Laufzeit-Abhängigkeit auf einen externen Server.

Zusätzlich ist unter `/admin` ein Redaktions-CMS in die Website integriert
(Login, Inhalte-Editor, Medienbibliothek, Nutzerverwaltung). Gespeichert
wird lokal **und** — sofern konfiguriert — als Commit direkt ins
GitHub-Repository, sodass Änderungen über das CMS genau die gleichen
Markdown-Dateien in `content/` versionieren wie ein manueller Commit.

**Benötigte Umgebungsvariablen** (in `.env.local` bzw. den
Projekteinstellungen des Hosting-Anbieters):

| Variable | Zweck |
| :-- | :-- |
| `CMS_SESSION_SECRET` | Zufälliger String (≥16 Zeichen) zum Signieren der Login-Session. Pflicht, sonst ist kein Login möglich. |
| `CMS_ADMIN_USER` | Benutzername des Hauptadministrators. |
| `CMS_ADMIN_PASSWORD_HASH` | Passwort-Hash des Hauptadministrators, erzeugt mit `node scripts/cms-hash-password.mjs "passwort"`. |
| `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` | Optional. Wenn gesetzt, committet das CMS jede Änderung automatisch ins Repository. Ohne diese Variablen werden Änderungen nur lokal auf dem Server gespeichert (nicht persistent auf den meisten Hosting-Plattformen). |
| `FORM_WEBHOOK_URL` | Optional. Ziel-Webhook (z. B. Slack/Teams-Incoming-Webhook oder eigener E-Mail-Relay) für Kontakt-/Bewerbungs-/Sponsoring-/Mediakit-Formulare. Ohne diese Variable landen Einsendungen nur im Server-Log. |

## 🍎 macOS-Installation (CMS-App)

> Dieser Abschnitt gilt für den `CMS-App-MacOs`-Branch (das macOS-App-Bundle).

### Schritt-für-Schritt-Anleitung

1. **Ordner aus Downloads verschieben** — Vor dem ersten Start den
   entpackten Ordner aus `~/Downloads` heraus bewegen, z. B. auf den
   Schreibtisch oder nach `~/Programme`. macOS sperrt Apps, die direkt
   aus dem Download-Ordner gestartet werden (Gatekeeper „App Translocation").

2. **App starten** — Doppelklick auf `E-Motion CMS.app` oder auf
   `CMS-Start_macos.command`.

3. **„App ist beschädigt"-Fehler (Apple Silicon)** — Einmalig im Terminal:
   ```bash
   xattr -cr "E-Motion CMS.app"
   ```
   Danach die App erneut starten.

4. **Skripte nicht ausführbar** — Falls `.command`-Dateien beim Doppelklick
   nicht starten:
   ```bash
   chmod +x CMS-Start_macos.command CMS-Start.command
   ```

5. **Node.js nicht gefunden** — Das Startskript sucht automatisch nach nvm
   (`~/.nvm`) und Homebrew (`/opt/homebrew/bin`). Falls Node.js trotzdem
   nicht erkannt wird: im Terminal `node --version` prüfen, dann ggf.
   Node.js von https://nodejs.org neu installieren (LTS-Version).

---

## 🔐 Betrieb & Sicherheitshinweise (Produktion)

Checkliste vor dem Go-Live des `cms-app`-Deployments:

- **`FORM_WEBHOOK_URL` setzen.** Ohne diese Variable werden Formular-
  Einsendungen (Kontakt, Bewerbung, Sponsoring, Mediakit) nicht live
  zugestellt, sondern nur lokal in `.pending-form-submissions.jsonl`
  gepuffert (siehe `src/lib/formDelivery.ts`) — inklusive eines lauten
  `console.error`, damit das in jedem Log-/Monitoring-System auffällt.
  Diese Datei ist ein Notfall-Fallback, kein Ersatz für einen echten
  Webhook: sie sollte regelmäßig geprüft/geleert werden.
- **TLS/Reverse-Proxy zwingend.** `next.config.ts` setzt strikte
  Security-Header inkl. HSTS und `upgrade-insecure-requests`. Läuft
  `next start` direkt ohne TLS-terminierenden Reverse-Proxy davor, sperren
  Browser sich nach dem ersten Aufruf selbst auf HTTPS ein — auch wenn nur
  HTTP verfügbar ist.
- **Rate-Limiting ist In-Memory** (`src/lib/rateLimit.ts`, bewusst
  dokumentiert). Es schützt zuverlässig einen einzelnen, langlebigen
  Node-Prozess, greift aber pro Instanz separat, sobald mehrere
  Server-/Container-Instanzen parallel laufen. Bei Multi-Instanz-Hosting
  auf einen gemeinsamen Store (z. B. Redis/Upstash) umstellen.
- **`.cms-users.json` ist lokal, nicht verschlüsselt und nicht
  versioniert** (siehe `src/lib/cms/users.ts`). Setzt einen persistenten
  Server mit eigenem, geschütztem Dateisystem voraus — auf ephemeren/
  serverless Hosts gehen zusätzlich angelegte CMS-Benutzer bei jedem
  Deploy verloren; der Haupt-Administrator (`CMS_ADMIN_USER`/
  `CMS_ADMIN_PASSWORD_HASH`) ist davon nicht betroffen.

## 📁 Projektstruktur

```
content/            # Markdown-Inhalte (Team, Fahrzeuge, Sponsoren, News, Seiten, …)
src/app/             # Next.js App Router: Seiten & API-Routen
src/components/      # Wiederverwendbare UI-Komponenten
```

## 🧪 Qualitätssicherung

| Prüfung | Befehl |
| :-- | :-- |
| ESLint | `npm run lint` |
| TypeScript | `npx tsc --noEmit` |
| Unit-/Komponententests (Vitest) | `npm test` |
| Accessibility-Scan (axe-core, gegen Produktions-Build) | `npm run test:a11y` |
| Bundle-Analyse (Turbopack) | `npm run analyze` |

---

## 📜 Lizenz

Dieses Repository steht unter einer **proprietären Lizenz** — Einsehen ist
frei möglich, Nutzung, Bearbeitung und Weiterverbreitung sind ausschließlich
autorisierten Mitgliedern und Eigentümern des E-Motion Rennteam Aalen
vorbehalten. Details siehe [`LICENSE`](./LICENSE).
