# 11 – Galerie verwalten

## Wie funktioniert die Galerie?

Jedes Bild in der Galerie hat eine eigene `.md`-Datei in `content/gallery/`, die beschreibt welches Bild gezeigt wird und in welche Kategorie es gehört.

```
content/gallery/rollout-2026-01.md  →  /uploads/galerie/rollout-2026-01.jpg
content/gallery/werkstatt-nacht.md  →  /uploads/galerie/werkstatt-nacht.jpg
```

---

## Neues Galerie-Bild hinzufügen

### Schritt 1: Bild hochladen

1. Navigiere zu `public/uploads/`
2. **"+ Add file" → "Upload files"**
3. Bild hochladen – empfohlene Größe: **1920 × 1080 px**
4. Beschreibenden Dateinamen wählen:
   ```
   galerie-rollout-2026-01.jpg
   galerie-team-werkstatt-09.jpg
   galerie-fsg-hockenheim-2026.jpg
   ```

### Schritt 2: Galerie-Eintrag erstellen

1. Navigiere zu `content/gallery/`
2. **"+ Add file" → "Create new file"**
3. Dateiname wie der Bildname (ohne Bildformat):
   ```
   galerie-rollout-2026-01.md
   ```

```markdown
---
title: "Rollout EM-26 – Enthüllung in der Hochschule"
image: "/uploads/galerie-rollout-2026-01.jpg"
category: "Wettbewerb"
order: 1
---
```

---

## Pflichtfelder

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `title` | ✅ | Beschreibender Bildtitel |
| `image` | ✅ | Pfad zum Bild in `/uploads/` |
| `category` | Nein | Für Filter auf der Website |
| `order` | Nein | Reihenfolge (klein = weiter vorne) |

---

## Erlaubte Kategorien

```
Wettbewerb
Werkstatt
Team
Event
```

> Exakte Schreibweise verwenden!

---

## Reihenfolge der Bilder steuern

Das `order`-Feld bestimmt die Anzeigereihenfolge:

```
order: 1   → erstes Bild (oben links)
order: 10  → 10. Bild
order: 99  → letztes Bild
```

Ohne `order` werden Bilder alphabetisch nach Dateinamen sortiert.

---

## Bild aus der Galerie entfernen

1. Lösche die `.md`-Datei in `content/gallery/`
2. Optional: Bild aus `public/uploads/` löschen (spart Speicherplatz)

---

## Mehrere Bilder auf einmal hinzufügen

Für ein Event wie den FSG 2026 mit 20 Fotos:

1. Alle Bilder vorbereiten (benennen, komprimieren)
2. Alle auf einmal in `public/uploads/` hochladen (GitHub unterstützt Mehrfach-Upload)
3. Für jedes Bild eine `.md`-Datei in `content/gallery/` erstellen

**Tipp:** Nutze das CMS-Admin-Panel (`/admin` → "Galerie") – dort geht es schneller als auf GitHub direkt.

---

## Bilder für die Galerie optimieren

| Eigenschaft | Empfehlung |
|------------|-----------|
| Auflösung | 1920 × 1080 px (oder höher) |
| Format | JPG (bessere Kompression für Fotos) |
| Dateigröße | Max. 2 MB (Ziel: < 500 KB) |
| Kompression | [squoosh.app](https://squoosh.app) verwenden |

---

## Galerie-Beispiel: Wettbewerbs-Fotos

Für 5 Fotos vom FSG 2026:

```
content/gallery/
├── fsg-2026-technik-abnahme.md
├── fsg-2026-skidpad.md
├── fsg-2026-autocross-01.md
├── fsg-2026-podium.md
└── fsg-2026-teamfoto.md
```

```markdown
---
title: "FSG 2026 – Technische Abnahme EM-26"
image: "/uploads/fsg-2026-technik-abnahme.jpg"
category: "Wettbewerb"
order: 10
---
```
