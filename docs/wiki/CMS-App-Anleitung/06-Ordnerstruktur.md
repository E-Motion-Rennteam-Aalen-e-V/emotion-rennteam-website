# 📁 Ordnerstruktur

Hier siehst du, wo was im Projekt liegt – damit du weißt, was wohin gehört.

> ℹ️ Du musst diese Ordner **nicht manuell bearbeiten** – das Admin-Panel macht das für dich. Diese Übersicht ist nur zum Verstehen.

---

## Überblick

```
📦 Website (Projekt-Root)
 ├── 📁 content/           ← Alle Texte & Inhalte der Website
 ├── 📁 public/            ← Alles, was öffentlich zugänglich ist
 │    └── 📁 uploads/      ← Alle hochgeladenen Bilder
 ├── 📁 src/               ← Code (NUR für Entwickler)
 ├── 📁 docs/              ← Dieses Wiki und andere Dokumentationen
 └── 📄 package.json       ← Technische Konfiguration
```

---

## Der content/ Ordner – dein Arbeitsbereich

```
📁 content/
 ├── 📁 blog/              ← Blog-Beiträge
 │    ├── werkstatt-nachtschicht.md
 │    └── erstsemester-onboarding.md
 ├── 📁 gallery/           ← Galerie-Fotos (Beschreibungen)
 │    ├── rollout-2026-buehne.md
 │    └── ...
 ├── 📁 news/              ← News-Artikel
 │    └── top-10-platzierung.md
 ├── 📁 positions/         ← Offene Stellen für Mitmachen-Seite
 ├── 📁 results/           ← Erfolge und Wettbewerbsergebnisse
 ├── 📁 sponsors/          ← Sponsoren-Einträge
 │    ├── bosch.md
 │    ├── siemens.md
 │    └── ...
 ├── 📁 team/              ← Teammitglieder-Profile
 │    ├── denny-svalin.md
 │    ├── david-muster.md
 │    └── ...
 └── 📁 vehicles/          ← Fahrzeug-Einträge
      ├── ert-14-26.md
      └── ...
```

### Wie sieht eine Inhaltsdatei aus?

Jede `.md`-Datei hat dieses Format:

```
---
title: "Mein Titel"
date: "2025-01-15"
---

Hier steht der Text des Eintrags.
```

Du siehst diese Dateien **nie direkt** – das Admin-Panel übersetzt sie in ein verständliches Formular.

---

## Der uploads/ Ordner – deine Bilder

```
📁 public/uploads/
 ├── 📁 single-bilder-upload/    ← Profilfotos Teammitglieder
 │    ├── Denny.jpg
 │    ├── David.jpg
 │    └── [Vorname].jpg
 ├── 📁 galerie-upload/          ← Galerie-Fotos (manuell sortiert)
 ├── 📁 rollout-2026/            ← Rollout-Event Fotos
 ├── 📁 Team wdp/                ← Abteilungs-Gruppenfotos
 │    ├── Aero.jpg
 │    ├── Powertrain.jpg
 │    └── ...
 ├── logo.png                    ← Das Team-Logo
 ├── ert-14-26-studio.jpg        ← Fahrzeugfotos
 └── [weitere Bilder]            ← Bilder für News/Blog/etc.
```

---

## Regeln für Dateinamen

| Regel | Gut ✅ | Schlecht ❌ |
|-------|--------|------------|
| Keine Leerzeichen | `rollout-foto.jpg` | `rollout foto.jpg` |
| Nur Bindestriche | `mein-foto.jpg` | `mein_foto.jpg` |
| Kleinschreibung | `bild.jpg` | `BILD.JPG` |
| Nur Buchstaben/Zahlen | `foto-2025.jpg` | `foto@2025!.jpg` |
| **Ausnahme:** Vorname für Profilfotos | `Caroline.jpg` | - |

> ⚠️ **Wichtig:** Leerzeichen in Dateinamen können zu Problemen führen! Der Ordner `Team wdp` ist eine Ausnahme und darf nicht umbenannt werden.

---

## Der src/ Ordner – NUR für Entwickler

Hier liegt der Quell-Code der Website. **Hier solltest du als Redakteur nichts ändern**, sonst kann die Website kaputtgehen.

```
📁 src/
 ├── 📁 app/              ← Seiten-Struktur
 ├── 📁 components/       ← Wiederverwendbare Bausteine
 └── 📁 lib/              ← Hilfsfunktionen
```

---

➡️ [Häufige Fragen (FAQ) →](07-FAQ.md)
