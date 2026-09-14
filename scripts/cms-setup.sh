#!/bin/bash
# Interaktive Ersteinrichtung der lokalen CMS-Zugangsdaten (.env.local).
# macOS/Linux-Gegenstueck zu scripts/cms-setup.ps1.
# Wird von CMS-Zugangsdaten-aendern.command und CMS-Start.command aufgerufen.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
env_path="$repo_root/.env.local"

echo ""
echo "=== Einrichtung: CMS-Zugangsdaten ==="
echo ""

if [ -f "$env_path" ]; then
    read -r -p "Es existiert bereits eine .env.local. Ueberschreiben? (j/n) " overwrite
    case "$overwrite" in
        j|J) ;;
        *)
            echo "Abgebrochen. Bestehende Datei bleibt unveraendert."
            exit 0
            ;;
    esac
    echo ""
fi

read -r -p "Benutzername fuer den Login (Enter fuer 'admin'): " username
if [ -z "$username" ]; then
    username="admin"
fi

while true; do
    read -r -s -p "Neues Passwort (mind. 8 Zeichen): " pw1
    echo ""
    if [ -z "$pw1" ] || [ ${#pw1} -lt 8 ]; then
        echo "Das Passwort muss mindestens 8 Zeichen lang sein."
        continue
    fi
    read -r -s -p "Passwort wiederholen: " pw2
    echo ""
    if [ "$pw1" != "$pw2" ]; then
        echo "Die Passwoerter stimmen nicht ueberein. Bitte erneut versuchen."
        continue
    fi
    break
done

echo ""
echo "Passwort-Hash wird erzeugt..."
hash="$(cd "$repo_root" && node "scripts/cms-hash-password.mjs" "$pw1")"
if [ -z "$hash" ]; then
    echo "[FEHLER] Der Passwort-Hash konnte nicht erzeugt werden. Ist Node.js installiert?"
    exit 1
fi

session_secret="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")"

echo ""
echo "--- GitHub-Anbindung (optional, aber empfohlen) ---"
echo "Damit Speicherungen automatisch als Commit ins GitHub-Repository geschrieben werden."
echo "Ohne Token werden Aenderungen NUR lokal auf diesem Rechner gespeichert."
echo "Token erstellen: https://github.com/settings/tokens (fine-grained, 'Contents: Read and write')"
echo "Der Token wird nur lokal in .env.local gespeichert (nicht Teil des Git-Repositorys) und niemals eingegeben."

github_owner="Hudnur111"
github_repo="Website---E-Motion-Rennteam-Aalen-"
github_branch="website"
github_token=""

# Prueft den Token sofort gegen die GitHub-API, statt ihn blind zu
# akzeptieren - sonst faellt ein falsch eingefuegter oder zu schwach
# berechtigter Token erst Wochen spaeter beim ersten echten Speichern auf,
# als kryptisches "(401)" ohne jeden Hinweis, was zu tun ist.
#
# /repos/{owner}/{repo} allein beweist nicht, dass der Token gueltig ist:
# bei einem OEFFENTLICHEN Repository (wie diesem) liefert GitHub dessen
# Basis-Metadaten auch ohne/mit kaputtem Token aus, da das jede:r anonym
# lesen kann. /user hat diese Luecke nicht - liefert "wer bin ich" und
# verlangt daher immer einen wirklich gueltigen Token.
test_github_token() {
    local token="$1" owner="$2" repo="$3"
    if ! command -v curl >/dev/null 2>&1; then
        echo "SKIP|curl nicht verfuegbar - Token wird ungeprueft uebernommen."
        return
    fi

    # `|| echo "000"`: under `set -e` (active for this whole script), a
    # failed curl (offline, timeout, DNS) inside a bare `var=$(cmd)`
    # assignment would otherwise abort the entire setup script instead of
    # gracefully falling back to "couldn't check, proceeding anyway".
    local user_status
    user_status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 \
        -H "Authorization: Bearer $token" \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "https://api.github.com/user" || echo "000")"
    if [ "$user_status" = "401" ] || [ "$user_status" = "403" ]; then
        echo "FAIL|Token ist UNGUELTIG, abgelaufen oder wurde falsch eingefuegt (Status $user_status)."
        return
    fi
    if [ "$user_status" != "200" ]; then
        echo "SKIP|Token konnte nicht geprueft werden (evtl. keine Internetverbindung) - wird trotzdem uebernommen."
        return
    fi

    local repo_response repo_status
    repo_response="$(curl -s -w '\n%{http_code}' --max-time 8 \
        -H "Authorization: Bearer $token" \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "https://api.github.com/repos/$owner/$repo" || echo "000")"
    repo_status="$(echo "$repo_response" | tail -n1)"
    if [ "$repo_status" = "404" ] || [ "$repo_status" = "403" ]; then
        echo "FAIL|Token ist gueltig, aber Repository '$owner/$repo' wurde nicht gefunden oder der Token hat keinen Zugriff darauf (Status $repo_status)."
        return
    fi
    if [ "$repo_status" != "200" ]; then
        echo "SKIP|Token konnte nicht vollstaendig geprueft werden - wird trotzdem uebernommen."
        return
    fi

    local body push
    body="$(echo "$repo_response" | sed '$d')"
    push="$(echo "$body" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.permissions&&j.permissions.push===false?'no':'yes')}catch{process.stdout.write('yes')}})" 2>/dev/null || echo "yes")"
    if [ "$push" = "no" ]; then
        echo "FAIL|Token ist gueltig, hat aber KEINE Schreibrechte fuer '$owner/$repo' (Berechtigung 'Contents: Read and write' fehlt)."
        return
    fi
    echo "OK|Token gueltig, Schreibzugriff auf '$owner/$repo' bestaetigt."
}

while true; do
    read -r -s -p "GitHub Personal Access Token (leer lassen zum Ueberspringen): " github_token
    echo ""
    github_token="$(echo "$github_token" | xargs || true)"
    if [ -z "$github_token" ]; then break; fi

    read -r -p "GitHub-Benutzer/Organisation (Enter fuer '$github_owner'): " owner_input
    if [ -n "$owner_input" ]; then github_owner="$owner_input"; fi

    read -r -p "Repository-Name (Enter fuer '$github_repo'): " repo_input
    if [ -n "$repo_input" ]; then github_repo="$repo_input"; fi

    read -r -p "Branch, in den committet wird (Enter fuer '$github_branch'): " branch_input
    if [ -n "$branch_input" ]; then github_branch="$branch_input"; fi

    echo "Token wird geprueft..."
    result="$(test_github_token "$github_token" "$github_owner" "$github_repo")"
    status="${result%%|*}"
    message="${result#*|}"
    echo "$message"
    if [ "$status" = "FAIL" ]; then
        read -r -p "Token erneut eingeben? (j/n, 'n' uebernimmt ihn trotzdem) " retry
        case "$retry" in
            j|J) continue ;;
        esac
    fi

    # Branch-Existenz pruefen (nur wenn Token gueltig und curl verfuegbar)
    if [ "$status" = "OK" ] && command -v curl >/dev/null 2>&1; then
        branch_http="$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 \
            -H "Authorization: Bearer $github_token" \
            -H "Accept: application/vnd.github+json" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            "https://api.github.com/repos/$github_owner/$github_repo/branches/$github_branch" \
            2>/dev/null || echo "000")"
        if [ "$branch_http" = "404" ]; then
            echo "Hinweis: Branch '$github_branch' existiert noch nicht im Repository."
            echo "Er wird beim ersten Commit automatisch angelegt."
        elif [ "$branch_http" != "200" ]; then
            echo "Hinweis: Branch-Pruefung nicht moeglich (Status $branch_http) - wird trotzdem uebernommen."
        else
            echo "Branch '$github_branch' gefunden."
        fi
    fi
    break
done

echo ""
echo "--- Formular-Benachrichtigungen (optional, aber empfohlen) ---"
echo "Ohne diese URL landen Kontakt-, Bewerbungs- und Sponsoring-Anfragen NUR lokal"
echo "und kommen nie beim Team an. Nutze z.B. einen Make.com- oder Zapier-Webhook."
echo "Die URL kann auch spaeter in .env.local eingetragen werden."
read -r -p "Webhook-URL fuer Formularbenachrichtigungen (leer lassen zum Ueberspringen): " form_webhook_url
form_webhook_url="$(echo "$form_webhook_url" | xargs || true)"
if [ -n "$form_webhook_url" ]; then
    echo "Webhook-URL wird uebernommen."
else
    echo "Hinweis: Kein Webhook gesetzt - Formulareingaben werden vorerst nur lokal gepuffert."
fi

cat > "$env_path" <<EOF
CMS_ADMIN_USER=$username
CMS_ADMIN_PASSWORD_HASH=$hash
CMS_SESSION_SECRET=$session_secret
GITHUB_TOKEN=$github_token
GITHUB_OWNER=$github_owner
GITHUB_REPO=$github_repo
GITHUB_BRANCH=$github_branch
FORM_WEBHOOK_URL=$form_webhook_url
EOF

echo ""
echo "Fertig! Zugangsdaten wurden gespeichert."
echo "Benutzername: $username"
if [ -z "$github_token" ]; then
    echo "Hinweis: Kein GitHub-Token gesetzt - Aenderungen werden vorerst nur lokal gespeichert."
    echo "Das kannst du jederzeit spaeter nachholen, indem du die Einrichtung erneut ausfuehrst."
fi
