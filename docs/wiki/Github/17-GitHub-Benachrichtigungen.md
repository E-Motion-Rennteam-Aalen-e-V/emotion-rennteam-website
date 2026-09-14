# 17 – GitHub-Benachrichtigungen einrichten

## Warum Benachrichtigungen wichtig sind

Ohne Benachrichtigungen verpasst du:
- Neue Issues (Probleme gemeldet)
- Pull Requests die auf Review warten
- Kommentare zu deinen Änderungen
- Erwähnungen mit `@dein-name`

---

## Benachrichtigungsarten

| Art | Beschreibung |
|-----|-------------|
| **E-Mail** | Jede Aktivität kommt als E-Mail |
| **Web** | Benachrichtigungen in der GitHub-Glocke (🔔) |
| **Beides** | E-Mail + Web |

---

## Benachrichtigungen einrichten

1. Klicke oben rechts auf dein **Profilbild**
2. Wähle **"Settings"** (Einstellungen)
3. Im linken Menü: **"Notifications"**

```
┌─────────────────────────────────────────────────────────┐
│  Notifications                                          │
│                                                         │
│  Default notifications email:                           │
│  dein@email.de  ✅                                      │
│                                                         │
│  Participating, @mentions and custom                    │
│  ✅ Email                                               │
│  ✅ Web and Mobile                                      │
│                                                         │
│  Watching                                               │
│  ☐ Email                                               │
│  ✅ Web and Mobile                                      │
└─────────────────────────────────────────────────────────┘
```

**Empfohlene Einstellung:**
- "Participating" → E-Mail + Web aktivieren
- "Watching" → Nur Web (sonst zu viele E-Mails)

---

## Repository beobachten (Watch)

Um für ein Repository Benachrichtigungen zu erhalten:

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"Watch"** (Auge-Symbol oben rechts)
3. Wähle aus:

```
┌──────────────────────────────────────────────┐
│  ○ Participate and @mentions  (Standard)     │
│  ○ All activity               (Alles)        │
│  ● Custom                                    │
│    ✅ Issues                                 │
│    ✅ Pull requests                          │
│    ✅ Releases                               │
└──────────────────────────────────────────────┘
```

**Empfehlung für Content-Manager:**
- Nur "Issues" und "Releases" aktivieren
- Pull Requests nur wenn du aktiv beiträgst

---

## Benachrichtigungen lesen

Klicke auf die **Glocke** (🔔) oben rechts auf GitHub:

```
┌─────────────────────────────────────────────────────────┐
│  🔔 Benachrichtigungen                    [Alles lesen] │
│  ─────────────────────────────────────────────────────  │
│  ● Issue #16 – Sponsor-Logo fehlt              vor 5min │
│  ● PR #112 – Wiki Update wurde gemergt         vor 1h   │
│  ● @anna-mueller hat dich erwähnt              vor 2h   │
└─────────────────────────────────────────────────────────┘
```

---

## Jemanden im Kommentar erwähnen

Wenn du möchtest, dass eine Person benachrichtigt wird, schreibe in einem Kommentar:

```
@benutzername Kannst du bitte das Foto hochladen?
```

→ Die Person bekommt sofort eine Benachrichtigung

---

## E-Mail-Benachrichtigungen deaktivieren (zu viele Mails)

1. **Settings → Notifications**
2. Unter "Watching" → **"Email"** deaktivieren
3. Nur noch Benachrichtigungen für direkte Erwähnungen (`@`) per E-Mail

---

## GitHub Mobile App

Für Benachrichtigungen unterwegs:

1. App herunterladen: **"GitHub"** im App Store / Google Play
2. Anmelden mit deinem GitHub-Account
3. Benachrichtigungen erscheinen als Push-Notifications auf dem Smartphone

> Ideal für schnelle Antworten auf Issues und Kommentare unterwegs.
