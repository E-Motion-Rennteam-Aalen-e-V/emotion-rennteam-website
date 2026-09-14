# 21 – GitHub Desktop App (visueller Client)

## Was ist GitHub Desktop?

GitHub Desktop ist eine **kostenlose App** für Windows und Mac, mit der du GitHub-Repositories verwalten kannst – komplett visuell, ohne Kommandozeile.

```
GitHub Desktop = GitHub im Browser + lokale Dateiverwaltung
                 in einer komfortablen Desktop-App
```

**Download:** https://desktop.github.com

---

## Wann GitHub Desktop nutzen?

| Situation | Empfehlung |
|-----------|-----------|
| Einzelne Dateien hochladen | GitHub im Browser |
| Viele Dateien auf einmal | GitHub Desktop ✅ |
| Ordner synchronisieren | GitHub Desktop ✅ |
| Änderungen vergleichen (visuell) | GitHub Desktop ✅ |
| Von unterwegs | GitHub im Browser |

---

## Einrichtung

### Schritt 1: App installieren

1. Auf https://desktop.github.com herunterladen
2. Installer ausführen
3. App öffnen

### Schritt 2: GitHub-Konto verbinden

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Desktop                                         │
│                                                         │
│  Sign in to GitHub.com       ← Hier klicken            │
│  (öffnet Browser)                                       │
│                                                         │
│  Authorize GitHub Desktop    ← Im Browser bestätigen   │
└─────────────────────────────────────────────────────────┘
```

### Schritt 3: Repository klonen

1. **File → Clone Repository**
2. Suche nach: `Website---E-Motion-Rennteam-Aalen-`
3. Wähle einen lokalen Ordner (z.B. `Dokumente/E-Motion-Website`)
4. Klicke **"Clone"**

---

## Täglich arbeiten mit GitHub Desktop

### Aktuelle Änderungen holen (Fetch/Pull)

```
┌─────────────────────────────────────────────────────────┐
│  Current branch: website                                │
│                                                         │
│  [Fetch origin]  ← Klicken um neue Änderungen zu laden │
│                                                         │
│  ↓ 3 commits behind origin  → [Pull origin]            │
└─────────────────────────────────────────────────────────┘
```

1. Klicke oben auf **"Fetch origin"**
2. Wenn neue Änderungen da: **"Pull origin"**
3. Jetzt ist dein lokaler Stand aktuell

### Dateien bearbeiten

1. Nach dem Klonen: Dateien im Windows Explorer / Finder öffnen
2. Mit beliebigem Programm bearbeiten (Texteditor, Bildbearbeitung, etc.)
3. Gespeicherte Änderungen erscheinen automatisch in GitHub Desktop

```
┌─────────────────────────────────────────────────────────┐
│  Changes  (3)                                           │
│  ─────────────────────────────────────────────────────  │
│  ✅ content/news/rollout-2026.md          modified      │
│  ✅ public/uploads/teamfoto-anna.jpg      added         │
│  ✅ content/team/anna-mueller.md          added         │
└─────────────────────────────────────────────────────────┘
```

### Änderungen committen und pushen

```
┌─────────────────────────────────────────────────────────┐
│  Summary (required):                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Teamfoto Anna Müller hinzugefügt               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Description (optional):                               │
│  Foto und Content-Datei erstellt                        │
│                                                         │
│  [Commit to website]                                    │
│                                                         │
│  → dann: [Push origin]                                  │
└─────────────────────────────────────────────────────────┘
```

1. Zusammenfassung schreiben
2. **"Commit to website"** klicken
3. **"Push origin"** klicken → Änderungen sind auf GitHub

---

## Vorteile gegenüber Browser

- Mehrere Dateien gleichzeitig hochladen (ganzer Ordner)
- Änderungen offline vorbereiten, dann gesammelt pushen
- Visueller Diff (was hat sich geändert?)
- Lokale Arbeitskopie immer verfügbar

---

## Branch in GitHub Desktop wechseln

```
Oben Mitte: [Current Branch: website ▼]
→ Anderen Branch auswählen oder neuen erstellen
```

> Immer auf `website` bleiben für Live-Änderungen!
