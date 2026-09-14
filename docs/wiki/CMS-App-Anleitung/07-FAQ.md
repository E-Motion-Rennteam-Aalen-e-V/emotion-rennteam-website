# ❓ FAQ – Häufige Fragen

---

## Allgemein

### Ich habe mein Passwort vergessen – was tun?
Frag den Website-Admin (Denny). Er kann dein Passwort zurücksetzen.

### Wann ist meine Änderung auf der Live-Website sichtbar?
Meistens sofort oder nach wenigen Sekunden. Bei manchen Seiten kann es bis zu 1 Minute dauern.

### Kann ich etwas kaputt machen?
Kleine Fehler (falsche Texte, falsches Bild) ja – aber das System macht automatisch Sicherungskopien auf GitHub, sodass alles wiederhergestellt werden kann. Frag im Zweifelsfall einen Entwickler.

### Kann ich von meinem Handy aus bearbeiten?
Ja! Das Admin-Panel funktioniert auch auf dem Smartphone – am besten im Querformat.

---

## Bilder

### Welche Bildgröße ist ideal?
- **Profilfotos:** 400×400 px, quadratisch
- **Titelbild für News/Blog:** 1200×675 px (16:9)
- **Galeriebilder:** mind. 1200 px breit

### Mein Bild erscheint nicht – was tun?
1. Prüfe, ob der Upload erfolgreich war (grüne Meldung erscheint)
2. Seite neu laden (F5 oder Strg+R)
3. Cache leeren: Strg+Shift+R (Windows) oder Cmd+Shift+R (Mac)
4. Falls immer noch nichts: Melde dich beim Entwickler

### Wie komprimiere ich ein Bild, das zu groß ist?
Nutze [squoosh.app](https://squoosh.app) – kostenlos, keine Installation nötig:
1. Bild per Drag & Drop auf die Seite ziehen
2. Qualität auf ~80% einstellen
3. Herunterladen

### Das Profilfoto eines Teammitglieds wird nicht angezeigt
- Dateiname muss dem **Vornamen** entsprechen: `Max.jpg`
- Datei muss im Ordner `single-bilder-upload` liegen
- Datei muss JPG oder PNG sein

---

## Team-Seite

### Wie sortiere ich Teammitglieder?
Beim Teammitglied-Eintrag gibt es das Feld **"Reihenfolge"** – kleinere Zahl = weiter oben.

### Eine Person ist ausgeschieden – was tun?
1. Admin-Panel → Team-Mitglieder → Person anklicken
2. Unten auf **"Löschen"** klicken
3. Bestätigen

### Wie ändere ich die Abteilung eines Mitglieds?
Einfach das Dropdown-Feld **"Abteilung"** im Bearbeitungsformular ändern und speichern.

---

## News & Blog

### Was ist der Unterschied zwischen News und Blog?
- **News:** Kurze, aktuelle Meldungen (z.B. Ergebnis eines Rennens)
- **Blog:** Längere Berichte und Artikel (z.B. Erfahrungsbericht vom Event)

### Wie füge ich ein Bild in den Text ein?
Der Text-Editor hat einen Bild-Button. Alternativ: Bild-Pfad aus der Medienbibliothek kopieren und im Text verwenden.

### Ich habe einen Tippfehler im Titel – wie korrigiere ich?
1. News/Blog anklicken
2. Titel korrigieren
3. Speichern

---

## Galerie

### Wie erstelle ich ein neues Album?
Derzeit gibt es keine "Album erstellen" Funktion – einfach bei neuen Galerie-Fotos den gleichen **Album-Namen** eintragen, dann werden sie automatisch gruppiert.

### In welcher Reihenfolge erscheinen die Fotos?
Nach dem Feld **"Reihenfolge"** – kleinere Zahl = weiter vorne.

---

## Sponsoren

### Wie aktualisiere ich ein Sponsor-Logo?
1. Sponsor anklicken
2. Beim Logo-Feld altes Bild entfernen und neues hochladen
3. Speichern

### Wie ändere ich den Sponsoring-Level (Gold/Silber/Bronze)?
Das Feld **"Tier"** beim Sponsor-Eintrag anpassen.

---

## Technisch

### Was ist GitHub und warum sehe ich da manchmal Nachrichten?
GitHub ist ein System, das alle Änderungen speichert und sichert. Du musst es nicht direkt bedienen – das Admin-Panel macht das automatisch.

### Was bedeutet "Commit auf GitHub gespeichert"?
Das ist eine Erfolgsmeldung: Deine Änderung wurde nicht nur lokal gespeichert, sondern auch in der Versionsverwaltung gesichert. Das ist gut!

### Was bedeutet "Lokal gespeichert" (ohne GitHub)?
Die Änderung wurde gespeichert, aber die automatische GitHub-Sicherung hat nicht funktioniert (z.B. kein Internet). Du siehst es trotzdem auf der Website, aber ohne Sicherung. Melde es dem Admin.

### Die Website lädt nicht – was tun?
1. Seite neu laden (F5)
2. Browser-Cache leeren (Strg+Shift+R)
3. Anderen Browser versuchen
4. Wenn alles nichts hilft: Entwickler informieren

---

## Kontakt & Hilfe

Bei Fragen oder Problemen, die dieses Wiki nicht beantwortet:

- **Admin:** Denny Svalin
- **Technische Probleme:** An einen Entwickler wenden
- **GitHub Issues:** https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen-/issues
