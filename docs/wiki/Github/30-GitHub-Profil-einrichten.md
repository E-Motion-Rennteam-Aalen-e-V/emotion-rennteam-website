# 30 – GitHub-Profil einrichten

## Warum ein vollständiges Profil?

Wenn du Änderungen auf GitHub machst, sehen andere Teammitglieder und (bei öffentlichen Repos) die Community deinen Namen. Ein vollständiges Profil sorgt für:
- Wiedererkennbarkeit im Team
- Professionelles Auftreten
- Klare Zuordnung von Commits

---

## Profilbild einrichten

1. Oben rechts auf dein **Profilfoto / Initialen** klicken
2. **"Settings"** (Einstellungen)
3. Im linken Menü: **"Public profile"**
4. **"Change profile picture"** → Bild hochladen

```
┌─────────────────────────────────────────────────────────┐
│  Public profile                                         │
│                                                         │
│  [Profilbild]  [Change profile picture]                 │
│                                                         │
│  Name:         Anna Müller           ← Echter Name      │
│  Username:     anna-mueller-hs       ← Login-Name       │
│  Bio:          Aerodynamik @ E-Motion Rennteam Aalen    │
│  Company:      @Hudnur111             ← Team-Account    │
│  Location:     Aalen, Baden-Württemberg                 │
│  Email:        (public oder privat)                     │
│  LinkedIn:     linkedin.com/in/anna-mueller             │
└─────────────────────────────────────────────────────────┘
```

---

## Wichtige Profilfelder

| Feld | Empfehlung |
|------|-----------|
| **Name** | Vor- und Nachname (echter Name) |
| **Bio** | "Aerodynamik @ E-Motion Rennteam Aalen" |
| **Company** | `@Hudnur111` (unser GitHub-Account) |
| **Location** | Aalen, Deutschland |
| **Website** | Dein LinkedIn-Profil |

---

## E-Mail-Einstellungen

Deine E-Mail-Adresse wird in Commits eingebettet (sichtbar für alle):

1. **Settings → Emails**
2. Option: **"Keep my email address private"** aktivieren
3. GitHub gibt dir eine `@users.noreply.github.com`-Adresse zum Schutz

```
✅ Empfehlung: Private E-Mail aktivieren
   → Commits zeigen dann: anna-mueller@users.noreply.github.com
```

---

## Contribution-Graph (Aktivitäts-Übersicht)

Auf deiner Profilseite siehst du ein Kästchen-Raster – jedes Kästchen steht für Aktivität an einem Tag:

```
     Jan  Feb  Mar  Apr  Mai  Jun
Mo   ░░▓▓░░▓░░░▓▓░░░░░░░░▓▓▓░░░
Di   ░░░░▓▓░░░░░░░░▓░░░░░░░░░░░░
Mi   ▓▓░░░░░░░░░░░░░░▓▓░░░░░░░░░
...
      hellgrün = wenig Aktivität
      dunkelgrün = viel Aktivität
```

Deine Commits auf `website` erscheinen hier.

---

## Zwei-Faktor-Authentifizierung (2FA) einrichten

**Settings → Password and authentication → Two-factor authentication**

```
┌─────────────────────────────────────────────────────────┐
│  Two-factor authentication                              │
│                                                         │
│  [Enable two-factor authentication]                     │
│                                                         │
│  Step 1: Scan QR code with Authenticator App           │
│  Step 2: Enter 6-digit code to verify                  │
│  Step 3: Save backup codes (WICHTIG!)                  │
└─────────────────────────────────────────────────────────┘
```

**Backup-Codes sicher aufbewahren:**
- In Passwort-Manager (Bitwarden, 1Password)
- Als Ausdruck in sicherem Ort
- NICHT im GitHub-Repository!

---

## Erscheinungsbild (Dark/Light Mode)

**Settings → Appearance**

```
○ Light theme  (heller Hintergrund)
● Dark theme   (dunkler Hintergrund)
○ System theme (passt sich dem Betriebssystem an)
```

---

## Profil-Link teilen

Dein öffentliches Profil ist erreichbar unter:
```
https://github.com/dein-benutzername
```

Sinnvoll für:
- LinkedIn-Profil verlinken
- Bewerbungen (zeigt GitHub-Aktivität)
- Team-interne Kommunikation ("@anna-mueller reviewen?")
