# 24 – Pull Requests reviewen & kommentieren

## Was ist ein Pull-Request-Review?

Wenn jemand Änderungen vorschlägt (über einen Pull Request), kann das Team diese **vor dem Merge** prüfen. Du kannst:
- Fragen stellen
- Verbesserungen vorschlagen
- Fehler melden
- Änderungen genehmigen (Approve)

---

## Pull Request öffnen und lesen

1. Gehe zum Tab **"Pull requests"**
2. Klicke auf einen offenen PR

```
┌─────────────────────────────────────────────────────────┐
│  Pull requests  (2 open)                                │
│  ─────────────────────────────────────────────────────  │
│  ● Wiki: GitHub-Anleitung erweitert    #113   gestern   │
│  ● Fix: Teamfoto-Pfad korrigiert       #114   heute     │
└─────────────────────────────────────────────────────────┘
```

3. Im PR siehst du:
   - **"Conversation"** Tab → Kommentare und Verlauf
   - **"Files changed"** Tab → Alle geänderten Dateien

---

## Dateien im PR prüfen (Files changed)

```
┌─────────────────────────────────────────────────────────┐
│  Files changed  (3)                                     │
│  ─────────────────────────────────────────────────────  │
│  content/team/anna-mueller.md     +12  -3               │
│  ─────────────────────────────────────────────────────  │
│  - role: "Ingenieurin"            ← rot = alt (gelöscht)│
│  + role: "Aerodynamik-Ingenieurin" ← grün = neu (hinzug)│
│                                                         │
│  public/uploads/anna-mueller.jpg  [Binary file added]   │
└─────────────────────────────────────────────────────────┘
```

---

## Kommentar zu einer bestimmten Zeile

1. Gehe zu **"Files changed"**
2. Fahre mit der Maus über eine Zeile → **"+"** Symbol erscheint links
3. Klicke darauf → Kommentarfeld öffnet sich

```
┌─────────────────────────────────────────────────────────┐
│  + role: "Aerodynamik-Ingenieurin"                 [+]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Sollte das nicht "Aerodynamik-Entwicklerin"     │   │
│  │ heißen laut Organigramm?                        │   │
│  └─────────────────────────────────────────────────┘   │
│  [Start a review]   [Add single comment]                │
└─────────────────────────────────────────────────────────┘
```

4. Schreibe deinen Kommentar
5. **"Add single comment"** für direkten Kommentar
6. **"Start a review"** wenn du mehrere Kommentare hast (besser!)

---

## Review einreichen (Submit Review)

Nach dem Prüfen aller Dateien:

1. Klicke oben rechts auf **"Review changes"**

```
┌─────────────────────────────────────────────────────────┐
│  Review changes                                         │
│                                                         │
│  Leave a comment:                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Sieht gut aus! Nur der Rollenname sollte        │   │
│  │ nochmal geprüft werden.                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ○ Comment    → Nur Kommentar, keine Entscheidung       │
│  ● Approve    → Änderung genehmigen ✅                  │
│  ○ Request changes → Änderungen verlangen ❌            │
│                                                         │
│                          [Submit review]                │
└─────────────────────────────────────────────────────────┘
```

### Wann welche Option?

| Option | Wann nutzen |
|--------|------------|
| **Comment** | Frage stellen, Anmerkung ohne Blockierung |
| **Approve** | Alles passt, darf gemergt werden |
| **Request changes** | Etwas muss korrigiert werden, kein Merge ohne Fix |

---

## PR genehmigen und mergen

Wenn du Admin-Rechte hast und alles passt:

1. Nachdem du **Approved** hast (oder direkt):
2. Scrolle nach unten zum grünen **"Merge pull request"** Button
3. Klicke darauf → **"Confirm merge"**
4. Optional: **"Delete branch"** erscheint nach dem Merge

```
┌─────────────────────────────────────────────────────────┐
│  ✅ This branch has no conflicts with the base branch   │
│                                                         │
│  [Merge pull request ▼]                                 │
│  ○ Create a merge commit                                │
│  ○ Squash and merge                                     │
│  ○ Rebase and merge                                     │
└─────────────────────────────────────────────────────────┘
```

> Für uns: **"Create a merge commit"** ist Standard.

---

## PR ablehnen / schließen

Wenn ein PR nicht gemergt werden soll:

1. Scroll ganz nach unten
2. Klicke auf **"Close pull request"**
3. Optional: Kommentar warum geschlossen

---

## Kommentar-Thread als erledigt markieren

Wenn ein Kommentar bearbeitet wurde:

1. Öffne den Kommentar-Thread
2. Klicke auf **"Resolve conversation"**
3. Thread wird grau und eingeklappt

---

## Zusammenfassung

```
PR öffnen → "Files changed" lesen → Kommentare schreiben
→ "Review changes" → Approve / Request changes
→ Bei Approve: "Merge pull request"
```
