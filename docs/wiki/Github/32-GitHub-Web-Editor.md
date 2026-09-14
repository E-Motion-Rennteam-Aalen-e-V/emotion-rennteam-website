# 32 – GitHub Web Editor (github.dev)

## Was ist der GitHub Web Editor?

Der **GitHub Web Editor** ist ein vollständiger Code-Editor direkt im Browser – ähnlich wie VS Code, aber ohne Installation. Du erreichst ihn mit einem einzigen Tastendruck.

```
GitHub im Browser  →  Taste ":"  →  github.dev Web Editor
```

---

## Web Editor öffnen

### Methode 1: Tastendruck

1. Gehe zum Repository auf GitHub
2. Drücke die Taste **`.`** (Punkt) auf der Tastatur
3. Der Web Editor öffnet sich sofort im Browser

### Methode 2: URL ändern

```
Vorher: github.com/Hudnur111/Website---E-Motion...
Nachher: github.dev/Hudnur111/Website---E-Motion...
         ↑ nur ".com" zu ".dev" ändern
```

---

## Oberfläche des Web Editors

```
┌─────────────────────────────────────────────────────────┐
│  🗂 Explorer  🔍 Suche  🌿 Git  ⚙️ Extensions           │
│  ─────────────────────────────────────────────────────  │
│  EXPLORER                                               │
│  ▼ Website---E-Motion...                                │
│    ▶ content/                                           │
│    ▶ docs/                                              │
│    ▶ public/                                            │
│    ▶ src/                                               │
│  ─────────────────────────────────────────────────────  │
│  content/news/rollout-2026.md           [Tab oben]      │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ---                                             │   │
│  │ title: "Rollout 2026"                           │   │
│  │ date: 2026-03-15                                │   │
│  │ ---                                             │   │
│  │                                                 │   │
│  │ ## Einleitung                                   │   │
│  └─────────────────────────────────────────────────┘   │
│  ─────────────────────────────────────────────────────  │
│  🌿 main  ⚡ 0 ⚠ 0                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Vorteile gegenüber normalem GitHub-Editor

| Feature | GitHub Browser | Web Editor (.dev) |
|---------|---------------|-------------------|
| Mehrere Dateien gleichzeitig öffnen | ❌ | ✅ |
| Ordner-Navigation (Sidebar) | Eingeschränkt | ✅ vollständig |
| Suchen & Ersetzen | ❌ | ✅ |
| Markdown-Vorschau | ❌ | ✅ (Ctrl+Shift+V) |
| Syntax-Highlighting | Minimal | ✅ vollständig |
| Mehrere Tabs | ❌ | ✅ |
| Commit-Nachrichten | Einfach | Gut |

---

## Dateien bearbeiten im Web Editor

1. Im linken Datei-Explorer auf die Datei klicken
2. Direkt im Editor bearbeiten
3. Änderungen werden automatisch gespeichert (lokaler Stand)

### Commit erstellen

1. Klicke auf das **Git-Symbol** (🌿 links in der Sidebar)
2. Du siehst alle geänderten Dateien
3. Commit-Nachricht eingeben
4. Haken-Symbol klicken (✓) → **Commit & Push**

```
┌───────────────────────────────┐
│  SOURCE CONTROL               │
│  ─────────────────────────── │
│  Message: Artikel aktualisiert│
│  [✓ Commit & Push]            │
│                               │
│  Changes (2)                  │
│  M content/news/artikel.md    │
│  M content/team/anna.md       │
└───────────────────────────────┘
```

---

## Markdown-Vorschau

Um die formatierte Ansicht zu sehen:

1. Datei öffnen (`.md`)
2. Drücke **`Ctrl+Shift+V`** (Windows/Linux) oder **`Cmd+Shift+V`** (Mac)
3. Vorschau öffnet sich nebeneinander

---

## Suchen & Ersetzen

Im Web Editor:
- **`Ctrl+F`** → Suchen in aktueller Datei
- **`Ctrl+H`** → Suchen & Ersetzen
- **`Ctrl+Shift+F`** → Suchen in allen Dateien

**Beispiel:** Alten Sponsor-Namen überall ersetzen:
```
Suchen:   "Firma Alt GmbH"
Ersetzen: "Neue Firma AG"
→ Alle Vorkommen auf einmal ersetzen
```

---

## Wann Web Editor, wann normaler Browser?

| Aufgabe | Normaler Browser | Web Editor (.dev) |
|---------|-----------------|-------------------|
| Eine Datei bearbeiten | ✅ einfacher | ✅ auch möglich |
| Mehrere Dateien bearbeiten | ❌ umständlich | ✅ ideal |
| Suchen & Ersetzen | ❌ | ✅ |
| Bild hochladen | ✅ | ❌ (nicht möglich) |
| Markdown-Vorschau | ❌ | ✅ |

---

## Web Editor beenden

Einfach den Browser-Tab schließen. Ungespeicherte Änderungen bleiben als Entwurf erhalten (im Browser-Storage des jeweiligen Computers).
