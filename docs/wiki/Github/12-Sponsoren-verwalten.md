# 12 – Sponsoren verwalten

## Aufbau der Sponsor-Daten

Jeder Sponsor hat eine `.md`-Datei in `content/sponsors/`. Die Logos liegen in `public/uploads/`.

---

## Neuen Sponsor hinzufügen

### Schritt 1: Logo hochladen

1. Navigiere zu `public/uploads/`
2. **"+ Add file" → "Upload files"**
3. Dateiname: `sponsor-firmenname.png`
   ```
   sponsor-bosch.png
   sponsor-mahle.png
   sponsor-solidworks.png
   ```

**Empfehlungen für Logos:**
- Format: **PNG** (mit Transparenz, kein weißer Hintergrund)
- Größe: **400 × 200 px** (Querformat)
- Hintergrund: transparent oder weiß
- Max. Dateigröße: 200 KB

### Schritt 2: Sponsor-Eintrag erstellen

1. Navigiere zu `content/sponsors/`
2. **"+ Add file" → "Create new file"**
3. Dateiname: `firmenname.md`

```markdown
---
name: "Bosch Engineering GmbH"
tier: "Gold"
logo: "/uploads/sponsor-bosch.png"
website: "https://www.bosch-engineering.com"
---

Bosch Engineering unterstützt unser Team seit 2024 mit Steuergeräten und Engineering-Know-how. Ohne ihre Unterstützung wäre das Hochvolt-System des EM-26 nicht möglich gewesen.
```

---

## Pflichtfelder

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `name` | ✅ | Offizieller Firmenname |
| `tier` | ✅ | Sponsoring-Stufe (siehe unten) |
| `logo` | Empfohlen | Pfad zum Logo |
| `website` | Empfohlen | Vollständige URL mit `https://` |
| Beschreibungstext | Empfohlen | Was sponsert die Firma, seit wann? |

---

## Sponsoring-Stufen (`tier`)

| Stufe | Bedeutung |
|-------|-----------|
| `Platin` | Hauptsponsor – größte Präsenz |
| `Gold` | Wichtiger Sponsor |
| `Silber` | Mittlerer Sponsor |
| `Partner` | Sachsponsoren, Dienstleistungen |

> Exakte Schreibweise! `Platin` (nicht `Platinum`), `Silber` (nicht `Silver`)

---

## Sponsor bearbeiten

1. `content/sponsors/firmenname.md` öffnen
2. Stift-Symbol (✏️)
3. Änderungen vornehmen (z.B. neue Website-URL, aktualisiertes Logo)
4. Committen:
   ```
   Sponsor Bosch: Logo und Website-URL aktualisiert
   ```

---

## Sponsor entfernen (Sponsoring beendet)

1. Datei in `content/sponsors/` löschen
2. Logo aus `public/uploads/` löschen
3. Commit:
   ```
   Sponsor XY entfernt (Sponsoring 2025 beendet)
   ```

---

## Logo ersetzen (neues Design)

1. Neues Logo unter **demselben Dateinamen** in `public/uploads/` hochladen
2. GitHub fragt: "Overwrite?" → bestätigen
3. Kein Änderung an der `.md`-Datei nötig (Pfad bleibt gleich)

---

## Anzeige-Reihenfolge

Sponsoren werden nach `tier` sortiert (Platin zuerst), dann alphabetisch.  
Wenn du innerhalb einer Stufe sortieren möchtest, füge ein `order`-Feld hinzu:

```markdown
---
name: "Firma XY"
tier: "Gold"
order: 2
---
```

---

## Vollständiges Beispiel

```markdown
---
name: "SolidWorks – Dassault Systèmes"
tier: "Platin"
logo: "/uploads/sponsor-solidworks.png"
website: "https://www.solidworks.com/de"
---

SolidWorks ist unser Premium-CAD-Sponsor und stellt dem gesamten Team unbegrenzte Lizenzen für die 3D-Konstruktionssoftware zur Verfügung. Alle Fahrzeugkomponenten des EM-26 wurden in SolidWorks entwickelt.
```
