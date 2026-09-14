# 🖼️ Bilder hochladen & verwalten

---

## Die Medienbibliothek

Die Medienbibliothek ist dein **zentrales Bild-Archiv**. Alle hochgeladenen Bilder sind dort zu finden.

**Zugang:** Admin-Panel → **"Medienbibliothek"** (links in der Sidebar)

---

## Bild hochladen – so geht's

### Methode 1: Klick
1. Gehe zur **Medienbibliothek**
2. Klick auf **"+ Bild hochladen"** (oben rechts)
3. Datei von deinem Computer auswählen
4. Fertig! Das Bild erscheint sofort in der Bibliothek

### Methode 2: Drag & Drop
1. Gehe zur **Medienbibliothek**
2. Ziehe ein Bild vom Desktop **direkt auf die Seite**
3. Das Bild wird automatisch hochgeladen

### Methode 3: Direkt beim Bearbeiten
- Wenn du z.B. ein Teammitglied bearbeitest, gibt es direkt beim Foto-Feld einen **"Bild hochladen"** Button
- Kein Umweg über die Medienbibliothek nötig!

---

## Was darf ich hochladen?

| Erlaubt | Nicht erlaubt |
|---------|---------------|
| JPG / JPEG ✅ | PDF ❌ |
| PNG ✅ | Word-Dokumente ❌ |
| WebP ✅ | Videos ❌ |
| GIF ✅ | ZIP-Dateien ❌ |

---

## Bild-Größen und Qualität

| Verwendung | Empfohlene Größe | Hinweis |
|------------|------------------|---------|
| Profilfotos | 400×400 px | Quadratisches Format |
| News-Titelbild | 1200×675 px | 16:9 Format |
| Galerie-Fotos | mind. 1200px breit | Querformat bevorzugt |
| Fahrzeugbilder | mind. 1600px breit | Hohe Qualität |
| Sponsor-Logo | mind. 300px breit | Transparenter Hintergrund (PNG) |

> 💡 **Tipp:** Zu große Dateien (über 5 MB) kann der Upload ablehnen. Komprimiere Bilder vorher mit [squoosh.app](https://squoosh.app) (kostenlos im Browser).

---

## Bild-Pfad kopieren

Wenn du ein Bild in einem Textfeld verwenden willst, brauchst du den Pfad:

1. Medienbibliothek öffnen
2. Beim gewünschten Bild auf **"Pfad kopieren"** klicken
3. Den kopierten Pfad (z.B. `/uploads/mein-bild.jpg`) in das Textfeld einfügen

---

## Bild löschen

1. Medienbibliothek öffnen
2. Beim Bild auf **"Löschen"** klicken
3. Mit **"OK"** bestätigen

> ⚠️ **Achtung:** Wenn ein Bild gelöscht wird, das noch irgendwo auf der Website verwendet wird, erscheint dort ein leerer Bereich! Prüfe vorher, ob das Bild noch gebraucht wird.

---

## Wo werden die Bilder gespeichert?

Alle hochgeladenen Bilder landen im Ordner **`/public/uploads/`** auf dem Server.

### Unterordner-Übersicht:

```
/public/uploads/
 ├── single-bilder-upload/     ← Profilfotos der Teammitglieder
 │    ├── Denny.jpg
 │    ├── David.jpg
 │    └── ...
 ├── galerie-upload/           ← Fotos für die Galerie
 ├── rollout-2026/             ← Rollout-Event Fotos
 ├── Team wdp/                 ← Abteilungs-Banner-Fotos
 └── [andere Bilder]           ← Fahrzeuge, News, etc.
```

> 📌 **Wichtig:** Über das Admin-Panel hochgeladene Bilder landen immer direkt im `/uploads/` Hauptordner. Die Unterordner wurden manuell erstellt.

---

## Bilder suchen

Wenn du viele Bilder hast:
- In der Medienbibliothek gibt es ein **Suchfeld** (erscheint ab 6 Bildern)
- Einfach den Dateinamen (oder Teil davon) eintippen

---

➡️ [Teamfotos verwalten →](05-Teamfotos.md)
