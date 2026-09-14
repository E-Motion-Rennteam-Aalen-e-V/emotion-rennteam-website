# 35 – Onboarding: Neue Mitglieder einarbeiten

## Für neue GitHub-Nutzer: Die ersten Schritte

Willkommen im Team! Diese Anleitung führt dich durch alles, was du für den GitHub-Zugang und die ersten Schritte auf unserer Website brauchst.

---

## Schritt 1: GitHub-Account erstellen

1. Gehe zu [github.com](https://github.com)
2. Klicke auf **"Sign up"**
3. E-Mail-Adresse eingeben (am besten Hochschul-E-Mail)
4. Passwort wählen (mindestens 15 Zeichen)
5. Benutzername wählen: `vorname-nachname-hs` (z.B. `anna-mueller-hs`)
6. E-Mail-Adresse bestätigen

> **Benutzernamen-Empfehlung:** Verwende deinen echten Namen damit Teammitglieder dich erkennen.

---

## Schritt 2: 2FA aktivieren (Pflicht!)

Sofort nach der Registrierung:

1. Profilbild → **Settings → Password and authentication**
2. **"Enable two-factor authentication"**
3. Authenticator-App wählen (Google Authenticator / Microsoft Authenticator)
4. QR-Code scannen
5. **Backup-Codes kopieren und sicher aufbewahren!**

---

## Schritt 3: Profil einrichten

1. **Settings → Public profile**
2. Ausfüllen:
   - **Name:** Echter Name (z.B. Anna Müller)
   - **Bio:** "Aerodynamik @ E-Motion Rennteam Aalen"
   - **Company:** `@Hudnur111`
   - **Location:** Aalen
3. Profilfoto hochladen

→ Detailliert: [30-GitHub-Profil-einrichten.md](./30-GitHub-Profil-einrichten.md)

---

## Schritt 4: Repository-Zugang erhalten

1. Deinen **GitHub-Benutzernamen** an den Admin schicken
2. Admin schickt dir eine **Einladungs-E-Mail** von GitHub
3. E-Mail öffnen → **"Accept invitation"** klicken
4. Du hast jetzt Zugriff auf das Repository

---

## Schritt 5: Repository kennenlernen

1. Gehe zu: `https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen-`
2. Branch auf `website` einstellen
3. Ordnerstruktur erkunden:

```
Empfohlene erste Dateien zum Anschauen:
├── content/team/         → Wie sieht ein Team-Eintrag aus?
├── content/news/         → Wie ist ein News-Artikel aufgebaut?
└── public/uploads/       → Wo liegen die Bilder?
```

→ Struktur erklärt in: [02-Repository-Struktur.md](./02-Repository-Struktur.md)

---

## Schritt 6: Erste Änderung machen

**Übungsaufgabe für Neulinge:**

1. Öffne `content/team/dein-name.md` (falls noch nicht vorhanden: erstellen)
2. Füge oder ergänze deine Daten
3. Committen mit: `Team: [Dein Name] Profil aktualisiert`
4. Prüfe ob dein Name auf der Website erscheint

---

## Lernpfad für neue Content-Manager

### Woche 1: Grundlagen

| Tag | Anleitung | Ziel |
|-----|-----------|------|
| Tag 1 | [01-GitHub-Grundlagen.md](./01-GitHub-Grundlagen.md) | Oberfläche verstehen |
| Tag 2 | [02-Repository-Struktur.md](./02-Repository-Struktur.md) | Ordnerstruktur kennen |
| Tag 3 | [07-Markdown-Syntax.md](./07-Markdown-Syntax.md) | Markdown lernen |
| Tag 4 | [03-Bilder-hochladen.md](./03-Bilder-hochladen.md) | Erste Bilder hochladen |
| Tag 5 | [09-Team-Mitglieder-verwalten.md](./09-Team-Mitglieder-verwalten.md) | Eigenes Profil anlegen |

### Woche 2: Content erstellen

| Tag | Anleitung |
|-----|-----------|
| Tag 1 | [10-News-und-Blog.md](./10-News-und-Blog.md) |
| Tag 2 | [11-Galerie-verwalten.md](./11-Galerie-verwalten.md) |
| Tag 3 | [05-Aenderungen-vornehmen.md](./05-Aenderungen-vornehmen.md) |
| Tag 4 | [08-Issues-erstellen.md](./08-Issues-erstellen.md) |
| Tag 5 | [20-Haeufige-Fehler-und-Loesungen.md](./20-Haeufige-Fehler-und-Loesungen.md) |

---

## Checkliste: Bin ich bereit?

- [ ] GitHub-Account erstellt
- [ ] 2FA aktiviert und Backup-Codes gesichert
- [ ] Profil mit echtem Namen und Bild eingerichtet
- [ ] Repository-Einladung angenommen
- [ ] Branch `website` ausgewählt
- [ ] Ordnerstruktur angeschaut
- [ ] Erste eigene Datei bearbeitet
- [ ] Benachrichtigungen eingerichtet
- [ ] CMS Admin-Panel (/admin) ausprobiert

---

## Ansprechpartner

Bei Fragen und Problemen:

- **GitHub-Zugang:** Admin des Teams
- **Inhaltliche Fragen:** Abteilungsleitung
- **Technische Probleme:** Webmaster / Entwickler
- **GitHub lernen:** Diese Wiki-Dokumentation

---

## Glossar für Einsteiger

| Begriff | Einfach erklärt |
|---------|----------------|
| Repository (Repo) | Der Ort wo alle Dateien unserer Website leben |
| Branch | Eine Arbeitskopie – `website` ist unsere Live-Version |
| Commit | Eine gespeicherte Änderung mit Nachricht |
| Push | Lokale Änderungen hochladen |
| Pull Request (PR) | Antrag, Änderungen zu übernehmen |
| Merge | Änderungen zusammenführen |
| Issue | Eine Aufgabe oder ein gemeldetes Problem |
| Frontmatter | Der YAML-Block am Anfang einer `.md`-Datei |
| YAML | Ein einfaches Datenformat für Frontmatter-Felder |
| Markdown | Einfache Textformatierung mit Sonderzeichen |
