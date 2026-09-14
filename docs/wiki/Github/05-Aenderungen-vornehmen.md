# 05 – Änderungen vornehmen, Commits & Pull Requests

## Überblick: Wie funktioniert eine Änderung?

```
1. Datei öffnen         → Auf GitHub die Datei finden
2. Bearbeiten           → Edit-Button klicken, Text ändern
3. Commit               → Änderung speichern mit Beschreibung
4. Live auf Website     → Änderung ist sofort sichtbar (auf Branch "website")
```

---

## Datei direkt bearbeiten (einfachste Methode)

### Schritt 1: Datei öffnen

1. Navigiere zu der Datei, die du bearbeiten möchtest
2. Klicke auf den Dateinamen

```
Beispiel: content/news/mein-artikel.md öffnen
content/ → news/ → mein-artikel.md
```

### Schritt 2: Bearbeitungs-Modus aktivieren

Klicke oben rechts auf das **Stift-Symbol** (✏️ "Edit this file")

```
┌─────────────────────────────────────────────────────────┐
│  📄 mein-artikel.md                                     │
│                                  [Raw] [✏️] [🗑️]        │
│                                         ↑               │
│  ---                                 Hier klicken       │
│  title: "Mein Artikel"                                  │
│  date: 2026-09-09                                       │
│  ---                                                    │
│                                                         │
│  Artikel-Inhalt hier...                                 │
└─────────────────────────────────────────────────────────┘
```

### Schritt 3: Text bearbeiten

- Der Editor öffnet sich direkt im Browser
- Bearbeite den Text wie in einem normalen Texteditor
- Oben gibt es einen **"Preview"**-Tab um das Ergebnis zu sehen

```
┌─────────────────────────────────────────────────────────┐
│  [Edit]  [Preview]                                      │
│                                                         │
│  ---                                                    │
│  title: "Unser Rollout 2026"          ← hier bearbeiten │
│  date: 2026-09-09                                       │
│  excerpt: "Zusammenfassung..."                          │
│  ---                                                    │
│                                                         │
│  ## Einleitung                                          │
│                                                         │
│  Text hier bearbeiten...                                │
└─────────────────────────────────────────────────────────┘
```

### Schritt 4: Änderung speichern (Commit)

Scrolle nach unten zum Abschnitt **"Commit changes"**:

```
┌─────────────────────────────────────────────────────────┐
│  Commit changes                                         │
│                                                         │
│  Commit message (erforderlich):                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ News-Artikel "Rollout 2026" aktualisiert        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Extended description (optional):                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Datum korrigiert und Foto hinzugefügt           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ● Commit directly to the "website" branch  ← WÄHLEN!  │
│  ○ Create a new branch...                              │
│                                                         │
│                              [Cancel] [Commit changes]  │
└─────────────────────────────────────────────────────────┘
```

**Wichtig:**
- **Commit message** = Kurze Beschreibung was du geändert hast
- Wähle **"Commit directly to the `website` branch"**
- Klicke auf **"Commit changes"**

✅ Die Änderung ist jetzt live auf der Website!

---

## Neue Datei erstellen

1. Navigiere in den Zielordner (z.B. `content/news/`)
2. Klicke auf **"+ Add file" → "Create new file"**
3. Gib oben den Dateinamen ein (z.B. `mein-neuer-artikel.md`)
4. Schreibe den Inhalt im Editor
5. Commit wie oben beschrieben

### Pflichtfelder für neue Content-Dateien:

**News-Artikel** (`content/news/dateiname.md`):
```markdown
---
title: "Titel des Artikels"
date: 2026-09-09
excerpt: "Kurze Zusammenfassung (1-2 Sätze)"
---

Hier beginnt der Inhalt des Artikels...
```

**Team-Mitglied** (`content/team/dateiname.md`):
```markdown
---
name: "Vorname Nachname"
role: "Position im Team"
department: "Fahrzeugtechnik"
photo: "/uploads/single-bilder-upload/vorname-nachname.jpg"
order: 10
---

Kurze Beschreibung der Person...
```

---

## Datei umbenennen

1. Öffne die Datei auf GitHub
2. Klicke auf das Stift-Symbol (✏️)
3. Klicke oben im Editor auf den **Dateinamen**
4. Ändere den Namen direkt
5. Commit wie gewohnt

---

## Datei löschen

> ⚠️ **Vorsicht:** Gelöschte Dateien können wiederhergestellt werden, aber es braucht technisches Wissen.

1. Öffne die Datei auf GitHub
2. Klicke auf das **Mülleimer-Symbol** (🗑️)
3. Bestätige mit einer Commit-Nachricht

---

## Gute Commit-Nachrichten schreiben

Commit-Nachrichten helfen dabei, die Historie zu verstehen.

| ✅ Gut | ❌ Schlecht |
|--------|------------|
| `Team-Mitglied Anna Müller hinzugefügt` | `update` |
| `Tippfehler auf Startseite korrigiert` | `fix` |
| `Sponsor BMW: Logo und Website-URL aktualisiert` | `changed stuff` |
| `News: Rollout-2026-Artikel veröffentlicht` | `new article` |

**Regel:** Was habe ich geändert? Warum? (Kurz und präzise)

---

## Pull Requests (für Teamarbeit)

Wenn du Änderungen machen möchtest, die **jemand anderes prüfen** soll, nutze Pull Requests:

### Wann brauchst du einen PR?
- Größere Änderungen an der Website
- Wenn du unsicher bist und jemand reviewen soll
- Wenn du auf einem separaten Branch arbeitest

### PR erstellen:

1. Mache deine Änderungen auf einem **neuen Branch** (nicht direkt auf `website`)
2. Klicke in der Repo-Startseite auf **"Pull requests"**
3. Klicke auf **"New pull request"**
4. Wähle: `base: website` ← `compare: dein-branch`
5. Füge Titel und Beschreibung hinzu
6. Klicke auf **"Create pull request"**
7. Jemand anderes kann reviewen und dann **"Merge pull request"** klicken

```
┌─────────────────────────────────────────────────────────┐
│  Vergleichen & Pull Request erstellen                    │
│                                                         │
│  base: [website ▼]  ←  compare: [mein-feature ▼]       │
│                                                         │
│  ✅ Able to merge. No conflicts.                        │
│                                                         │
│  Titel: "News-Sektion überarbeitet"                     │
│                                                         │
│  Beschreibung: ...                                      │
│                                                         │
│                          [Create pull request]          │
└─────────────────────────────────────────────────────────┘
```

---

## Änderungsverlauf anzeigen

Du kannst jede Änderung der Vergangenheit einsehen:

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"X commits"** in der Dateiliste
3. Sieh alle Änderungen chronologisch
4. Klicke auf einen Commit → siehst genau was geändert wurde

```
Grün  = hinzugefügt
Rot   = gelöscht
```

---

## Häufige Fehler

| Problem | Lösung |
|---------|--------|
| Änderung nicht sichtbar | Warte 1-2 Minuten, dann Browser neu laden |
| Edit-Button fehlt | Du bist nicht eingeloggt oder hast keine Berechtigung |
| Falscher Branch | Branch auf `website` wechseln |
| Datei kaputt nach Bearbeitung | Verlauf öffnen, vorherige Version wiederherstellen |

---

## Nächste Schritte

- [Zurück zur GitHub-Übersicht →](./README.md)
- [CMS-App nutzen →](../CMS-App-Anleitung/README.md)
