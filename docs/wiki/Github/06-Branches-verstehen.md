# 06 – Branches verstehen & nutzen

## Was ist ein Branch?

Ein Branch ist eine **parallele Arbeitskopie** des Projekts. Stell dir vor, du hast ein Dokument und möchtest Änderungen ausprobieren, ohne das Original zu beschädigen – du kopierst es, arbeitest an der Kopie und fügst sie später zusammen.

```
website (live) ─────────────────────────────────────────► 
                     │                            │
                     ▼                            │ Merge
               feature-branch ──────────────────►│
               (Entwurf/Test)
```

---

## Unsere Branch-Struktur

| Branch | Zweck | Wer arbeitet hier? |
|--------|-------|--------------------|
| `website` | **Live-Website** – was Besucher sehen | Nur fertige Änderungen |
| `claude/...` | Temporäre Entwicklungs-Branches | Claude Code (KI) |
| `feature/...` | Neue Features in Entwicklung | Entwickler |

> ⚠️ **Regel:** Direkte Commits auf `website` nur für kleine, sichere Änderungen wie Bilder oder Textkorrekturen.

---

## Branch wechseln auf GitHub

```
┌─────────────────────────────────────────────────────────┐
│  Hudnur111 / Website---E-Motion-Rennteam-Aalen-         │
│                                                         │
│  [⎇ website ▼]  ← Hier klicken                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔍 Filter branches...                          │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  Branches                                       │   │
│  │  ✓ website           (default)                  │   │
│  │    claude/fix-header                            │   │
│  │    claude/new-team-page                         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Branch-Vergleich (was hat sich geändert?)

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"X branches"** (unter dem Branch-Dropdown)
3. Du siehst alle aktiven Branches
4. Klicke auf **"Compare"** neben einem Branch
5. GitHub zeigt dir alle Unterschiede zur `website`-Branch

---

## Wann brauche ich einen neuen Branch?

| Situation | Empfehlung |
|-----------|-----------|
| Kleines Bild hochladen | Direkt auf `website` |
| Tippfehler korrigieren | Direkt auf `website` |
| Neue komplette Seite | Neuer Branch + PR |
| Größere Umstrukturierung | Neuer Branch + PR |
| Unsicher ob Änderung korrekt | Neuer Branch + PR |

---

## Branch selbst erstellen (im Browser)

1. Klicke auf das Branch-Dropdown
2. Tippe den Namen des neuen Branches ein (z.B. `update/startseite`)
3. Klicke auf **"Create branch: update/startseite"**

```
┌──────────────────────────────┐
│  🔍 update/startseite        │
│  ─────────────────────────── │
│  Create branch:              │
│  update/startseite           │
│  from 'website'              │
└──────────────────────────────┘
```

4. Du bist jetzt automatisch auf dem neuen Branch
5. Mache deine Änderungen
6. Erstelle dann einen Pull Request zurück zu `website`

---

## Alte/fertige Branches löschen

Branches nach dem Merge immer aufräumen:

1. Gehe zu **"Branches"** (unter dem Branch-Dropdown)
2. Klicke auf den roten **Mülleimer** neben einem erledigten Branch
3. Bestätigen

> Gelöschte Branches können wiederhergestellt werden, solange der Merge noch existiert.

---

## Zusammenfassung

```
Kleine Änderung  → direkt auf "website" committen
Große Änderung   → neuen Branch → PR → Merge → Branch löschen
```
