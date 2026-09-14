# 27 – Redaktionsplanung mit Issues & Milestones

## GitHub als Redaktionskalender

GitHub Issues lassen sich perfekt als **Aufgaben-Board** für die Website-Planung nutzen:

```
Issue = geplanter Artikel / Aufgabe
Label = Kategorie (News, Blog, Galerie...)
Milestone = Frist / Event (z.B. "FSG 2026")
Assignee = verantwortliche Person
```

---

## Labels für Redaktionsplanung einrichten

Erstelle diese Labels einmalig (nur Admins):

1. Gehe zu **Issues → Labels → "New label"**

```
┌────────────────────────────────────────────────┐
│  Label: content-news    Farbe: #0075ca (Blau)  │
│  Label: content-blog    Farbe: #e4e669 (Gelb)  │
│  Label: content-galerie Farbe: #d73a4a (Rot)   │
│  Label: in-progress     Farbe: #0e8a16 (Grün)  │
│  Label: review-needed   Farbe: #e99695 (Rosa)  │
└────────────────────────────────────────────────┘
```

---

## Geplanten Artikel als Issue anlegen

```markdown
Titel: [NEWS] Wettbewerbsbericht FSG 2026

Inhalt:
## Aufgabe
Artikel über die Ergebnisse des FSG 2026 schreiben.

## Infos
- Datum: 12.–17. August 2026
- Ergebnis: 3. Platz Electric Class
- Fotos von: Anna Müller (35 Fotos vorhanden)

## Checkliste
- [ ] Entwurf schreiben
- [ ] Fotos auswählen und hochladen
- [ ] Titelbild erstellen (1200×630px)
- [ ] Auf GitHub committen
- [ ] Veröffentlicht ✅

Labels: content-news, in-progress
Assignee: max-mustermann
Milestone: FSG 2026
```

---

## Milestones: Fristen und Events organisieren

Ein **Milestone** fasst mehrere Issues zu einem Ziel zusammen (z.B. alle Aufgaben rund um einen Wettbewerb):

1. Gehe zu **Issues → Milestones → "New milestone"**

```
┌─────────────────────────────────────────────────────────┐
│  New milestone                                          │
│                                                         │
│  Title:    FSG 2026 – Hockenheim                        │
│  Due date: 2026-09-01                                   │
│  Description: Alle Aufgaben rund um den FSG 2026        │
│                                                         │
│  [Create milestone]                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Projektboard (Kanban) einrichten

Für ein visuelles Board:

1. Tab **"Projects"** im Repository
2. **"New project"** → **"Board"** auswählen
3. Spalten erstellen: `Geplant | In Bearbeitung | Review | Fertig`
4. Issues per Drag & Drop zwischen Spalten bewegen

```
┌────────────┐  ┌────────────────┐  ┌──────────┐  ┌────────┐
│  Geplant   │  │ In Bearbeitung │  │  Review  │  │ Fertig │
├────────────┤  ├────────────────┤  ├──────────┤  ├────────┤
│ FSG-Bericht│  │ Teamfotos Sept │  │ Blog Nacht│  │ News 1 │
│ Galerie Up.│  │                │  │          │  │ News 2 │
│ Sponsor NEU│  │                │  │          │  │ Team Up│
└────────────┘  └────────────────┘  └──────────┘  └────────┘
```

---

## Wiederkehrende Aufgaben als Issue-Template

Für häufige Aufgaben (z.B. "Neues Teammitglied aufnehmen") könnt ihr Templates erstellen:

1. In `.github/ISSUE_TEMPLATE/` eine Datei anlegen
2. Template definiert die Standard-Checkliste

**Beispiel-Template** für Neues Teammitglied:
```markdown
---
name: Neues Teammitglied
about: Aufnahme eines neuen Teammitglieds
---

## Name: [Vorname Nachname]

## Checkliste
- [ ] Foto erhalten und optimiert
- [ ] Foto hochgeladen: `/uploads/single-bilder-upload/`
- [ ] Content-Datei erstellt: `content/team/`
- [ ] GitHub-Zugriff eingerichtet
- [ ] In Wiki-Slack vorgestellt
```

---

## Wöchentlicher Redaktions-Workflow

```
Montag:    Issues für die Woche erstellen (was soll veröffentlicht werden?)
Mittwoch:  Status-Update: welche Issues sind fertig? Welche brauchen Hilfe?
Freitag:   Fertige Inhalte committen, Issues schließen
```
