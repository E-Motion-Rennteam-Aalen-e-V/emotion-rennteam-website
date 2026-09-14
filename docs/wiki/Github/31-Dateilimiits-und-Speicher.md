# 31 – Dateilimits, Speicher & was GitHub erlaubt

## GitHub-Limits auf einen Blick

| Limit | Wert | Was bedeutet das? |
|-------|------|------------------|
| Max. Dateigröße | **100 MB** | Größere Dateien werden abgelehnt |
| Empfohlene Dateigröße | **< 50 MB** | Über 50 MB: GitHub zeigt Warnung |
| Unsere Empfehlung (Bilder) | **< 2 MB** | Besser für Ladezeiten |
| Repository-Gesamtgröße | **1 GB** | Danach werden wir kontaktiert |
| Max. Datei im Browser bearbeiten | **1 MB** | Größere nur mit Desktop-App |
| Dateien per Upload (Browser) | **100 Dateien** | Pro Upload-Vorgang |

---

## Warum kleine Dateien wichtig sind

```
Webseite lädt Bild von 8 MB:
  → Nutzer wartet 4–8 Sekunden (mobil)
  → Google straft langsame Seiten ab (schlechtes SEO)
  → Höherer Server-Traffic (= höhere Kosten)

Webseite lädt Bild von 280 KB:
  → Lädt sofort (< 0.5 Sekunden)
  → Google bevorzugt schnelle Seiten
  → Minimaler Traffic
```

---

## Welche Dateitypen sind erlaubt?

### Bilder (empfohlen)

| Format | Wann verwenden | Unterstützung |
|--------|---------------|--------------|
| **JPG/JPEG** | Fotos, Fotorealistische Bilder | Universal |
| **PNG** | Logos mit Transparenz, Screenshots | Universal |
| **WebP** | Modernes Format, kleinste Dateigröße | Moderne Browser |
| **SVG** | Vektorgrafiken, Icons | Universal |
| GIF | Animationen (selten) | Universal |
| AVIF | Neuestes Format, noch besser als WebP | Neuere Browser |

### Nicht empfohlen für die Website

| Format | Problem |
|--------|---------|
| BMP | Sehr groß, unkomprimiert |
| TIFF | Nur für Druck, riesig |
| RAW (CR2, NEF, ARW) | Kamerarohdaten, nicht für Web |
| HEIC | iPhone-Format, Browserkompatibilität fraglich |

---

## Datei ist zu groß – was tun?

### Problem: Datei über 100 MB
→ GitHub lehnt den Upload ab

**Lösung für Bilder:**
1. Bild komprimieren (squoosh.app oder tinypng.com)
2. Auflösung reduzieren (auf 1920px Breite)
3. Format wechseln (TIFF → JPG)

**Lösung für Videos:**
- Videos gehören **nicht** ins GitHub-Repository!
- Videos auf YouTube/Vimeo hochladen und verlinken

**Lösung für andere große Dateien:**
- Admin kontaktieren (ggf. Git LFS nötig)

---

## Videos: Wie einbinden?

Videos direkt im Repository speichern ist **keine gute Idee** (zu groß, zu langsam). Stattdessen:

1. Video auf **YouTube** hochladen (öffentlich oder unlisted)
2. In einer `.md`-Datei oder im CMS verlinken:

```markdown
[![Rollout EM-26 Video](Vorschaubild-URL)](YouTube-URL)
```

Oder im Content-Bereich direkt als YouTube-Embed-Link.

---

## Speicher-Monitoring

So siehst du wie groß das Repository ist:

1. Gehe zu **Settings → General**
2. Scrolle zu "Danger Zone" → dort steht die Repository-Größe

Alternativ: **Insights → Storage** (falls verfügbar)

---

## Alte/ungenutzte Bilder löschen

Um Speicher zu sparen:

1. Überprüfe ob alle Bilder in `public/uploads/` noch verwendet werden
2. Suche in GitHub nach dem Dateinamen: `repo:... anna-mueller-alt.jpg`
3. Wenn keine Referenzen mehr: Bild löschen (🗑️)
4. Committen mit Nachricht:
   ```
   Cleanup: Ungenutzte Bilder gelöscht (3 Dateien)
   ```

---

## Zusammenfassung: Dateigröße-Leitfaden

```
Bild kommt an:
  1. Über 50 MB? → Sofort komprimieren
  2. Format BMP/TIFF/HEIC? → Zu JPG/PNG konvertieren
  3. Über 2 MB nach Komprimierung? → Nochmal komprimieren
  4. Unter 2 MB? → Hochladen ✅
```
