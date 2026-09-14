# 29 – Professioneller Bild-Optimierungs-Workflow

## Warum Bilder optimieren?

| Nicht optimiert | Optimiert |
|----------------|-----------|
| 8 MB JPG | 280 KB JPG |
| Lädt 4–8 Sekunden | Lädt < 0.5 Sekunden |
| Hohe Server-Kosten | Geringe Server-Kosten |
| Schlechter Google-Score | Besseres SEO-Ranking |

**Faustregel:** Jedes Bild unter **500 KB** bringen, ohne sichtbaren Qualitätsverlust.

---

## Vollständiger Workflow: Von der Kamera zur Website

### Schritt 1: Bild erhalten / auswählen

```
Kamera-Speicherkarte / Handy / Fotograf
         ↓
Originaldatei sichern! (nie das Original bearbeiten)
         ↓
Bestes Bild auswählen
```

### Schritt 2: Bild zuschneiden

Zuschneiden auf das richtige Seitenverhältnis:

| Verwendung | Seitenverhältnis | Pixel |
|-----------|-----------------|-------|
| Teamfoto | 1:1 (quadratisch) | 800×800 |
| Titelbild (News/Blog) | 16:9 | 1200×675 |
| Galerie | 4:3 oder 16:9 | 1920×1080 |
| Sponsor-Logo | variabel | 400×200 |
| Fahrzeugbild | 16:9 | 1920×1080 |

**Kostenlose Tools zum Zuschneiden:**
- Windows: Paint / Fotos-App
- Mac: Vorschau
- Online: [crop-image.com](https://crop-image.com)

### Schritt 3: Bild komprimieren

**Empfohlenes Tool: [squoosh.app](https://squoosh.app)**

```
┌─────────────────────────────────────────────────────────┐
│  squoosh.app                                            │
│  ─────────────────────────────────────────────────────  │
│  [Bild hochladen / reinziehen]                         │
│                                                         │
│  Links:  Original (8.2 MB)  │  Rechts: Optimiert       │
│                                                         │
│  Format: MozJPEG            ← am besten für Fotos       │
│  Qualität: 75               ← guter Kompromiss          │
│  Größe: 1920×1080           ← oder kleiner              │
│                                                         │
│  Ergebnis: 285 KB  (-96%)                               │
│                                                         │
│  [Download]                                             │
└─────────────────────────────────────────────────────────┘
```

**Einstellungen nach Bildtyp:**

| Typ | Format | Qualität | Zielgröße |
|-----|--------|---------|---------|
| Foto (Team, Galerie) | MozJPEG | 75–80 | < 500 KB |
| Titelbild | MozJPEG | 80–85 | < 800 KB |
| Logo (mit Transparenz) | WebP oder PNG | – | < 100 KB |
| Logo (ohne Transparenz) | MozJPEG | 80 | < 150 KB |

**Alternative: [tinypng.com](https://tinypng.com)**
- Einfacher: Bild reinziehen, optimierte Version herunterladen
- Kein Formatwechsel nötig
- Bis zu 20 Bilder gleichzeitig

### Schritt 4: Datei umbenennen

Vor dem Hochladen den Dateinamen anpassen:

```
❌ DSC_4821.JPG
❌ IMG_20260915_134523.jpg
❌ Foto Anna Müller.jpg

✅ anna-mueller.jpg             (Teamfoto)
✅ fsg-2026-podium.jpg          (Galerie)
✅ sponsor-bosch-logo.png       (Sponsor)
✅ em-26-rollout-titelbild.jpg  (Fahrzeug/News)
```

**Regeln:**
- Nur Kleinbuchstaben
- Wörter mit `-` trennen
- Keine Leerzeichen, Umlaute oder Sonderzeichen
- Beschreibend und eindeutig

### Schritt 5: Hochladen

→ Siehe [03-Bilder-hochladen.md](./03-Bilder-hochladen.md)

---

## Batch-Optimierung (viele Bilder auf einmal)

Für 20+ Fotos nach einem Event:

**Online: [tinypng.com](https://tinypng.com)**
1. Bis zu 20 Bilder gleichzeitig einziehen
2. Alle auf einmal herunterladen (ZIP)

**Windows: IrfanView (kostenlos)**
1. Herunterladen: irfanview.com
2. File → Batch Conversion / Rename
3. Alle Bilder auswählen → JPG, Qualität 80% → Los

**Mac: Preview (eingebaut)**
1. Alle Bilder im Finder auswählen → Mit Vorschau öffnen
2. Bearbeiten → Alle auswählen → Werkzeuge → Größe anpassen

---

## Qualitätskontrolle vor dem Upload

**Checkliste:**
- [ ] Dateiformat korrekt (JPG/PNG/WebP)?
- [ ] Dateigröße < 2 MB (Ziel < 500 KB)?
- [ ] Dateiname korrekt (Kleinbuchstaben, keine Umlaute)?
- [ ] Bild scharf und gut belichtet?
- [ ] Richtige Auflösung für den Verwendungszweck?
- [ ] Keine Wasserzeichen oder Copyright-Probleme?
- [ ] Persönlichkeitsrechte: Sind alle Personen einverstanden?

---

## Bildrechte beachten

> ⚠️ **Wichtig:** Nicht einfach Bilder aus dem Internet verwenden!

| Quelle | Darf verwendet werden? |
|--------|----------------------|
| Eigene Fotos vom Team | ✅ |
| Fotos von Teammitgliedern mit Einverständnis | ✅ |
| Offizielle Pressefotos (mit Erlaubnis) | ✅ mit Nachweis |
| Google-Bilder | ❌ meist urheberrechtlich geschützt |
| Social-Media-Fotos anderer | ❌ ohne Erlaubnis |
| Lizenzfreie Bilder (Unsplash, Pexels) | ✅ mit Quellenangabe |
