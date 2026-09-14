# 01 – GitHub Grundlagen

## Was ist GitHub?

GitHub ist eine Plattform zum Speichern, Verwalten und Teilen von Dateien und Code – ähnlich wie eine **Cloud mit Versionshistorie**. Jede Änderung wird gespeichert, du kannst jederzeit in die Vergangenheit schauen und Fehler rückgängig machen.

```
GitHub = Google Drive + Zeitmaschine + Teamarbeit
```

---

## Wichtige Begriffe

| Begriff | Bedeutung |
|---------|-----------|
| **Repository (Repo)** | Unser gesamtes Website-Projekt – alle Dateien an einem Ort |
| **Branch** | Eine Arbeitskopie des Projekts, z.B. `website` (live) oder ein Feature-Branch |
| **Commit** | Eine gespeicherte Änderung mit Beschreibung (wie ein "Speicherpunkt") |
| **Pull Request (PR)** | Antrag, eine Änderung in den Hauptbranch zu übernehmen |
| **Merge** | Änderungen zusammenführen – z.B. Feature-Branch → `website` |
| **Clone** | Das Repo auf den eigenen Computer herunterladen |
| **Push** | Lokale Änderungen hochladen |
| **Pull** | Aktuelle Änderungen vom Server herunterladen |

---

## GitHub-Oberfläche im Browser

### Startseite des Repositories

```
┌─────────────────────────────────────────────────────────┐
│  Hudnur111 / Website---E-Motion-Rennteam-Aalen-         │
├─────────────────────────────────────────────────────────┤
│  < > Code   Issues   Pull requests   Actions   ...      │
├─────────────────────────────────────────────────────────┤
│  Branch: [website ▼]    [+ Add file]  [<> Code ▼]       │
│                                                         │
│  📁 docs/                     Vor 3 Stunden             │
│  📁 public/                   Vor 2 Tagen               │
│  📁 src/                      Vor 1 Tag                 │
│  📄 README.md                 Vor 1 Woche               │
└─────────────────────────────────────────────────────────┘
```

### Wichtige Bereiche

- **Code-Tab** → Alle Dateien des Projekts durchsuchen
- **Issues** → Aufgaben und Probleme verwalten
- **Pull requests** → Änderungsanträge anschauen und genehmigen
- **Actions** → Automatische Prozesse (Build, Deploy)

---

## Den richtigen Branch auswählen

> ⚠️ **Wichtig:** Stelle immer sicher, dass du auf dem Branch `website` arbeitest!

```
Auf GitHub oben links: Branch-Dropdown öffnen
     ┌──────────────────┐
     │ website      ✓   │  ← Dieser Branch ist live
     │ main             │
     │ claude/...       │
     └──────────────────┘
```

**Schritte:**
1. Öffne das Repository auf GitHub
2. Klicke oben links auf das Branch-Dropdown (zeigt aktuellen Branch)
3. Wähle `website`
4. Jetzt siehst du die live-aktiven Dateien

---

## Dateien suchen

### Über die Dateiansicht:
1. Klicke auf einen Ordnernamen → Ordner öffnet sich
2. Navigiere bis zur gewünschten Datei
3. Klicke auf den Dateinamen zum Öffnen

### Über die Suche (schneller):
1. Drücke die Taste **`T`** auf der Tastatur (auf der Repository-Seite)
2. Tippe den Dateinamen ein
3. Ergebnisse erscheinen sofort

```
Tipp: Taste "T" = Dateisuche, Taste "L" = Zeile anspringen
```

---

## Verlauf einer Datei ansehen

1. Öffne eine Datei in GitHub
2. Klicke oben rechts auf **"History"** (oder **"Verlauf"**)
3. Du siehst alle Änderungen mit Datum und Autor
4. Klicke auf einen Eintrag → siehst den genauen Unterschied (grün = hinzugefügt, rot = gelöscht)

---

## Nächste Schritte

- [Ordnerstruktur der Website verstehen →](./02-Repository-Struktur.md)
- [Bilder hochladen →](./03-Bilder-hochladen.md)
