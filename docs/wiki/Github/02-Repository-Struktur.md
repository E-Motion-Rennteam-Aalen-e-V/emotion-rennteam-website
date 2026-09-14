# 02 – Aufbau & Ordnerstruktur des Repositories

## Übersicht: Wie ist unser Projekt aufgebaut?

Unser Repository enthält alle Dateien der Website. Hier ist die vollständige Struktur mit Erklärungen:

```
Website---E-Motion-Rennteam-Aalen-/
│
├── 📁 content/                  ← CMS-Inhalte (Texte, Metadaten)
│   ├── 📁 blog/                 ← Blog-Beiträge als .md-Dateien
│   ├── 📁 gallery/              ← Galerie-Einträge
│   ├── 📁 news/                 ← News-Artikel
│   ├── 📁 pages/                ← Seiteninhalte (Startseite, Kontakt...)
│   ├── 📁 positions/            ← Offene Stellen
│   ├── 📁 results/              ← Wettkampf-Ergebnisse
│   ├── 📁 sponsors/             ← Sponsor-Einträge
│   ├── 📁 team/                 ← Team-Mitglieder
│   └── 📁 vehicles/             ← Fahrzeug-Einträge
│
├── 📁 public/                   ← Öffentliche Dateien (Bilder etc.)
│   └── 📁 uploads/
│       ├── 📁 single-bilder-upload/  ← Team-Fotos (auto-matching!)
│       └── 📁 ...               ← Weitere hochgeladene Bilder
│
├── 📁 src/                      ← Website-Quellcode (nicht anfassen!)
│   ├── 📁 app/                  ← Seiten-Routing
│   ├── 📁 components/           ← UI-Komponenten
│   └── 📁 lib/                  ← Hilfsfunktionen & CMS-Logik
│
├── 📁 docs/                     ← Dokumentation (diese Wiki!)
│   └── 📁 wiki/
│       ├── 📁 CMS-App-Anleitung/    ← CMS-Bedienungsanleitung
│       └── 📁 Github/               ← GitHub-Anleitung (hier bist du)
│
├── 📄 package.json              ← Projekt-Konfiguration
├── 📄 next.config.ts            ← Next.js-Konfiguration
└── 📄 README.md                 ← Projekt-Übersicht
```

---

## Welche Ordner sind für mich relevant?

### Als **Content-Manager** (kein Technik-Hintergrund):

| Ordner | Wann benutze ich ihn? |
|--------|----------------------|
| `content/team/` | Team-Mitglied hinzufügen/bearbeiten |
| `content/news/` | News-Artikel veröffentlichen |
| `content/blog/` | Blog-Beitrag schreiben |
| `content/gallery/` | Galerie-Bild hinzufügen |
| `content/sponsors/` | Sponsor hinzufügen |
| `content/results/` | Wettkampf-Ergebnis eintragen |
| `content/positions/` | Offene Stelle ausschreiben |
| `public/uploads/` | Bilder hochladen |

> ✅ **Empfehlung:** Nutze das **Admin-CMS-Panel** (`/admin`) für Inhalte – dann musst du GitHub-Dateien nur für Bilder direkt anfassen!

---

## Wichtige Einzeldateien

### Content-Dateien (`.md`)

Jeder Eintrag im CMS ist eine Markdown-Datei. Beispiel für einen Team-Eintrag:

```markdown
---
name: "Max Mustermann"
role: "Fahrwerk-Ingenieur"
department: "Fahrwerk"
photo: "/uploads/single-bilder-upload/max-mustermann.jpg"
order: 5
---

Max ist seit 2024 im Team und spezialisiert auf...
```

### Bilder

Bilder liegen in `public/uploads/`. Der Pfad in der URL ist ohne `public/`:

```
Datei auf GitHub:    public/uploads/single-bilder-upload/foto.jpg
Pfad im CMS:         /uploads/single-bilder-upload/foto.jpg
```

---

## Website-Seiten und ihre Quellen

| Website-Seite | Content-Quelle |
|--------------|----------------|
| `/` (Startseite) | `content/pages/home.md` |
| `/team` | `content/team/*.md` |
| `/fahrzeuge` | `content/vehicles/*.md` |
| `/news` | `content/news/*.md` |
| `/blog` | `content/blog/*.md` |
| `/galerie` | `content/gallery/*.md` |
| `/sponsoren` | `content/sponsors/*.md` |
| `/kontakt` | `content/pages/contact.md` |

---

## Branches verstehen

```
website (LIVE)
    │
    ├── claude/feature-xyz    ← Entwicklungs-Branch
    ├── claude/fix-abc        ← Bugfix-Branch
    └── ...
```

- **`website`** = was du auf der echten Website siehst
- Alle anderen Branches = Entwürfe, die noch nicht live sind
- Erst nach einem **Merge** in `website` ist etwas live

---

## Nächste Schritte

- [Bilder hochladen →](./03-Bilder-hochladen.md)
- [Dateien herunterladen →](./04-Dateien-herunterladen.md)
