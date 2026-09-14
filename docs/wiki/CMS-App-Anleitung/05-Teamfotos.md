# 👤 Teamfotos verwalten

Dieser Bereich erklärt, wie Profilfotos für Teammitglieder funktionieren.

---

## Wo liegen die Teamfotos?

Alle Einzelporträts der Teammitglieder liegen im Ordner:

```
/public/uploads/single-bilder-upload/
```

**Beispiele:**
```
Denny.jpg
David.jpg
Caroline.jpg
Feli.jpg
... (je ein Foto pro Person)
```

---

## Namenskonvention – WICHTIG!

Die Dateinamen sind **nach dem Vornamen** der Person benannt.

✅ Richtig: `Max.jpg`  
❌ Falsch: `Max_Müller.jpg`, `max.jpg`, `max-muster.jpg`

**Warum ist das wichtig?**  
Das System erkennt das passende Foto **automatisch** anhand des Vornamens. Wenn du im Admin-Panel z.B. "Max Müller" einträgst, sucht das System nach `Max.jpg` – das muss genau so heißen!

---

## Neues Profilfoto hinzufügen

### Methode A: Über die Medienbibliothek (empfohlen)

1. Öffne das Admin-Panel → **Medienbibliothek**
2. Klick auf **"+ Bild hochladen"**
3. Wähle das Foto aus
4. **Achtung:** Das Foto wird hochgeladen, aber es heißt vielleicht nicht richtig!
5. Damit das Auto-Match funktioniert: Benenne die Datei **vor dem Upload** korrekt um!

### Methode B: Beim Teammitglied direkt (einfacher)

1. **Team-Mitglieder** → Mitglied öffnen oder neu anlegen
2. Beim **Foto-Feld** auf **"Bild hochladen"** klicken
3. Foto auswählen → wird automatisch eingebunden
4. Speichern

---

## Auto-Match Funktion – wie funktioniert das?

Wenn du im Team-Formular einen **Namen einträgst** (z.B. "Caroline Schmidt"), passiert folgendes automatisch:

```
1. Du tippst: "Caroline Schmidt"
        ↓
2. System sucht nach: /uploads/single-bilder-upload/Caroline.jpg
        ↓
3. Gefunden! → Foto wird automatisch eingebunden
```

> 💡 Das System ist tolerant: Es ignoriert Großschreibung, Leerzeichen und Sonderzeichen.
> - "Timo M." → sucht nach `timom` → findet `Timo M..jpg`
> - "Nüssi" → sucht nach `nussi` → findet `Nüssi.jpg`

---

## Foto-Format für Profilbilder

| Eigenschaft | Empfehlung |
|-------------|------------|
| Format | JPG oder PNG |
| Größe | mind. 400×400 Pixel |
| Seitenverhältnis | **Quadratisch (1:1)** – sonst wird es abgeschnitten |
| Dateigröße | max. 2 MB |
| Hintergrund | Einheitlicher Hintergrund oder Outdoor-Aufnahme |

---

## Abteilungs-Banner-Fotos

Zusätzlich zu den Profilfotos gibt es auch **Gruppenfotos pro Abteilung**, die als Banner auf der Team-Seite erscheinen.

Diese liegen in:
```
/public/uploads/Team wdp/
 ├── Aero.jpg
 ├── Powertrain.jpg
 ├── Driverless.jpg
 ├── Media.jpg
 └── ...
```

Diese Fotos können **nicht** über das Admin-Panel geändert werden – das muss ein Entwickler machen.

---

## Häufige Probleme

### ❓ Das Foto erscheint nicht automatisch
**Lösung:** Überprüfe den Dateinamen – er muss genau dem Vornamen entsprechen (Groß-/Kleinschreibung beachten).

### ❓ Das Bild ist verzerrt oder abgeschnitten
**Lösung:** Verwende ein quadratisches Foto (1:1 Format).

### ❓ Das Foto ist zu dunkel/hell
**Lösung:** Bearbeite das Foto vorher in einem Programm (auch Google Fotos oder das Handy-Fotobearbeitungs-Tool reicht).

---

➡️ [Ordnerstruktur →](06-Ordnerstruktur.md)
