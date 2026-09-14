# 14 – Fahrzeuge verwalten

## Aufbau

Fahrzeug-Einträge liegen in `content/vehicles/` als `.md`-Dateien.

---

## Neues Fahrzeug hinzufügen

### Schritt 1: Titelbild hochladen

1. `public/uploads/` → **"+ Add file" → "Upload files"**
2. Bildname: `fahrzeug-em26.jpg`
3. Empfohlene Größe: **1920 × 1080 px**

### Schritt 2: Fahrzeug-Datei erstellen

1. Navigiere zu `content/vehicles/`
2. **"+ Add file" → "Create new file"**
3. Dateiname: `em-26.md`

```markdown
---
name: "EM-26"
year: 2026
tagline: "Schneller. Leichter. Smarter."
coverImage: "/uploads/fahrzeug-em26.jpg"
current: true
specs:
  - label: "Motor"
    value: "Permanentmagnet-Synchronmotor, 2× 27 kW"
  - label: "Batterie"
    value: "85 kWh Hochvolt-Akkupack"
  - label: "Gewicht"
    value: "210 kg (inkl. Fahrer)"
  - label: "Beschleunigung"
    value: "0–100 km/h in 3,1 s"
  - label: "Höchstgeschwindigkeit"
    value: "120 km/h"
  - label: "Radstand"
    value: "1530 mm"
---

## Beschreibung

Der EM-26 ist die sechste Generation unseres Formula-Student-Fahrzeugs. Im Vergleich zum Vorgänger EM-25 wurde das Fahrzeug um 18 kg leichter und zeigt verbesserte Aerodynamik-Werte...

## Highlights

- Vollständig überarbeitetes Aerodynamik-Paket
- Neues aktives Fahrwerk
- Optimiertes Batterie-Management-System
```

---

## Pflichtfelder

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `name` | ✅ | Fahrzeugname (z.B. `"EM-26"`) |
| `year` | ✅ | Baujahr als Zahl |
| `tagline` | Nein | Kurzer Werbeslogan |
| `coverImage` | Empfohlen | Pfad zum Titelbild |
| `current` | Empfohlen | `true` = aktuelles Fahrzeug, `false` = Archiv |
| `specs` | Empfohlen | Liste technischer Daten |

---

## Technische Daten (`specs`) richtig formatieren

Die `specs` sind eine Liste von Schlüssel-Wert-Paaren:

```markdown
specs:
  - label: "Bezeichnung des Wertes"
    value: "Der Wert"
  - label: "Motor"
    value: "2× 27 kW PMSM"
  - label: "Gewicht"
    value: "210 kg"
```

> ⚠️ Einrückung ist wichtig! 2 Leerzeichen vor `- label:` und 4 Leerzeichen vor `label:` und `value:`

---

## Aktuelles vs. archiviertes Fahrzeug

```markdown
current: true   → Wird auf der Startseite als "aktuelles Fahrzeug" hervorgehoben
current: false  → Erscheint im Fahrzeug-Archiv
```

Wenn ein neues Fahrzeug hinzukommt:
1. Altes Fahrzeug: `current: false` setzen
2. Neues Fahrzeug: `current: true` setzen

---

## Fahrzeug-Übersicht

```
content/vehicles/
├── em-26.md    (current: true)
├── em-25.md    (current: false)
├── em-24.md    (current: false)
└── em-23.md    (current: false)
```
