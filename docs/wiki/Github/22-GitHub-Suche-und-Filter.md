# 22 – Suchen & Filtern auf GitHub

## Überblick: Was kann ich suchen?

GitHub bietet mächtige Suchfunktionen auf verschiedenen Ebenen:

| Suchbereich | Was wird durchsucht |
|-------------|---------------------|
| **Repository-Suche** | Alle Dateien und Inhalte im Repo |
| **Issues-Suche** | Issues und Pull Requests |
| **Commit-Suche** | Commit-Nachrichten |
| **Code-Suche** | Quellcode und Dateiinhalte |

---

## Schnell eine Datei finden (Tastenkürzel)

Der schnellste Weg, eine Datei im Repository zu finden:

1. Gehe zur Hauptseite des Repositories
2. Drücke die Taste **`T`** auf der Tastatur

```
┌─────────────────────────────────────────────────────────┐
│  Go to file                                             │
│  🔍 anna-mueller                                        │
│  ─────────────────────────────────────────────────────  │
│  content/team/anna-mueller.md          ← sofort sichtbar│
│  public/uploads/.../anna-mueller.jpg                    │
└─────────────────────────────────────────────────────────┘
```

3. Tippe den Dateinamen (oder Teile davon)
4. Auf das Ergebnis klicken

---

## Globale Suche (oben in der Navigationsleiste)

Klicke auf das **Suchfeld** ganz oben oder drücke `/`:

### Einfache Suche:

```
rollout 2026
anna müller
sponsor
```

### Erweiterte Suche mit Filtern:

```
repo:Hudnur111/Website---E-Motion-Rennteam-Aalen- anna

in:file rollout

path:content/team anna
```

---

## In Dateien suchen (Code-Suche)

Um in Dateiinhalten zu suchen:

1. Globale Suche oben
2. Wechsle zum Tab **"Code"**
3. Oder nutze: `repo:Hudnur111/... suchbegriff in:file`

**Beispiele:**

| Suchbegriff | Findet |
|------------|--------|
| `title: "Rollout"` | Alle Dateien mit diesem Titel |
| `department: "Aerodynamik"` | Alle Aerodynamik-Teammitglieder |
| `tier: "Platin"` | Alle Platin-Sponsoren |
| `current: true` | Das aktuelle Fahrzeug |

---

## Issues filtern und suchen

Im Issues-Tab gibt es leistungsfähige Filter:

```
┌─────────────────────────────────────────────────────────┐
│  Issues                                                 │
│  🔍 is:open label:bug                                   │
│  ─────────────────────────────────────────────────────  │
│  Filter: [Label ▼] [Assignee ▼] [Sort ▼]               │
└─────────────────────────────────────────────────────────┘
```

### Häufige Filter-Kombinationen:

| Filter | Bedeutung |
|--------|-----------|
| `is:open` | Nur offene Issues |
| `is:closed` | Nur erledigte Issues |
| `label:bug` | Nur Fehler-Issues |
| `label:content` | Nur Inhalts-Issues |
| `assignee:anna-mueller` | Nur Anna's Issues |
| `is:open label:content` | Offene Inhalts-Issues |
| `no:assignee is:open` | Offene, niemandem zugewiesene Issues |

---

## Commits durchsuchen

1. Klicke auf **"X commits"** (Commit-Verlauf)
2. Drücke `Ctrl+F` im Browser für Textsuche in der Liste
3. Oder nutze die globale Suche mit `type:commit`

```
type:commit Teamfoto        → Alle Commits mit "Teamfoto" im Text
type:commit author:anna     → Alle Commits von Anna
```

---

## Datei-Explorer: Ordner schnell navigieren

Statt durch viele Ordner zu klicken – nutze den Dateipfad oben:

```
Hudnur111 / Website---E-Motion-Rennteam-Aalen- / content / team /
              ↑              ↑                     ↑         ↑
           Klickbar!      Klickbar!             Klickbar! Klickbar!
```

Klick auf jeden Teil des Pfades führt direkt dorthin.

---

## Blame: Wer hat was geschrieben?

1. Datei öffnen
2. Oben rechts: **"Blame"** klicken
3. Siehst du: wer hat jede Zeile wann geschrieben

Nützlich wenn du verstehen willst, warum etwas so steht wie es steht.

---

## Tastenkürzel-Übersicht

| Taste | Funktion |
|-------|---------|
| `T` | Dateisuche öffnen |
| `L` | Zu Zeilennummer springen |
| `W` | Branch wechseln |
| `Y` | Permalink zur aktuellen Dateiversion |
| `/` | Suchfeld fokussieren |
| `?` | Alle Tastenkürzel anzeigen |
