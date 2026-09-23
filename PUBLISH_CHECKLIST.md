# 🚀 Publish Checklist – Prio HOCH

Kritische Punkte vor Production-Deployment auf `emotion-rennteam.de`:

## ⚠️ Blocker – Ohne diese funktioniert nichts:

### 1. **FORM_WEBHOOK_URL** (`.env.local`)
- **Problem**: Contact forms gehen aktuell ins Void (werden nur lokal gepuffert)
- **Lösung**: Slack/Email-Webhook setzen
  - Option A: Slack Incoming Webhook (einfach, live-Notifications)
  - Option B: Email-Relay (interne Service oder SendGrid/Mailgun)
- **Status**: ❌ Nicht gesetzt → Formulare funktionieren nicht live

### 2. **CMS Credentials** (`.env.local`)
- **CMS_SESSION_SECRET** (Zeile 29)
  - Mindestens 32 Zeichen, zufällig
  - Generieren: `openssl rand -base64 32`
  - **Status**: ❌ Nicht gesetzt → /admin-Panel unsicher
  
- **CMS_ADMIN_PASSWORD_HASH** (Zeile 24)
  - Hash des Admin-Passworts
  - Generieren: `npm run cms:hash-password -- "passwort"`
  - **Status**: ❌ Nicht gesetzt → Admin-Login unmöglich

### 3. **NEXT_PUBLIC_SITE_URL** (`.env.local`)
- **Must be**: `https://emotion-rennteam.de` (ohne trailing slash)
- **Impact**: SEO (canonical URLs, sitemap.xml, robots.txt, OpenGraph)
- **Status**: ⚠️ Muss auf Produktions-Domain zeigen

---

## 📋 Zusätzliche Konfiguration

### Optional aber empfohlen:
- ✅ **NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION** – GSC HTML-Tag für SEO
- ✅ **NEXT_PUBLIC_META_PIXEL_ID** – Meta Pixel (nach Cookie-Consent)
- ✅ **GITHUB_TOKEN** – Auto-Commits von CMS-Änderungen

---

## 🔐 Deployment Checkliste

- [ ] `.env.local` mit allen 3 Blocker-Werten gefüllt
- [ ] `npm run cms:hash-password` für Admin-Passwort ausführen
- [ ] `openssl rand -base64 32` für CMS_SESSION_SECRET generieren
- [ ] Slack/Email-Webhook konfigurieren und als FORM_WEBHOOK_URL setzen
- [ ] NEXT_PUBLIC_SITE_URL = `https://emotion-rennteam.de`
- [ ] `.env.local` liegt NICHT im Repo (is `.gitignore`d)
- [ ] Lokal testen: `npm run dev` → Contact-Form → Slack/Email-Check
- [ ] Production-Build lokal: `npm run build && npm start`

---

## 🚨 Häufige Fehler

- ❌ Leeres CMS_SESSION_SECRET → Sessions können gefälscht werden
- ❌ Leeres FORM_WEBHOOK_URL → Forms verloren
- ❌ NEXT_PUBLIC_SITE_URL != emotion-rennteam.de → SEO bricht
- ❌ `.env.local` ins Repo committed → Secrets leaked

---

**Verantwortlich**: Vor jedem Deploy abarbeiten!
