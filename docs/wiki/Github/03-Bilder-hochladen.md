# 03 – Bilder & Dateien hochladen

## Übersicht: Wo kommen Bilder hin?

| Bildtyp | Zielordner | Benennungsregel |
|---------|-----------|-----------------|
| Team-Fotos | `public/uploads/single-bilder-upload/` | `vorname-nachname.jpg` |
| Galerie-Bilder | `public/uploads/` | Beliebig |
| Sponsor-Logos | `public/uploads/` | `sponsor-name.png` |
| Fahrzeug-Bilder | `public/uploads/` | `fahrzeug-name.jpg` |
| News/Blog-Bilder | `public/uploads/` | Beliebig, beschreibend |

---

## Schritt-für-Schritt: Bilder hochladen

### 1. Repository öffnen

Gehe auf GitHub zu:
```
https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen-
```

### 2. Branch wechseln (falls nötig)

```
Oben links: Branch-Dropdown → "website" auswählen
```

> ⚠️ Immer auf dem Branch `website` hochladen!

### 3. Zum Zielordner navigieren

**Für Team-Fotos:**
```
public/ → uploads/ → single-bilder-upload/
```

**Für alle anderen Bilder:**
```
public/ → uploads/
```

### 4. Datei hochladen

```
┌─────────────────────────────────────────────────────────┐
│  public / uploads / single-bilder-upload                │
│                                           [+ Add file ▼]│
│  ┌──────────────────────────────────────────────────┐   │
│  │  📄 anna-mueller.jpg          Vor 2 Tagen        │   │
│  │  📄 max-mustermann.jpg        Vor 5 Tagen        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                               ↑
                   Hier klicken: "+ Add file" → "Upload files"
```

**Schritte:**
1. Klicke auf **"+ Add file"** oben rechts
2. Wähle **"Upload files"**
3. Ziehe Bilder per Drag & Drop in das Upload-Feld **oder** klicke auf "choose your files"
4. Du kannst mehrere Dateien gleichzeitig hochladen

### 5. Commit-Nachricht schreiben

```
┌─────────────────────────────────────────────────────────┐
│  Commit changes                                         │
│                                                         │
│  Commit message:                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Teamfoto Max Mustermann hinzugefügt             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Optional: Extended description...                      │
│                                                         │
│  ○ Commit directly to website branch       ← WÄHLEN!   │
│  ○ Create a new branch...                              │
│                                                         │
│  [Cancel]                    [Commit changes]           │
└─────────────────────────────────────────────────────────┘
```

**Wichtig:**
- Schreibe eine klare Commit-Nachricht (z.B. `Teamfoto Anna Müller hinzugefügt`)
- Wähle **"Commit directly to website branch"**
- Klicke auf **"Commit changes"**

---

## Team-Fotos: Wichtige Regeln

Team-Fotos werden **automatisch** dem richtigen Teammitglied zugeordnet, wenn der Dateiname stimmt.

### Namenskonvention

```
Format:  vorname-nachname.jpg
Beispiel: anna-mueller.jpg
          max-mustermann.jpg
          lena-schneider.jpg
```

### Regeln:
- ✅ Nur Kleinbuchstaben
- ✅ Umlaute ersetzen: `ü → ue`, `ä → ae`, `ö → oe`, `ß → ss`
- ✅ Leerzeichen durch `-` ersetzen
- ✅ Format: `.jpg`, `.jpeg` oder `.png`
- ❌ Keine Großbuchstaben
- ❌ Keine Sonderzeichen (`!`, `@`, `#`, Leerzeichen)

### Beispiele:

| Name | Dateiname |
|------|-----------|
| Anna Müller | `anna-mueller.jpg` |
| Max Günther | `max-guenther.jpg` |
| Björn Weiß | `bjoern-weiss.jpg` |

---

## Bildoptimierung (Empfehlungen)

Bevor du ein Bild hochlädst, optimiere es:

| Bildtyp | Empfohlene Größe | Format |
|---------|-----------------|--------|
| Team-Foto | 800×800 px | JPG (80% Qualität) |
| Titelbild (News/Blog) | 1200×630 px | JPG |
| Galerie-Bild | 1920×1080 px | JPG |
| Sponsor-Logo | 400×200 px | PNG (mit Transparenz) |
| Fahrzeug-Bild | 1920×1080 px | JPG |

> 💡 **Tipp:** Nutze [squoosh.app](https://squoosh.app) oder [tinypng.com](https://tinypng.com) zum Komprimieren, bevor du hochlädst.

**Maximale Dateigröße:** < 2 MB pro Bild empfohlen

---

## Mehrere Bilder auf einmal hochladen

GitHub erlaubt es, **mehrere Dateien gleichzeitig** hochzuladen:

1. Öffne den Zielordner
2. Klicke auf **"+ Add file" → "Upload files"**
3. Markiere alle Bilder auf deinem Computer (Ctrl+A oder Shift+Klick)
4. Ziehe alle auf einmal in das Upload-Feld
5. Warte bis alle hochgeladen sind (grüner Haken)
6. Commit-Nachricht schreiben
7. Bestätigen

---

## Bild nach dem Upload prüfen

1. Navigiere zur hochgeladenen Datei
2. Klicke darauf – GitHub zeigt eine Vorschau
3. Prüfe ob das Bild korrekt aussieht
4. Die URL zeigt dir den richtigen Pfad:
   ```
   /uploads/single-bilder-upload/dein-bild.jpg
   ```

---

## Häufige Fehler

| Problem | Lösung |
|---------|--------|
| Bild erscheint nicht | Dateinamen prüfen (kein Großbuchstabe, kein Umlaut) |
| Team-Foto falsche Person | Dateiname mit CMS-Eintrag vergleichen |
| Bild zu groß/langsam | Vorher komprimieren (tinypng.com) |
| Falsches Format | Zu JPG/PNG konvertieren |
| Bild auf falschem Branch | Branch auf `website` setzen und neu hochladen |

---

## Nächste Schritte

- [Dateien herunterladen →](./04-Dateien-herunterladen.md)
- [Änderungen vornehmen →](./05-Aenderungen-vornehmen.md)
