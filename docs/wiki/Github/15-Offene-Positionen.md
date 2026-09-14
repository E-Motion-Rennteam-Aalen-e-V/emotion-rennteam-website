# 15 – Offene Positionen verwalten

## Aufbau

Stellenausschreibungen liegen in `content/positions/` als `.md`-Dateien.

---

## Neue Stelle ausschreiben

1. Navigiere zu `content/positions/`
2. **"+ Add file" → "Create new file"**
3. Dateiname: `abteilung-aufgabe.md`
   ```
   aerodynamik-cfd-ingenieur.md
   software-embedded-entwickler.md
   marketing-social-media.md
   ```

```markdown
---
title: "CFD-Ingenieur/in – Aerodynamik"
department: "Aerodynamik"
commitment: "10–15 Stunden/Woche"
---

## Was dich erwartet

Du arbeitest an der Aerodynamik-Optimierung unseres Formula-Student-Fahrzeugs. Deine Hauptaufgabe ist die CFD-Simulation (Ansys Fluent) und die Auswertung von Windkanalversuchen.

## Was du mitbringen solltest

- Studium im Bereich Maschinenbau, Fahrzeugtechnik oder vergleichbar
- Interesse an Strömungssimulation
- Idealerweise erste Erfahrungen mit Ansys oder OpenFOAM
- Teamgeist und Eigeninitiative

## Was wir bieten

- Praxisnahe Erfahrung im Motorsport-Umfeld
- Enge Zusammenarbeit mit erfahrenen Studierenden
- Übernahme in deine Bachelor-/Masterarbeit möglich
- Networking mit Industriesponsoren

## Bewerbung

Schick uns deine Bewerbung an: **info@e-motion-aalen.de**  
Betreff: Bewerbung Aerodynamik-Team
```

---

## Pflichtfelder

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `title` | ✅ | Stellenbezeichnung |
| `department` | Empfohlen | Abteilungsname |
| `commitment` | Empfohlen | Zeitaufwand pro Woche |

---

## Stelle entfernen (Position besetzt)

1. Datei in `content/positions/` löschen
2. Commit:
   ```
   Position "CFD-Ingenieur Aerodynamik" entfernt (besetzt)
   ```

---

## Alle aktiven Stellen auf einen Blick

```
content/positions/
├── aerodynamik-cfd-simulation.md
├── fahrwerk-mechanik.md
├── hv-elektrotechnik.md
├── software-embedded.md
└── marketing-social-media.md
```

---

## Tipp: Stelle temporär ausblenden

Wenn eine Stelle pausiert ist (noch nicht aktiv gesucht):

```markdown
---
title: "Stellen-Titel"
department: "Abteilung"
draft: true
---
```

→ Erscheint nicht auf der Website, bleibt aber als Entwurf erhalten.
