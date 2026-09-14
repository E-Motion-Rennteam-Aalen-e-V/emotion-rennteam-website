# 34 – Inhaltstypen: Vollständige Übersicht & Entscheidungshilfe

## Welchen Content-Typ soll ich erstellen?

```
Was möchte ich veröffentlichen?
│
├── Persönlicher Einblick, Behind-the-scenes, Story
│   └── → BLOG  (content/blog/)
│
├── Offizielle Ankündigung, Wettbewerbsbericht, News
│   └── → NEWS  (content/news/)
│
├── Fotos von Events/Werkstatt/Team
│   └── → GALERIE  (content/gallery/)
│
├── Neues Teammitglied aufnehmen
│   └── → TEAM  (content/team/)
│
├── Neuer Sponsor
│   └── → SPONSOREN  (content/sponsors/)
│
├── Wettbewerbsergebnis eintragen
│   └── → ERGEBNISSE  (content/results/)
│
├── Neues Fahrzeug dokumentieren
│   └── → FAHRZEUGE  (content/vehicles/)
│
├── Stelle ausschreiben
│   └── → POSITIONEN  (content/positions/)
│
└── Startseite / Kontakt / Kennzahlen anpassen
    └── → SEITENINHALTE  (content/pages/)
```

---

## Vollständige Frontmatter-Referenz nach Typ

### NEWS

```markdown
---
title: ""          # Pflicht – Titel des Artikels
date: YYYY-MM-DD   # Pflicht – Veröffentlichungsdatum
excerpt: ""        # Empfohlen – Kurzzusammenfassung (1-2 Sätze)
coverImage: ""     # Empfohlen – Pfad zum Titelbild
---
```

### BLOG

```markdown
---
title: ""          # Pflicht
date: YYYY-MM-DD   # Pflicht
author: ""         # Empfohlen – Name des Autors/der Autorin
excerpt: ""        # Empfohlen
coverImage: ""     # Empfohlen
---
```

### GALERIE

```markdown
---
title: ""                  # Pflicht – Bildbeschreibung
image: "/uploads/..."      # Pflicht – Bildpfad
category: ""               # Optional: Wettbewerb|Werkstatt|Team|Event
order: 1                   # Optional – Reihenfolge (niedriger = weiter vorne)
---
```

### TEAM

```markdown
---
name: ""                   # Pflicht – Vollständiger Name
role: ""                   # Pflicht – Position/Aufgabe
department: ""             # Optional – Abteilung
photo: "/uploads/..."      # Pflicht – Profilfoto-Pfad
linkedin: ""               # Optional – LinkedIn-URL
order: 10                  # Optional – Reihenfolge
---
Kurzbeschreibung der Person (optional)
```

### SPONSOREN

```markdown
---
name: ""                   # Pflicht – Firmenname
tier: ""                   # Pflicht – Platin|Gold|Silber|Partner
logo: "/uploads/..."       # Empfohlen – Logo-Pfad
website: ""                # Empfohlen – https://...
---
Beschreibung des Sponsorings (optional)
```

### ERGEBNISSE

```markdown
---
title: ""                  # Pflicht – Wettbewerbsname + Jahr
year: 2026                 # Pflicht – Jahr als Zahl
event: ""                  # Pflicht – Voller Eventname + Ort
placement: ""              # Empfohlen – "3. Platz Electric Class"
---
Detaillierter Bericht (optional)
```

### FAHRZEUGE

```markdown
---
name: ""                   # Pflicht – z.B. "EM-26"
year: 2026                 # Pflicht – Baujahr
tagline: ""                # Optional – Kurzslogan
coverImage: "/uploads/..." # Empfohlen
current: true              # Empfohlen – true=aktuell, false=Archiv
specs:                     # Optional – technische Daten
  - label: ""
    value: ""
---
Fahrzeugbeschreibung (optional)
```

### POSITIONEN

```markdown
---
title: ""                  # Pflicht – Stellenbezeichnung
department: ""             # Empfohlen – Abteilung
commitment: ""             # Empfohlen – z.B. "10-15 Stunden/Woche"
---
Stellenbeschreibung (optional, aber empfohlen)
```

---

## Dateinamen-Konventionen

| Typ | Schema | Beispiel |
|-----|--------|---------|
| News | `YYYY-MM-kurzname.md` | `2026-03-rollout-em26.md` |
| Blog | `YYYY-MM-kurzname.md` | `2026-09-nacht-vor-wettbewerb.md` |
| Galerie | `beschreibung.md` | `fsg-2026-podium.md` |
| Team | `vorname-nachname.md` | `anna-mueller.md` |
| Sponsor | `firmenname.md` | `bosch-engineering.md` |
| Ergebnis | `YYYY-event.md` | `2026-formula-student-germany.md` |
| Fahrzeug | `fahrzeugname.md` | `em-26.md` |
| Position | `abteilung-aufgabe.md` | `aerodynamik-cfd.md` |

---

## Vollständige Ordnerstruktur (Content)

```
content/
├── blog/           → Blog-Artikel
├── gallery/        → Galerie-Einträge
├── news/           → News-Artikel
├── pages/          → Seiteninhalte (home.md, contact.md, team.md)
├── positions/      → Offene Stellen
├── results/        → Wettkampf-Ergebnisse
├── sponsors/       → Sponsoren
├── team/           → Teammitglieder
└── vehicles/       → Fahrzeuge
```

---

## Weiterführende Anleitungen

| Typ | Detaillierte Anleitung |
|-----|----------------------|
| Team | [09-Team-Mitglieder-verwalten.md](./09-Team-Mitglieder-verwalten.md) |
| News/Blog | [10-News-und-Blog.md](./10-News-und-Blog.md) |
| Galerie | [11-Galerie-verwalten.md](./11-Galerie-verwalten.md) |
| Sponsoren | [12-Sponsoren-verwalten.md](./12-Sponsoren-verwalten.md) |
| Ergebnisse | [13-Wettkampfergebnisse.md](./13-Wettkampfergebnisse.md) |
| Fahrzeuge | [14-Fahrzeuge-verwalten.md](./14-Fahrzeuge-verwalten.md) |
| Positionen | [15-Offene-Positionen.md](./15-Offene-Positionen.md) |
| Seiteninhalte | [16-Seiteninhalt-bearbeiten.md](./16-Seiteninhalt-bearbeiten.md) |
