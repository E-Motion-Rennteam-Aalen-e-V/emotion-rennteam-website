# 25 – Dateien umbenennen & verschieben

## Datei umbenennen (im Browser)

1. Navigiere zur Datei auf GitHub
2. Klicke auf das **Stift-Symbol** (✏️) – Bearbeitungsmodus
3. Klicke oben im Editor auf den **Dateinamen** (oben links über dem Editor)
4. Ändere den Namen direkt

```
┌─────────────────────────────────────────────────────────┐
│  content / team / [anna-muster.md]  ← Hier klicken     │
│                    ↑                   und umbenennen   │
│  Neuer Name: anna-mueller.md                            │
└─────────────────────────────────────────────────────────┘
```

5. Committen mit klarer Nachricht:
   ```
   Datei umbenannt: anna-muster.md → anna-mueller.md
   ```

---

## Datei in anderen Ordner verschieben

GitHub hat keine "Verschieben"-Schaltfläche, aber es funktioniert über den Dateinamen-Trick:

1. Datei öffnen → Stift-Symbol (✏️)
2. Im Dateinamen-Feld den **Pfad ändern**:

```
Vorher: content/team/anna-mueller.md
         ↑ klick in dieses Feld und ändere den Pfad

Nachher: content/team/archiv/anna-mueller.md
          (der Ordner "archiv" wird automatisch erstellt)
```

**Tipp:** Durch Tippen von `/` im Dateinamen-Feld wechselst du in einen Unterordner.

---

## Ordner erstellen (nur über neue Datei möglich)

GitHub erlaubt es **nicht**, leere Ordner zu erstellen. Du musst immer mindestens eine Datei haben:

1. Navigiere zum übergeordneten Ordner
2. **"+ Add file" → "Create new file"**
3. Im Dateinamen-Feld: `neuer-ordner/dateiname.md`
4. Den `/` im Namen erstellt automatisch den Ordner

```
Eingabe:   archiv/README.md
Ergebnis:  📁 archiv/
               📄 README.md
```

---

## Mehrere Dateien verschieben

Für mehrere Dateien auf einmal: GitHub Desktop verwenden (lokal verschieben, dann committen).

Mit dem Browser musst du jede Datei einzeln umbenennen/verschieben.

---

## Ordner umbenennen

GitHub hat keine direkte "Ordner umbenennen"-Funktion. Vorgehen:

1. Jede Datei im Ordner öffnen
2. Stift-Symbol → Pfad ändern (neuer Ordnername)
3. Committen

**Beispiel:**
```
Vorher: content/galerie/foto.md
Nachher: content/gallery/foto.md
```

---

## Wichtig: Pfade in Content-Dateien aktualisieren

Wenn du ein **Bild** umbenennst oder verschiebt, musst du auch alle Stellen aktualisieren, wo es referenziert wird!

**Suche nach altem Pfad:**
1. GitHub-Suche → `repo:Hudnur111/... /uploads/alter-pfad.jpg`
2. Alle gefundenen Dateien anpassen

**Beispiel:**
```markdown
❌ photo: "/uploads/anna-muster.jpg"    (altes Bild)
✅ photo: "/uploads/anna-mueller.jpg"   (neues Bild)
```

---

## Best Practices

| Situation | Empfehlung |
|-----------|-----------|
| Tippfehler im Dateinamen | Sofort umbenennen, Pfad überall anpassen |
| Ordnerstruktur ändern | Vorher mit Admin besprechen (betrifft ggf. URLs) |
| Bild umbenennen | Vorsicht: Pfad in `.md`-Dateien ebenfalls anpassen |
| Massenumbenennung | GitHub Desktop oder Admin beauftragen |
