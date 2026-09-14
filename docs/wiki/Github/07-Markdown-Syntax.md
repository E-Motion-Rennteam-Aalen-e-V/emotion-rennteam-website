# 07 – Markdown-Syntax für Content-Dateien

## Was ist Markdown?

Markdown ist eine einfache Auszeichnungssprache – du schreibst Text mit kleinen Zeichen, die automatisch in formatiertes HTML umgewandelt werden.

```
Du schreibst:   ## Überschrift
Website zeigt:  <h2>Überschrift</h2>  (große, fette Überschrift)
```

---

## Frontmatter – die Metadaten oben in jeder Datei

Jede Content-Datei beginnt mit einem **Frontmatter-Block** zwischen `---` Linien. Das sind strukturierte Daten, die das CMS auswertet.

```markdown
---
title: "Unser Rollout 2026"
date: 2026-03-15
author: "Anna Müller"
excerpt: "Kurze Zusammenfassung des Artikels"
coverImage: "/uploads/rollout-2026.jpg"
---

Hier beginnt der eigentliche Inhalt...
```

> ⚠️ **Wichtig:** Der Frontmatter-Block muss **exakt** mit `---` beginnen und enden. Kein Leerzeichen davor!

---

## Überschriften

```markdown
# Hauptüberschrift (H1)
## Abschnittsüberschrift (H2)
### Unterabschnitt (H3)
#### Kleiner Titel (H4)
```

**Regeln:**
- Pro Seite nur **eine** H1-Überschrift
- H2 für Hauptabschnitte, H3 für Unterabschnitte
- Immer ein Leerzeichen nach dem `#`

---

## Textformatierung

```markdown
**fett**                    → fett
*kursiv*                    → kursiv
~~durchgestrichen~~         → durchgestrichen
`Code-Schrift`              → Inline-Code

> Zitat / Hinweis           → eingerückter Block
```

**Ergebnis:**
- `**fett**` → **fett**
- `*kursiv*` → *kursiv*
- `` `Code` `` → `Code`

---

## Listen

### Aufzählungsliste (Bullets):
```markdown
- Erster Punkt
- Zweiter Punkt
  - Unterpunkt (2 Leerzeichen einrücken)
- Dritter Punkt
```

### Nummerierte Liste:
```markdown
1. Erster Schritt
2. Zweiter Schritt
3. Dritter Schritt
```

---

## Links

```markdown
[Linktext](https://www.beispiel.de)
[Interner Link](./andere-datei.md)
[E-Mail](mailto:info@e-motion-aalen.de)
```

---

## Bilder einbinden

```markdown
![Bildbeschreibung](/uploads/mein-bild.jpg)
![Team bei der Arbeit](/uploads/team-werkstatt.jpg)
```

> Das `!` vor den eckigen Klammern macht es zum Bild (statt Link).

---

## Tabellen

```markdown
| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Wert A   | Wert B   | Wert C   |
| Wert D   | Wert E   | Wert F   |
```

**Ergebnis:**

| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Wert A   | Wert B   | Wert C   |

---

## Trennlinien

```markdown
---
```

Erzeugt eine horizontale Linie (aber **nur außerhalb** des Frontmatters!).

---

## Codeblöcke (für technische Inhalte)

````markdown
```javascript
const name = "E-Motion";
console.log(name);
```
````

---

## Vollständiges Beispiel: News-Artikel

```markdown
---
title: "Erfolgreicher Rollout 2026"
date: 2026-03-15
author: "Anna Müller"
excerpt: "Unser neues Fahrzeug EM-26 wurde erfolgreich vorgestellt."
coverImage: "/uploads/rollout-2026.jpg"
---

## Der große Tag

Am 15. März 2026 haben wir unser neues Fahrzeug **EM-26** der Öffentlichkeit präsentiert.

### Technische Highlights

- Optimiertes Aerodynamik-Paket
- Neue Hochvolt-Batterie mit **85 kWh**
- Überarbeitetes Fahrwerk

> "Ein großartiger Moment für das gesamte Team!" – Max Mustermann, Teamleiter

[Mehr Bilder in der Galerie](/galerie)
```

---

## Häufige Fehler

| Fehler | Korrekt |
|--------|---------|
| `#Überschrift` | `# Überschrift` (Leerzeichen!) |
| Frontmatter ohne `---` | Immer `---` oben und unten |
| `[Link]()` leer | URL immer ausfüllen |
| Bild ohne `!` | `![Text](/pfad.jpg)` |
| Anführungszeichen `"` im Frontmatter vergessen | `title: "Text"` |
