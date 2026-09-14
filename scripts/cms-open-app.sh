#!/bin/bash
# Oeffnet das CMS als eigenstaendiges App-Fenster (ohne Adressleiste, Tabs und
# Lesezeichenleiste), damit es sich wie eine richtige Desktop-Anwendung anfuehlt.
# macOS/Linux-Gegenstueck zu scripts/cms-open-app.ps1.
# Wird von CMS-Start.command / CMS-Start.sh im Hintergrund gestartet, waehrend
# der Server hochfaehrt.
#
# Das Fenster oeffnet sofort eine lokale Ladeseite (scripts/cms-loading.html)
# statt zu warten, bis der Server bereit ist - die Ladeseite selbst wartet
# (mit sichtbarer Rueckmeldung: "Server wird gestartet...") und leitet
# automatisch weiter, sobald der Server tatsaechlich antwortet. So sieht die
# Person sofort ein Fenster, statt auf einen leeren Bildschirm zu starren.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
loading_file="$script_dir/cms-loading.html"
loading_url="file://$loading_file"

if [ ! -f "$loading_file" ]; then
    # Sollte nicht passieren, aber lieber direkt auf die Login-Seite als gar
    # nichts zu oeffnen.
    loading_url="http://localhost:3000/admin/login"
fi

open_macos() {
    local chrome_app="/Applications/Google Chrome.app"
    local edge_app="/Applications/Microsoft Edge.app"
    local firefox_app="/Applications/Firefox.app"
    local safari_app="/Applications/Safari.app"
    if [ -d "$chrome_app" ]; then
        open -na "Google Chrome" --args "--app=$loading_url" "--window-size=1360,900"
    elif [ -d "$edge_app" ]; then
        open -na "Microsoft Edge" --args "--app=$loading_url" "--window-size=1360,900"
    elif [ -d "$firefox_app" ]; then
        # Firefox: --ssb (Site-Specific Browser) opens a minimal app window.
        # Falls back gracefully if --ssb is unavailable (older Firefox).
        open -a Firefox "$loading_url" --args --ssb || open -a Firefox "$loading_url"
    elif [ -d "$safari_app" ]; then
        # Safari hat keinen App-Fenster-Modus. Neues Fenster oeffnen und die
        # Lesezeichenleiste ausblenden — immer noch besser als nichts.
        echo "Tipp: Google Chrome oder Microsoft Edge installieren fuer ein App-Fenster ohne Browser-Leisten."
        osascript -e "
            tell application \"Safari\"
                activate
                make new window
                set URL of front document to \"$loading_url\"
                set bounds of front window to {100, 50, 1460, 950}
            end tell
        " 2>/dev/null || open -a Safari "$loading_url"
    else
        open "$loading_url"
    fi
}

open_linux() {
    local browser=""
    for candidate in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge microsoft-edge-stable; do
        if command -v "$candidate" >/dev/null 2>&1; then
            browser="$candidate"
            break
        fi
    done
    if [ -n "$browser" ]; then
        # --app=<url> startet ein eigenes Fenster ohne Browser-Bedienelemente,
        # genau wie unter macOS/Windows. nohup + disown, damit das Fenster
        # offen bleibt, wenn dieses Skript (und damit sein Elternprozess)
        # endet.
        nohup "$browser" --app="$loading_url" --window-size=1360,900 >/dev/null 2>&1 &
        disown
    elif command -v xdg-open >/dev/null 2>&1; then
        # Kein Chromium-basierter Browser gefunden: normaler Standardbrowser
        # als Rueckfall (kein App-Fenster, aber funktioniert ueberall).
        nohup xdg-open "$loading_url" >/dev/null 2>&1 &
        disown
    fi
}

case "$(uname -s)" in
    Darwin)
        open_macos
        ;;
    Linux)
        open_linux
        ;;
    *)
        # Unbekanntes System (z.B. WSL, BSD): bestmoeglicher Versuch.
        command -v xdg-open >/dev/null 2>&1 && xdg-open "$loading_url" >/dev/null 2>&1 &
        ;;
esac
