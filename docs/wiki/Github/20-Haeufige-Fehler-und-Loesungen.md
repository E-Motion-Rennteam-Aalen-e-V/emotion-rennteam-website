# 20 – Häufige Fehler & Lösungen (Troubleshooting)

## Die 20 häufigsten Probleme und ihre Lösungen

---

### #1 – Änderung nicht auf der Website sichtbar

**Symptom:** Du hast etwas geändert und committet, aber die Website zeigt noch den alten Stand.

**Lösung:**
1. Warte 1–3 Minuten (Website wird nach jedem Push automatisch neu gebaut)
2. Browser-Cache leeren: `Strg + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
3. Prüfe: Warst du auf dem Branch `website`? (Nicht auf einem anderen Branch!)
4. Prüfe: Hat der Build-Prozess funktioniert? → GitHub → **"Actions"** → letzter Lauf grün?

---

### #2 – Edit-Button (Stift) fehlt / grau

**Symptom:** Du kannst eine Datei nicht bearbeiten, der Stift-Button erscheint nicht.

**Lösung:**
- Du bist nicht eingeloggt → oben rechts anmelden
- Du hast keine Schreibrechte → Admin kontaktieren (Zugriffsrechte anfordern)
- Du schaust in ein Repository, bei dem du kein Collaborator bist

---

### #3 – Bild erscheint nicht auf der Website

**Symptom:** Du hast ein Bild hochgeladen, aber es wird nicht angezeigt.

**Checkliste:**
- [ ] Bild in `public/uploads/` hochgeladen? (nicht anderswo)
- [ ] Pfad im Content korrekt? Muss mit `/uploads/...` beginnen (kein `public/`)
- [ ] Dateiname exakt wie im Frontmatter? (Groß-/Kleinschreibung beachten!)
- [ ] Dateiformat akzeptiert? (JPG, PNG, WebP – kein BMP, TIFF)
- [ ] Datei wirklich hochgeladen (nicht nur ausgewählt)?

---

### #4 – Team-Foto zeigt falsches Bild / kein Bild

**Symptom:** Das Profilfoto eines Teammitglieds zeigt ein falsches Bild oder fehlt.

**Lösung:**
1. Überprüfe den Dateinamen: `vorname-nachname.jpg` (nur Kleinbuchstaben)
2. Überprüfe das Frontmatter in `content/team/person.md`:
   ```markdown
   photo: "/uploads/single-bilder-upload/vorname-nachname.jpg"
   ```
3. Prüfe ob Datei in `public/uploads/single-bilder-upload/` existiert
4. Umlaute korrekt ersetzt? `ü→ue`, `ä→ae`, `ö→oe`, `ß→ss`

---

### #5 – Content-Datei erscheint nicht auf der Website

**Symptom:** Du hast eine neue `.md`-Datei erstellt, aber der Eintrag erscheint nicht.

**Checkliste:**
- [ ] Datei im richtigen Ordner? (z.B. `content/news/` für News)
- [ ] Frontmatter korrekt? Beginnt und endet mit `---`?
- [ ] Pflichtfelder ausgefüllt? (`title`, `date` bei News)
- [ ] `draft: true` gesetzt? → entfernen oder auf `false` setzen
- [ ] Frontmatter-YAML korrekt? Anführungszeichen vorhanden?

**Häufiger Fehler:**
```markdown
❌ title: Mein Artikel           (fehlende Anführungszeichen)
✅ title: "Mein Artikel"
```

---

### #6 – Datum-Format falsch

**Symptom:** Artikel erscheinen in falscher Reihenfolge oder Datum wird nicht angezeigt.

**Lösung:** Datum immer im Format `YYYY-MM-DD`:
```markdown
❌ date: 09.09.2026
❌ date: "9. September 2026"
✅ date: 2026-09-09
```

---

### #7 – Falscher Branch – Änderungen nicht live

**Symptom:** Du hast Änderungen gemacht, aber sie gehen nicht live.

**Ursache:** Du hast auf einem anderen Branch als `website` gearbeitet.

**Lösung:**
1. Prüfe welcher Branch aktiv war als du committet hast
2. Wenn falsch: Admin fragen, ob der Branch nach `website` gemergt werden soll
3. In Zukunft: Immer Branch prüfen **bevor** du anfängst zu bearbeiten

---

### #8 – Commit-Fehler: "Something went wrong"

**Symptom:** Nach dem Klick auf "Commit changes" erscheint eine Fehlermeldung.

**Lösung:**
1. Seite neu laden und erneut versuchen
2. Browser-Cache leeren und erneut einloggen
3. Prüfen: Hat die Datei syntaktische Fehler (YAML-Fehler im Frontmatter)?

---

### #9 – YAML-Fehler im Frontmatter

**Symptom:** Seite baut nicht oder Inhalt erscheint nicht.

**Häufige YAML-Fehler:**

| Fehler | Korrekt |
|--------|---------|
| Fehlende `---` am Ende | Immer öffnen und schließen |
| `title: Mein Artikel` | `title: "Mein Artikel"` |
| `date: 09.09.2026` | `date: 2026-09-09` |
| Falsche Einrückung bei `specs:` | 2 Leerzeichen, nicht Tabs |
| `current: True` | `current: true` (Kleinbuchstaben!) |

---

### #10 – Zu große Bilddatei

**Symptom:** Upload schlägt fehl oder Seite lädt sehr langsam.

**Lösung:**
- Bilder vor dem Upload komprimieren: [squoosh.app](https://squoosh.app) oder [tinypng.com](https://tinypng.com)
- Zielgröße: < 500 KB für normale Bilder, < 2 MB für hochauflösende
- GitHub limitiert Dateigröße auf 100 MB (aber wir empfehlen max. 2 MB)

---

### #11 – "Permission denied" beim Hochladen

**Symptom:** Du kannst keine Dateien hochladen oder bearbeiten.

**Lösung:**
- Du hast keine ausreichenden Rechte → Admin kontaktieren
- Du bist ausgeloggt → anmelden
- Repository ist schreibgeschützt → Admin kontaktieren

---

### #12 – Merge-Konflikt in einem Pull Request

**Symptom:** PR zeigt "This branch has conflicts that must be resolved".

**Was bedeutet das?** Jemand hat dieselbe Datei auf dem `website`-Branch geändert, bevor dein PR gemergt wurde.

**Lösung:** Admin oder Entwickler informieren – Konflikte müssen technisch gelöst werden.

---

### #13 – Commit rückgängig machen

→ Siehe [19-Versionsverlauf-und-Wiederherstellung.md](./19-Versionsverlauf-und-Wiederherstellung.md)

---

### #14 – GitHub-Login funktioniert nicht

**Lösung:**
1. Passwort zurücksetzen über "Forgot password?"
2. 2FA-Backup-Codes nutzen falls 2FA aktiviert
3. Browser-Cookies löschen und erneut versuchen

---

### #15 – Datei ist doppelt (Duplikat)

**Symptom:** Ein Eintrag erscheint doppelt auf der Website.

**Lösung:**
1. Prüfe `content/[bereich]/` auf doppelte Dateien
2. Öffne beide Dateien und vergleiche
3. Lösche die unnötige Datei (Mülleimer-Symbol 🗑️)

---

### #16 – Markdown-Formatierung wird nicht angezeigt

**Symptom:** Du siehst Sternchen oder Rauten statt formatiertem Text.

**Ursache:** Falsche Syntax oder falscher Kontext.

**Lösung:**
- Kein Leerzeichen nach `#`: `## Überschrift` (nicht `##Überschrift`)
- Leerzeile vor und nach Überschriften
- GitHub Preview nutzen (Tab "Preview" im Editor)

---

### #17 – Link funktioniert nicht

**Symptom:** Ein Link auf der Website führt zur 404-Seite.

**Häufige Ursachen:**
- URL-Tippfehler im Frontmatter
- Datei wurde verschoben oder umbenannt
- Externer Link nicht mehr gültig (Website abgeschaltet)

**Lösung:** Link in der `.md`-Datei korrigieren.

---

### #18 – Build schlägt fehl (rotes X bei Actions)

**Symptom:** Im Tab "Actions" siehst du ein rotes ❌ nach einem Commit.

**Lösung:**
1. Klicke auf den fehlgeschlagenen Build
2. Lies die Fehlermeldung
3. Häufigste Ursache: YAML-Syntaxfehler in einer Content-Datei
4. Admin informieren für technische Fehler

---

### #19 – Ich habe aus Versehen auf dem falschen Branch committet

**Lösung:**
1. Admin informieren
2. Admin kann den Commit auf den richtigen Branch verschieben (Cherry-Pick)
3. Oder: Inhalt kopieren, auf richtigem Branch neu anlegen, alten Commit rückgängig machen

---

### #20 – Ich weiß nicht ob meine Änderung live ist

**Lösung:**
1. GitHub → **"Actions"** → Zeigt Build-Status des letzten Commits
2. Grünes ✅ = Build erfolgreich, Seite ist live
3. Rotes ❌ = Build fehlgeschlagen, alte Version noch live
4. Gelbes ⏳ = Build läuft noch, kurz warten

---

## Kontakt bei Problemen

Bei technischen Problemen, die du nicht selbst lösen kannst:
- **Webmaster/Admin** des Teams kontaktieren
- **GitHub Issue** erstellen mit genauer Fehlerbeschreibung
- Screenshot des Fehlers anhängen (sehr hilfreich!)
