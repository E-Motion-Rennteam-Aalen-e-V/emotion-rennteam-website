# 04 – Dateien & Ordner herunterladen

## Einzelne Datei herunterladen

### Methode 1: Über die Rohdatei (empfohlen)

1. Navigiere zur gewünschten Datei auf GitHub
2. Klicke auf die Datei (sie öffnet sich in GitHub)
3. Klicke oben rechts auf **"Raw"** oder **"Download raw file"** (Pfeil-Icon)

```
┌─────────────────────────────────────────────────────────┐
│  📄 anna-mueller.jpg                                    │
│                                                         │
│  [Raw] [Blame] [History]          [✏️ Edit] [⬇ Download]│
│                                              ↑           │
│  ┌─────────────────────────────────────────────┐        │
│  │  (Bildvorschau)                             │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

4. Rechtsklick auf das Bild → "Bild speichern unter..."  
   **oder** der Browser lädt die Datei direkt herunter

---

### Methode 2: Download-Button

1. Öffne die Datei auf GitHub
2. Klicke auf das **Download-Symbol** (⬇️) oben rechts im Datei-Viewer
3. Datei wird automatisch heruntergeladen

---

## Kompletten Ordner als ZIP herunterladen

> GitHub erlaubt es **nicht**, einzelne Unterordner direkt als ZIP herunterzuladen – aber es gibt Wege:

### Option A: Ganzes Repository als ZIP (einfachste Methode)

1. Gehe zur Hauptseite des Repositories
2. Klicke auf den grünen **"< > Code"** Button
3. Wähle **"Download ZIP"**

```
┌──────────────────────────────────────────────┐
│  [< > Code ▼]                                │
│  ┌──────────────────────────────────────────┐│
│  │  Clone                                   ││
│  │  HTTPS  SSH  GitHub CLI                  ││
│  │  https://github.com/Hudnur111/...        ││
│  │                                          ││
│  │  [Open with GitHub Desktop]              ││
│  │  [Download ZIP]  ← Hier klicken!         ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

4. Eine `.zip`-Datei wird heruntergeladen
5. Entpacke sie auf deinem Computer

> 📁 Der Ordner enthält das gesamte Projekt des aktuell gewählten Branches

---

### Option B: Bestimmten Branch oder Tag als ZIP

1. Gehe zur Hauptseite des Repositories
2. Wechsle zum gewünschten Branch (z.B. `website`)
3. Klicke auf **"< > Code" → "Download ZIP"**
4. Die ZIP enthält jetzt genau den Stand dieses Branches

---

### Option C: Nur bestimmte Ordner (über GitHub Web Editor)

Wenn du nur `public/uploads/` brauchst:
1. Klicke dich durch: `public/` → `uploads/`
2. Öffne jede gewünschte Datei einzeln
3. Klicke auf Download (⬇️)

> 💡 Für viele Dateien ist es schneller, das ganze Repo als ZIP zu laden und dann nur die benötigten Ordner zu behalten.

---

## Bestimmte Version (alten Stand) herunterladen

Du kannst auch **ältere Versionen** des Projekts herunterladen:

### Via Commit-History:

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"X commits"** (z.B. "142 commits") in der Dateilibste
3. Suche den gewünschten Commit in der Liste
4. Klicke auf das `<>` Symbol rechts neben dem Commit

```
┌──────────────────────────────────────────────────────────┐
│  Commit: "Teamfoto Anna Müller hinzugefügt"              │
│  Max Mustermann · 12. Sep 2026                           │
│                                     [<>]  ← Browse files│
└──────────────────────────────────────────────────────────┘
```

5. Du siehst jetzt das Projekt wie es zu diesem Zeitpunkt war
6. Über **"< > Code" → "Download ZIP"** diese Version herunterladen

---

## Einzelne Datei in eine bestimmte Version zurückverfolgen

Wenn du wissen möchtest, wann eine Datei wie ausgesehen hat:

1. Öffne die Datei auf GitHub
2. Klicke auf **"History"** oben rechts
3. Wähle einen alten Commit aus der Liste
4. Die Datei zeigt sich im Stand von damals
5. Mit **"Raw"** kannst du diese Version herunterladen

---

## Bilder aus dem Repository nutzen

Wenn du ein Bild aus dem Repository auf der Website einbinden möchtest, ist es **nicht nötig es herunterzuladen** – du nutzt einfach den Pfad:

```
/uploads/single-bilder-upload/anna-mueller.jpg
```

Das CMS-Panel macht das automatisch für dich, wenn du ein Bild auswählst.

---

## Häufige Fragen

### "Ich kann die Download-Schaltfläche nicht finden"
→ Stelle sicher, dass du im richtigen Tab bist (Code-Tab, nicht Issues oder PRs)  
→ Du musst die Datei erst öffnen (draufklicken), dann erscheint der Download-Button

### "Die ZIP-Datei ist sehr groß"
→ Das Repo enthält alle Bilder und den Quellcode – das ist normal  
→ Entpacke nur den Ordner, den du brauchst

### "Ich möchte nur `public/uploads/` sichern"
→ Lade das ganze ZIP herunter und kopiere nur den Ordner `public/uploads/`

---

## Nächste Schritte

- [Änderungen vornehmen & Commits erstellen →](./05-Aenderungen-vornehmen.md)
- [Zurück zur Übersicht →](./README.md)
