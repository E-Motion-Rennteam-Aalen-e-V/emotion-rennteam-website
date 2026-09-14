# 09 – Team-Mitglieder verwalten

## Übersicht

Team-Mitglieder-Daten liegen in `content/team/` als `.md`-Dateien, eine Datei pro Person. Die Website liest alle Dateien aus diesem Ordner und zeigt sie auf `/team` an.

---

## Neues Team-Mitglied hinzufügen

### Schritt 1: Foto hochladen

Zuerst das Profilfoto hochladen (bevor du den Eintrag erstellst):

1. Navigiere zu `public/uploads/single-bilder-upload/`
2. Klicke **"+ Add file" → "Upload files"**
3. Bild hochladen mit korrektem Namen:
   ```
   vorname-nachname.jpg
   Beispiel: anna-mueller.jpg
   ```

→ Detaillierte Anleitung: [03-Bilder-hochladen.md](./03-Bilder-hochladen.md)

---

### Schritt 2: Content-Datei erstellen

1. Navigiere zu `content/team/`
2. Klicke **"+ Add file" → "Create new file"**
3. Dateiname eingeben: `vorname-nachname.md`

```markdown
---
name: "Anna Müller"
role: "Aerodynamik-Ingenieurin"
department: "Aerodynamik"
photo: "/uploads/single-bilder-upload/anna-mueller.jpg"
linkedin: "https://linkedin.com/in/anna-mueller"
order: 8
---

Anna studiert Maschinenbau im 5. Semester an der HS Aalen und ist seit 2024 Teil des E-Motion-Teams. Ihr Schwerpunkt liegt auf der CFD-Simulation und dem Windkanaltest.
```

---

## Pflichtfelder

| Feld | Pflicht | Beispiel |
|------|---------|---------|
| `name` | ✅ Ja | `"Anna Müller"` |
| `role` | ✅ Ja | `"Aerodynamik-Ingenieurin"` |
| `department` | Nein | `"Aerodynamik"` |
| `photo` | ✅ Ja | `"/uploads/single-bilder-upload/anna-mueller.jpg"` |
| `linkedin` | Nein | `"https://linkedin.com/in/..."` |
| `order` | Nein | `8` (kleinere Zahl = weiter oben) |

---

## Erlaubte Abteilungen (`department`)

```
Fahrzeugtechnik
Elektrotechnik / High-Voltage
Aerodynamik
Fahrwerk
Software / Autonomous
Marketing & Finanzen
Teamleitung
```

> Der Wert muss **exakt** so geschrieben sein (Groß-/Kleinschreibung beachten!).

---

## Sortierung festlegen (`order`)

Das Feld `order` bestimmt die Reihenfolge auf der Website:

```
order: 1  → ganz oben (z.B. Teamleitung)
order: 2  → zweite Position
...
order: 99 → ganz unten
```

**Tipp für Teamleitung:** `order: 1` bis `order: 3`  
**Tipp für neue Mitglieder:** `order: 50` oder höher

---

## Bestehendes Team-Mitglied bearbeiten

1. Navigiere zu `content/team/`
2. Klicke auf die Datei der Person (z.B. `anna-mueller.md`)
3. Klicke auf das Stift-Symbol (✏️)
4. Ändere den gewünschten Wert
5. Committen mit klarer Nachricht:
   ```
   Team: LinkedIn-URL für Anna Müller aktualisiert
   ```

---

## Team-Mitglied entfernen

1. Navigiere zu `content/team/`
2. Öffne die Datei
3. Klicke auf das Mülleimer-Symbol (🗑️)
4. Commit-Nachricht:
   ```
   Team: Max Mustermann ausgetragen (nicht mehr im Team)
   ```
5. Optional: Foto aus `public/uploads/single-bilder-upload/` ebenfalls löschen

---

## Reihenfolge anpassen

Wenn du mehrere Personen umsortieren möchtest:

1. Öffne die erste Datei → `order`-Wert ändern → committen
2. Nächste Datei → ändern → committen
3. Usw.

**Tipp:** Nutze das CMS-Admin-Panel (`/admin`) – dort siehst du alle Einträge und kannst einfacher sortieren.

---

## Häufige Fehler

| Problem | Ursache | Lösung |
|---------|---------|--------|
| Foto erscheint nicht | Dateiname falsch | `vorname-nachname.jpg` prüfen (nur Kleinbuchstaben) |
| Person in falscher Abteilung | `department` falsch | Exakte Schreibweise aus der Liste verwenden |
| Person erscheint nicht | Datei hat Fehler | Frontmatter-Block prüfen (`---` vorhanden?) |
| Falsche Reihenfolge | `order` fehlt oder falsch | Zahl anpassen |
