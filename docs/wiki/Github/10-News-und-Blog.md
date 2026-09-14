# 10 – News & Blog-Beiträge veröffentlichen

## Unterschied: News vs. Blog

| Merkmal | News | Blog |
|---------|------|------|
| Ordner | `content/news/` | `content/blog/` |
| Website-Seite | `/news` | `/blog` |
| Typischer Inhalt | Offizielle Ankündigungen, Wettkampfberichte | Persönliche Einblicke, Behind-the-Scenes |
| Autor-Feld | ❌ Kein Autor | ✅ Autor angeben |

---

## Neuen News-Artikel erstellen

### Schritt 1: Datei anlegen

1. Navigiere zu `content/news/`
2. Klicke **"+ Add file" → "Create new file"**
3. Dateiname: kurzer, beschreibender Name mit Datum:
   ```
   2026-09-rollout-2026.md
   2026-06-wettbewerb-mannheim.md
   ```

### Schritt 2: Frontmatter ausfüllen

```markdown
---
title: "Erfolgreicher Rollout des EM-26"
date: 2026-03-15
excerpt: "Am 15. März präsentierten wir unser neues Fahrzeug EM-26 der Hochschule Aalen."
coverImage: "/uploads/rollout-2026.jpg"
---

## Einleitung

Am 15. März 2026 war es so weit: Unser neues Fahrzeug **EM-26** wurde...
```

---

## Neuen Blog-Beitrag erstellen

1. Navigiere zu `content/blog/`
2. Dateiname: `2026-09-hinter-den-kulissen.md`

```markdown
---
title: "Hinter den Kulissen: Die Nacht vor dem Wettbewerb"
date: 2026-09-08
author: "Lena Schneider"
excerpt: "Was passiert eigentlich in der Nacht vor einem Wettbewerb? Ein persönlicher Bericht."
coverImage: "/uploads/blog-nachwett.jpg"
---

Es ist 23:00 Uhr, die Werkstatt ist hell erleuchtet...
```

---

## Pflichtfelder News

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `title` | ✅ | In Anführungszeichen |
| `date` | ✅ | Format `YYYY-MM-DD` |
| `excerpt` | Empfohlen | Kurze Zusammenfassung (1-2 Sätze) |
| `coverImage` | Empfohlen | Pfad zum Titelbild |

## Pflichtfelder Blog

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `title` | ✅ | In Anführungszeichen |
| `date` | ✅ | Format `YYYY-MM-DD` |
| `author` | Empfohlen | Name der schreibenden Person |
| `excerpt` | Empfohlen | Teaser-Text für die Übersichtsseite |
| `coverImage` | Empfohlen | Titelbild |

---

## Titelbild hochladen

Vor dem Erstellen des Artikels das Bild hochladen:

1. `public/uploads/` → **"+ Add file" → "Upload files"**
2. Empfohlene Bildgröße: **1200 × 630 px** (16:9 Format)
3. Dateiname beschreibend wählen:
   ```
   rollout-2026-titelbild.jpg
   blog-werkstatt-nacht.jpg
   ```
4. Pfad dann im Frontmatter: `/uploads/rollout-2026-titelbild.jpg`

---

## Datumsformat richtig schreiben

```
✅ Korrekt:   2026-09-09
              2026-03-15
              2025-12-01

❌ Falsch:    09.09.2026
              September 2026
              2026/09/09
```

---

## Artikel nachträglich bearbeiten

1. Navigiere zu `content/news/` oder `content/blog/`
2. Klicke auf den Artikel
3. Stift-Symbol (✏️) → bearbeiten
4. Committen:
   ```
   News: Tippfehler in "Rollout 2026" korrigiert
   Blog: Autorname bei Lena Schneider ergänzt
   ```

---

## Artikel unveröffentlichen (verbergen)

Wenn ein Artikel **temporär ausgeblendet** werden soll:

Füge im Frontmatter hinzu:
```markdown
---
title: "..."
date: 2026-09-09
draft: true
---
```

→ Der Artikel erscheint nicht mehr auf der Website, bleibt aber als Entwurf erhalten.

---

## Artikel löschen

1. Datei öffnen
2. Mülleimer (🗑️) → committen
3. Falls vorhanden: Titelbild aus `public/uploads/` ebenfalls löschen

---

## Beispiel: Vollständiger News-Artikel

```markdown
---
title: "E-Motion Rennteam belegt 3. Platz beim Formula Student Germany 2026"
date: 2026-08-12
excerpt: "Beim größten Formula-Student-Event Deutschlands erreichte unser Team EM-26 einen hervorragenden 3. Platz in der Electric-Klasse."
coverImage: "/uploads/news/fsg-2026-podium.jpg"
---

## Ergebnis

Nach intensiven Vorbereitungen und drei Wettkampftagen belegen wir beim **Formula Student Germany 2026** in Hockenheim den **3. Platz** in der Electric-Klasse.

## Die Wettbewerbstage

### Tag 1 – Technische Abnahme

Unser Fahrzeug EM-26 bestand alle technischen Prüfungen auf Anhieb...

### Tag 2 – Skid Pad & Autocross

Die Rundenzeiten übertrafen unsere Erwartungen...

## Fazit

Ein großartiges Ergebnis für unser Team! Ein besonderer Dank gilt unseren Sponsoren...
```
