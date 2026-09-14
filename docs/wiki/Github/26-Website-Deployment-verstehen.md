# 26 – Website-Deployment verstehen

## Wie kommt meine Änderung auf die Website?

Der Prozess läuft vollautomatisch – du musst nach dem Commit nichts weiter tun:

```
Du commitest auf "website" Branch
         │
         ▼
GitHub empfängt den Commit
         │
         ▼
GitHub Actions startet automatisch
(Build-Prozess: ~2-3 Minuten)
         │
         ▼
Website wird neu gebaut und deployt
         │
         ▼
Änderung ist live! 🎉
```

---

## Build-Status prüfen (GitHub Actions)

So siehst du ob der Build erfolgreich war:

1. Gehe zur Hauptseite des Repositories
2. Klicke auf den Tab **"Actions"**

```
┌─────────────────────────────────────────────────────────┐
│  Actions                                                │
│  ─────────────────────────────────────────────────────  │
│  ✅ Deploy Website     website  3 minutes ago  2m 14s   │
│  ✅ Deploy Website     website  1 hour ago     2m 08s   │
│  ❌ Deploy Website     website  2 hours ago    0m 45s   │
│                              ↑                          │
│                    Rotes ❌ = Build fehlgeschlagen       │
└─────────────────────────────────────────────────────────┘
```

### Was bedeuten die Symbole?

| Symbol | Bedeutung | Was tun? |
|--------|-----------|---------|
| ✅ Grüner Haken | Build erfolgreich, Website live | Nichts |
| ❌ Rotes X | Build fehlgeschlagen | Fehlermeldung lesen, Admin informieren |
| 🟡 Gelber Kreis | Build läuft noch | Warten (~2-3 Minuten) |
| ⚪ Grauer Kreis | Build steht an | Kurz warten |

---

## Was passiert beim Build?

1. **Checkout:** GitHub lädt alle Dateien aus dem `website`-Branch
2. **Install:** Alle Abhängigkeiten werden installiert
3. **Build:** Next.js kompiliert die Website (Code + Content)
4. **Deploy:** Die fertige Website wird auf den Server hochgeladen

> ⏱️ Der gesamte Prozess dauert etwa **2–3 Minuten** nach einem Commit.

---

## Fehlgeschlagenen Build untersuchen

1. Auf den roten ❌ klicken (auf den Build)
2. Du siehst eine Liste der Build-Schritte
3. Klicke auf den roten Schritt (der Schritt der fehlschlug)

```
┌─────────────────────────────────────────────────────────┐
│  Deploy Website                                ❌ Failed │
│  ─────────────────────────────────────────────────────  │
│  ✅ Set up job                             2s           │
│  ✅ Checkout code                          3s           │
│  ✅ Install dependencies                   45s          │
│  ❌ Build Next.js                          12s          │  ← Hier klicken
│  ⏭️ Deploy (skipped)                                    │
└─────────────────────────────────────────────────────────┘
```

4. Lies die Fehlermeldung (meist ein YAML-Fehler in einer Content-Datei)
5. Admin informieren wenn du den Fehler nicht verstehst

---

## Häufige Build-Fehler

| Fehlermeldung | Ursache | Lösung |
|---------------|---------|--------|
| `YAML parse error` | Frontmatter hat Syntaxfehler | Frontmatter der letzten geänderten Datei prüfen |
| `Image not found` | Bild fehlt oder falscher Pfad | Bild hochladen oder Pfad korrigieren |
| `Module not found` | Code-Fehler (kein Content-Problem) | Entwickler/Admin informieren |
| `Build timeout` | Build dauerte zu lange | Admin informieren |

---

## Website-URL und Umgebungen

| Umgebung | URL | Wann aktiv? |
|----------|-----|-------------|
| **Live** (Produktion) | Öffentliche URL des Teams | Nach jedem `website`-Commit |
| **Vorschau** (Preview) | Temporäre URL | Bei Pull Requests (falls konfiguriert) |

---

## Deployment-Benachrichtigungen bekommen

1. GitHub → **"Watch"** → **"All activity"** aktivieren
2. Du bekommst E-Mails wenn ein Build fehlschlägt

Oder: Im Tab "Actions" auf **"Notifications"** abonnieren:
- Klicke oben rechts auf das Glocken-Symbol
- "Subscribe to all workflows"

---

## Zusammenfassung

```
Commit auf "website" → Actions-Tab prüfen → ✅ = fertig
                                           ❌ = Admin informieren
```

> Nach einer Änderung: warte 3 Minuten, dann lade die Website neu (Ctrl+Shift+R).
