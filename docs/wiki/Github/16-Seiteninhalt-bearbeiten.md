# 16 – Statische Seiteninhalte bearbeiten

## Was sind Seiteninhalte?

Manche Inhalte gehören zu einer festen Seite (Startseite, Kontakt, etc.) und werden nicht als Liste angezeigt. Diese liegen in `content/pages/`.

```
content/pages/
├── home.md       → Startseite-Inhalte (Slogan, Kennzahlen)
├── contact.md    → Kontaktseite (Adresse, E-Mail, Telefon)
└── team.md       → Team-Seite (Abteilungsbeschreibungen)
```

---

## Startseite bearbeiten (`home.md`)

1. Navigiere zu `content/pages/home.md`
2. Stift-Symbol (✏️) → bearbeiten

```markdown
---
title: "Startseite"
heroTitle: "E-Motion Rennteam Aalen"
heroSubtitle: "Wir entwickeln elektrische Rennfahrzeuge für die Formula Student."
stats:
  - label: "Teammitglieder"
    value: "45+"
  - label: "Wettbewerbe"
    value: "12"
  - label: "Fahrzeuge"
    value: "6"
  - label: "Gründungsjahr"
    value: "2014"
---
```

### Kennzahlen (`stats`) aktualisieren

Die Zahlen auf der Startseite (z.B. "45+ Mitglieder") werden hier gepflegt:

```markdown
stats:
  - label: "Teammitglieder"
    value: "52+"          ← Hier die Zahl anpassen
  - label: "Wettbewerbe"
    value: "14"           ← Hier anpassen
```

---

## Kontaktseite bearbeiten (`contact.md`)

```markdown
---
title: "Kontakt"
address: "Hochschule Aalen\nBeethovenstraße 1\n73430 Aalen"
email: "info@e-motion-aalen.de"
phone: "+49 7361 576-0"
socialMedia: "https://instagram.com/emotion_rennteam_aalen"
---
```

### Felder erklären:

| Feld | Inhalt |
|------|--------|
| `address` | Postadresse (mit `\n` für Zeilenumbruch) |
| `email` | Kontakt-E-Mail-Adresse |
| `phone` | Telefonnummer |
| `socialMedia` | Link zum Instagram-Profil (oder anderes) |

---

## Team-Seite: Abteilungsbeschreibungen

```markdown
---
title: "Team"
departmentDescriptions:
  - label: "Fahrzeugtechnik"
    value: "Verantwortlich für Fahrwerk, Chassis und mechanische Integration..."
  - label: "Aerodynamik"
    value: "Optimierung der aerodynamischen Eigenschaften des Fahrzeugs..."
  - label: "Elektrotechnik / High-Voltage"
    value: "Entwicklung und Integration des Hochvolt-Antriebssystems..."
---
```

---

## Wichtiger Hinweis: Adresse mit Zeilenumbrüchen

In YAML (dem Frontmatter-Format) werden Zeilenumbrüche mit `\n` angegeben:

```markdown
address: "Hochschule Aalen\nBeethovenstraße 1\n73430 Aalen"
```

→ Erscheint auf der Website als:
```
Hochschule Aalen
Beethovenstraße 1
73430 Aalen
```

---

## Änderungen nach dem Speichern prüfen

Nach dem Committen: Website im Browser neu laden (Ctrl+F5) und die bearbeitete Seite aufrufen.

> ⏱️ Manchmal dauert es 1–2 Minuten, bis Änderungen live sichtbar sind.
