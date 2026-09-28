# Team Member Kontaktdaten

Dieser Ordner enthält die Kontaktdateien für Teamleiter, Leitung und Executive Members.

## Dateistruktur

Für jeden Teamleiter/Leitung/Executive wird eine eigene Markdown-Datei erstellt.

### Dateiname

Verwende das `slug`-Feld aus der Team-Datei und ergänze `.md`:

```
{vorname}-{nachname}.md
```

**Beispiele:**
- `max-mueller.md`
- `anna-schmidt.md`

## Dateiformat

```markdown
# Max Müller

**Rolle:** CTO  
**Abteilung:** Engineering  

## Kontaktdaten

- **Email:** max.mueller@emotion.de
- **Telefon:** +49 (171) 1234567
- **LinkedIn:** https://www.linkedin.com/in/maxmueller/

## Beschreibung

Kurze Beschreibung des Teamleaders oder weitere Informationen...
```

## Wo wird das verwendet?

Diese Daten werden später in den Visitenkarten angezeigt. Die Visitenkarten unterscheiden zwischen:

- **Leadership-Mitglieder (CEO/CTO/CFO, Teamleiter, Leitung):** Zeigen echte Kontaktdaten aus ihrer Markdown-Datei
- **Normale Mitglieder:** Zeigen nur `[Test Mail]` und `[Test Tel]` als Platzhalter

## Integration

Die Markdown-Dateien werden später mit folgendem Schema verlinkt:
- Dateiname = `slug` Wert des Teamleaders (z.B. `max-mueller.md`)
