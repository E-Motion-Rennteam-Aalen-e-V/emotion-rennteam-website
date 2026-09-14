# 18 – Zugriffsrechte & Rollen

## GitHub-Rollen im Überblick

GitHub unterscheidet verschiedene Rollen mit unterschiedlichen Rechten:

| Rolle | Kann lesen | Kann bearbeiten | Kann löschen | Kann Mitglieder einladen |
|-------|------------|----------------|--------------|------------------------|
| **Read** | ✅ | ❌ | ❌ | ❌ |
| **Triage** | ✅ | Nur Issues | ❌ | ❌ |
| **Write** | ✅ | ✅ | Eigene Dateien | ❌ |
| **Maintain** | ✅ | ✅ | ✅ | Eingeschränkt |
| **Admin** | ✅ | ✅ | ✅ | ✅ |

---

## Wer hat welche Rolle bei uns?

| Rolle | Für wen? |
|-------|----------|
| **Admin** | Technische Teamleitung, Webmaster |
| **Write** | Aktive Content-Manager, Abteilungsleiter |
| **Read** | Sponsoren, Beobachter, Alumni |

---

## Neues Mitglied einladen

> ⚠️ Nur Admins können neue Mitglieder einladen!

1. Gehe zur Hauptseite des Repositories
2. Klicke auf **"Settings"** (oben rechts)
3. Im linken Menü: **"Collaborators and teams"**
4. Klicke auf **"Add people"**

```
┌─────────────────────────────────────────────────────────┐
│  Add collaborator to                                    │
│  Website---E-Motion-Rennteam-Aalen-                     │
│                                                         │
│  🔍 Search by username, full name or email              │
│                                                         │
│  anna-mueller-github                    [Select...]     │
│                                                         │
│  Role: [Write ▼]                                        │
│                                                         │
│  [Add anna-mueller-github to this repository]           │
└─────────────────────────────────────────────────────────┘
```

5. Die Person bekommt eine **E-Mail-Einladung** von GitHub
6. Sie muss die Einladung bestätigen

---

## Mitglied entfernen

1. **Settings → Collaborators and teams**
2. Neben dem Namen: **"Remove"** klicken
3. Bestätigen

> Die Person verliert sofort alle Zugriffsrechte.

---

## Zugriffsrolle ändern

1. **Settings → Collaborators and teams**
2. Neben dem Namen: **"Manage"**
3. Neue Rolle auswählen

---

## Eigenen GitHub-Account schützen

### Starkes Passwort

- Mindestens 15 Zeichen
- Groß-/Kleinbuchstaben + Zahlen + Sonderzeichen
- Niemals dasselbe Passwort wie für andere Dienste

### Zwei-Faktor-Authentifizierung (2FA) aktivieren

2FA ist **pflicht** für alle Accounts mit Write-Zugriff:

1. **Settings → Password and authentication**
2. Klicke auf **"Enable two-factor authentication"**
3. Wähle: Authenticator App (empfohlen) oder SMS

```
📱 Empfohlene Apps:
   - Google Authenticator
   - Microsoft Authenticator
   - Authy
```

4. Backup-Codes **sicher speichern** (z.B. Passwort-Manager)

---

## Was tun wenn Zugriff verloren?

### Passwort vergessen:
1. Auf der GitHub-Login-Seite: **"Forgot password?"**
2. E-Mail-Link anfordern
3. Neues Passwort setzen

### 2FA-Code verloren (Handy kaputt/neu):
1. Backup-Codes verwenden (wurden bei der 2FA-Einrichtung generiert)
2. Falls keine Backup-Codes: GitHub-Support kontaktieren

### Aus Repository ausgesperrt:
→ Admin (Teamleitung) kontaktieren – er kann die Einladung neu senden oder Rechte anpassen.

---

## Sicherheits-Checkliste

- [ ] Starkes, einzigartiges Passwort gesetzt
- [ ] 2FA aktiviert
- [ ] Backup-Codes gesichert (nicht im Repo speichern!)
- [ ] E-Mail-Adresse verifiziert
- [ ] Keine Passwörter oder API-Keys in Commit-Nachrichten
- [ ] Keine geheimen Daten in Dateien (`.env`-Dateien nie committen!)
