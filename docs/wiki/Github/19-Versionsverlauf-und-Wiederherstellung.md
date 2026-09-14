# 19 – Versionsverlauf & Änderungen rückgängig machen

## Warum ist das wichtig?

GitHub speichert **jede Änderung** mit Datum, Autor und Beschreibung. Du kannst:
- Nachvollziehen, wer wann was geändert hat
- Alte Versionen einer Datei anzeigen
- Versehentliche Änderungen rückgängig machen

```
GitHub = Zeitmaschine für alle Dateiänderungen
```

---

## Commit-Verlauf eines Repositories

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"X commits"** über der Dateiliste

```
┌─────────────────────────────────────────────────────────┐
│  📁 content/      News-Artikel korrigiert    3 days ago  │
│  📁 public/       Teamfoto Anna hochgeladen  5 days ago  │
│  📁 src/          Fix: Mobile Navigation     1 week ago  │
│                                  ↑                       │
│                          "142 commits"  ← Hier klicken  │
└─────────────────────────────────────────────────────────┘
```

3. Du siehst alle Commits mit:
   - Commit-Nachricht
   - Autor (Name + Avatar)
   - Datum und Uhrzeit
   - Commit-Hash (eindeutige ID)

---

## Verlauf einer einzelnen Datei

Um nur die Änderungen an einer bestimmten Datei zu sehen:

1. Öffne die Datei (z.B. `content/news/rollout-2026.md`)
2. Klicke oben rechts auf **"History"**
3. Liste aller Änderungen an dieser Datei erscheint

---

## Alte Version einer Datei anzeigen

1. Im Datei-Verlauf auf einen alten Commit klicken
2. Du siehst die Datei wie sie zu diesem Zeitpunkt war
3. Über **"Raw"** kannst du den Inhalt kopieren

---

## Änderung rückgängig machen (Revert)

### Methode 1: Inhalt manuell zurücksetzen

Einfachste Methode für kleine Textkorrekturen:

1. Öffne den alten Commit (über History)
2. Kopiere den alten Inhalt (**"Raw"** → Alles kopieren)
3. Gehe zurück zur aktuellen Datei
4. Stift-Symbol (✏️) → alten Inhalt einfügen
5. Committen mit Nachricht:
   ```
   Revert: Rollout-Artikel auf Stand vom 01.09.2026 zurückgesetzt
   ```

### Methode 2: Revert über GitHub (für Einzelcommits)

1. Öffne den Commit, den du rückgängig machen möchtest
2. Klicke auf **"..."** oben rechts
3. Wähle **"Revert"**
4. Ein neuer Commit wird automatisch erstellt, der die Änderung rückgängig macht

---

## Was genau hat sich geändert? (Diff ansehen)

Beim Klick auf einen Commit siehst du den **Diff** (Unterschied):

```
┌─────────────────────────────────────────────────────────┐
│  content/news/rollout-2026.md                           │
│  ─────────────────────────────────────────────────────  │
│  @@ -5,7 +5,7 @@                                        │
│  - date: 2026-02-15           ← rot = gelöscht          │
│  + date: 2026-03-15           ← grün = hinzugefügt      │
│                                                         │
│    title: "Rollout 2026"                                │
└─────────────────────────────────────────────────────────┘
```

- **Rote Zeilen** mit `-` = so sah es vorher aus
- **Grüne Zeilen** mit `+` = so sieht es jetzt aus

---

## Gelöschte Datei wiederherstellen

Wenn eine Datei versehentlich gelöscht wurde:

1. Suche im Commit-Verlauf nach dem Commit, der die Datei gelöscht hat
2. Klicke auf den Commit
3. Klicke auf die Datei (sie erscheint in Rot als "deleted")
4. Klicke auf **"View file"** (zeigt alten Inhalt)
5. Klicke auf **"Raw"** → Inhalt kopieren
6. Gehe zum ursprünglichen Ordner
7. **"+ Add file" → "Create new file"** → Datei neu anlegen
8. Alten Inhalt einfügen → committen

---

## Wer hat eine Datei zuletzt bearbeitet?

1. Öffne die Datei
2. Klicke oben auf **"Blame"**
3. Du siehst für jede Zeile: wer hat sie wann geschrieben?

```
┌──────────────────────────────────────────────────────┐
│ anna-mueller  vor 3 Tagen  │ ---                     │
│                            │ title: "Rollout 2026"   │
│ max-muster    vor 1 Woche  │ date: 2026-03-15        │
│                            │ ---                     │
└──────────────────────────────────────────────────────┘
```

---

## Zusammenfassung: Was kann ich rückgängig machen?

| Situation | Lösung |
|-----------|--------|
| Tippfehler eingebaut | Direkt bearbeiten und neu committen |
| Falsches Bild hochgeladen | Neues Bild mit gleichem Namen hochladen (überschreibt) |
| Datei falsch bearbeitet | History → alte Version kopieren → neu committen |
| Datei gelöscht | History → alten Inhalt kopieren → neu erstellen |
| Größeres Chaos | Admin kontaktieren für technisches Revert |
