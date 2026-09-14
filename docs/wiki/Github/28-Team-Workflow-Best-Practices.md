# 28 – Team-Workflow & Best Practices

## Unsere Arbeitsregeln für GitHub

Damit das Team reibungslos zusammenarbeitet, gelten diese Regeln:

---

## Grundregeln

### 1. Immer auf dem richtigen Branch arbeiten

```
✅ Für Live-Inhalte: Branch "website"
✅ Für experimentelle Änderungen: eigener Branch + PR
❌ Niemals auf "main" oder fremden Branches arbeiten
```

### 2. Commit-Nachrichten auf Deutsch schreiben

```
✅ "Teamfoto Anna Müller hochgeladen"
✅ "News: Wettbewerbsbericht FSG 2026 veröffentlicht"
✅ "Sponsor Bosch: Logo aktualisiert"
❌ "update"
❌ "fix"
❌ "changes"
```

### 3. Vor dem Commit: Was wurde geändert?

Immer kurz prüfen:
- Ist die Datei im richtigen Ordner?
- Stimmt das Frontmatter?
- Wurde das richtige Bild hochgeladen?

---

## Wer darf was?

| Aktion | Content-Manager | Abteilungsleiter | Admin |
|--------|----------------|-----------------|-------|
| Bilder hochladen | ✅ | ✅ | ✅ |
| Content bearbeiten | ✅ | ✅ | ✅ |
| Mitglieder einladen | ❌ | ❌ | ✅ |
| Branches löschen | ❌ | Eigene | ✅ |
| PRs mergen | ❌ | ❌ | ✅ |
| Einstellungen ändern | ❌ | ❌ | ✅ |

---

## Kommunikation bei Fehlern

Wenn du einen Fehler machst:

1. **Nicht in Panik verfallen** – GitHub speichert alles, nichts geht verloren
2. Admin informieren mit:
   - Was hast du gemacht?
   - In welcher Datei?
   - Was sollte es sein, was ist es geworden?
3. Screenshot des Fehlers machen (sehr hilfreich!)

---

## Workflow für neue Inhalte

```
1. Bild vorbereiten (Größe, Format, Dateiname)
      ↓
2. Bild in public/uploads/ hochladen
      ↓
3. Content-Datei in content/[bereich]/ erstellen
      ↓
4. Frontmatter ausfüllen (Pflichtfelder!)
      ↓
5. Text schreiben
      ↓
6. Committen (klare Nachricht!)
      ↓
7. Warten bis Build ✅ (ca. 2-3 Min.)
      ↓
8. Website prüfen
```

---

## Häufige Kommunikations-Situationen

### "Ich habe etwas kaputt gemacht"
→ Sofort Admin informieren, nichts weiter ändern

### "Ich bin mir nicht sicher ob meine Änderung richtig ist"
→ Eigenen Branch nutzen + PR erstellen → jemand anderes kann reviewen

### "Ich möchte etwas ausprobieren"
→ Immer auf eigenem Branch, nie direkt auf `website`

### "Bild fehlt auf der Website"
→ Dateinamen in `public/uploads/` und im Content-File vergleichen

---

## Regelmäßige Aufgaben (pro Person)

| Frequenz | Aufgabe |
|----------|---------|
| Nach jeder Veranstaltung | Fotos hochladen, Galerie aktualisieren |
| Nach Wettbewerb | Ergebnis eintragen, News schreiben |
| Bei Teamänderung | Team-Seite aktualisieren (Foto + Eintrag) |
| Bei neuem Sponsor | Sponsor-Eintrag + Logo hinzufügen |
| Quartalsweise | Offene Positionen prüfen und aktualisieren |

---

## Checkliste vor dem ersten GitHub-Commit

- [ ] GitHub-Account erstellt
- [ ] Als Collaborator zum Repository eingeladen (Admin fragen)
- [ ] Einladungs-E-Mail bestätigt
- [ ] 2FA aktiviert
- [ ] Testweise eine Datei gelesen (funktioniert Login?)
- [ ] Erste Änderung an einer unwichtigen Datei getestet

---

## Qualitätsstandards für Inhalte

| Aspekt | Standard |
|--------|---------|
| Bilder | < 2 MB, scharfe Qualität, keine Wasserzeichen |
| Texte | Korrektur vor Veröffentlichung, kein Textspeak |
| Dateinamen | Immer beschreibend, kein `foto1.jpg` |
| Commits | Immer eine klare Nachricht, nie leer |
| Sprache | Deutsch, professionell |
