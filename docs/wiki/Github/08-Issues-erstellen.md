# 08 – Issues: Aufgaben & Probleme verwalten

## Was ist ein Issue?

Ein **Issue** ist ein Ticket auf GitHub – wie eine Aufgabe oder ein Fehlerbericht. Damit können Teammitglieder Probleme melden, Verbesserungen vorschlagen oder Aufgaben verfolgen.

```
Issue = Aufgabe / To-Do / Fehlermeldung / Verbesserungsvorschlag
```

---

## Issue erstellen

1. Gehe zur Hauptseite des Repositories
2. Klicke auf den Tab **"Issues"**
3. Klicke auf den grünen Button **"New issue"**

```
┌─────────────────────────────────────────────────────────┐
│  Issues                                [New issue]       │
│                                              ↑           │
│  🔍 Filter...                           Hier klicken     │
│                                                         │
│  ● Open (3)    ✓ Closed (12)                            │
│  ─────────────────────────────────────────────────────  │
│  ○ Tippfehler auf Startseite           #15  2 days ago  │
│  ○ Neues Teamfoto hochladen            #14  5 days ago  │
└─────────────────────────────────────────────────────────┘
```

4. Fülle das Formular aus:

```
┌─────────────────────────────────────────────────────────┐
│  Add a title:                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Teamfoto von Lena Schneider fehlt               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Leave a comment:                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Das Profilfoto von Lena Schneider (Abteilung    │   │
│  │ Aerodynamik) fehlt noch. Bitte hochladen unter  │   │
│  │ `/uploads/single-bilder-upload/lena-schneider.  │   │
│  │ jpg`                                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Labels: [bug] [enhancement] [documentation]            │
│  Assignees: [Niemand zugewiesen]                        │
│                                                         │
│                          [Submit new issue]             │
└─────────────────────────────────────────────────────────┘
```

5. Klicke auf **"Submit new issue"**

---

## Gute Issue-Titel schreiben

| ✅ Gut | ❌ Schlecht |
|--------|------------|
| `Teamfoto Anna Müller fehlt auf /team-Seite` | `Problem` |
| `Tippfehler: "Renntem" statt "Rennteam" auf Startseite` | `Fix needed` |
| `Sponsor-Logo von BMW nicht sichtbar (fehlt oder falsch verlinkt)` | `Logo geht nicht` |
| `News: Artikel "Rollout 2026" hat falsches Datum (März statt Februar)` | `Datum falsch` |

**Regel:** Wer liest den Titel ohne Kontext – versteht er das Problem?

---

## Labels (Kategorien)

Labels helfen beim Sortieren:

| Label | Bedeutung |
|-------|-----------|
| `bug` | Etwas funktioniert nicht |
| `enhancement` | Verbesserungsvorschlag |
| `documentation` | Änderung an Dokumentation |
| `content` | Inhaltliche Änderung (Texte, Bilder) |
| `urgent` | Dringend, muss schnell bearbeitet werden |

---

## Issue einer Person zuweisen

Rechts im Issue-Formular: **"Assignees"** → Person auswählen, die das Issue bearbeiten soll.

→ Die Person bekommt eine E-Mail-Benachrichtigung.

---

## Issue als erledigt markieren

1. Öffne das Issue
2. Schreibe einen abschließenden Kommentar (was wurde gemacht?)
3. Klicke auf **"Close issue"** (unten)

```
[Close issue]  oder  [Close with comment]
```

---

## Issues verfolgen

Im Issues-Tab siehst du:
- **Open** = noch offen / in Bearbeitung
- **Closed** = erledigt

Mit der Filterleiste kannst du nach Labels, Personen oder Stichwörtern suchen:
```
is:open label:content assignee:anna-mueller
```

---

## Issue verknüpfen mit Commit / PR

Wenn du in einer Commit-Nachricht `Fixes #15` schreibst, schließt GitHub das Issue automatisch nach dem Merge:

```
Commit message:  "Teamfoto Lena Schneider hochgeladen – Fixes #15"
→ Nach Merge: Issue #15 wird automatisch geschlossen
```
