#!/bin/bash
# Doppelklick-Start des Redaktions-CMS fuer macOS.
# Gegenstueck zu CMS-Start.bat (Windows). Diese Datei traegt die Endung
# .command, damit macOS sie per Doppelklick im Finder direkt ausfuehrt.

cd "$(dirname "$0")"

# App-Translocation-Erkennung (#262): macOS verschiebt Apps aus dem
# Downloads-Ordner oder nicht signierten DMGs in einen versteckten
# /private/var/folders/.../AppTranslocation-Pfad. Der Ordner ist
# schreibgeschuetzt - npm install, .env.local und alle Aenderungen
# schlagen dann stillschweigend fehl. Fruehzeitig abbrechen und
# erklaeren, was zu tun ist.
script_dir_abs="$(cd "$(dirname "$0")" && pwd -P)"
if echo "$script_dir_abs" | grep -q "AppTranslocation"; then
    echo "============================================"
    echo "  E-Motion Rennteam Aalen - Redaktions-CMS"
    echo "============================================"
    echo ""
    echo "[FEHLER] App-Translocation erkannt."
    echo ""
    echo "macOS hat diesen Ordner in einen schreibgeschuetzten Bereich"
    echo "verlegt, weil er direkt aus dem Downloads-Ordner oder einem"
    echo "DMG ausgefuehrt wurde."
    echo ""
    echo "Loesung: Den Ordner ins Programme-Verzeichnis oder den Desktop"
    echo "verschieben (Finder > Ablegen in 'Programme') und danach erneut"
    echo "starten."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

# Node.js via nvm oder Homebrew einbinden, bevor wir nach "node" suchen.
# Finder-gestartete Prozesse erben nur den System-PATH, nicht die Shell-
# Konfiguration aus ~/.zshrc oder ~/.bash_profile.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" --no-use
# Homebrew Apple Silicon (/opt/homebrew) und Intel (/usr/local)
[ -d "/opt/homebrew/bin" ] && export PATH="/opt/homebrew/bin:$PATH"
[ -d "/usr/local/bin" ]    && export PATH="/usr/local/bin:$PATH"

echo "============================================"
echo "  E-Motion Rennteam Aalen - Redaktions-CMS"
echo "============================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[FEHLER] Node.js wurde nicht gefunden."
    echo "Bitte installiere Node.js von https://nodejs.org/ (LTS-Version)"
    echo "und starte dieses Fenster danach neu."
    echo ""
    echo "Tipp: Falls Node.js ueber nvm oder Homebrew installiert ist,"
    echo "bitte einmalig das Terminal oeffnen und 'node --version' pruefen."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

# Next.js 15 benoetigt Node.js >= 18.17
NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null)
if [ -z "$NODE_MAJOR" ] || [ "$NODE_MAJOR" -lt 18 ]; then
    echo "[FEHLER] Node.js 18 oder neuer wird benoetigt."
    echo "Aktuell installiert: $(node -v 2>/dev/null || echo 'unbekannt')"
    echo "Bitte Node.js aktualisieren: https://nodejs.org"
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "[FEHLER] npm wurde nicht gefunden, obwohl Node.js vorhanden ist."
    echo "Bitte installiere Node.js von https://nodejs.org/ neu (LTS-Version)"
    echo "und starte dieses Fenster danach neu."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "[FEHLER] Diese Datei liegt nicht im Projektordner."
    echo "CMS-Start_macos.command muss im selben Ordner liegen wie \"package.json\"."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

# Informative Warnung wenn Git fehlt (blockiert NOT)
if ! command -v git >/dev/null 2>&1; then
    echo "[HINWEIS] Git ist nicht installiert."
    echo "Automatische Updates sind deaktiviert."
    echo "Zum Aktivieren: Git installieren von https://git-scm.com/"
    echo ""
fi

# Nur die tatsaechlich vorhandene next-Startdatei zaehlt. Ein blosser
# node_modules-Ordner kann von einem abgebrochenen Lauf uebrig sein.
if [ ! -f "node_modules/.bin/next" ]; then
    if [ -d "node_modules" ]; then
        echo "Eine unvollstaendige Installation wurde gefunden und wird"
        echo "aufgeraeumt. Das dauert einen Moment..."
        rm -rf "node_modules"
        if [ -d "node_modules" ]; then
            echo ""
            echo "[FEHLER] Der Ordner \"node_modules\" liess sich nicht loeschen."
            echo "Vermutlich laeuft das CMS noch in einem anderen Fenster."
            echo ""
            echo "Bitte alle anderen CMS-Fenster schliessen und diese Datei"
            echo "erneut starten."
            echo ""
            read -r -p "Zum Beenden Enter druecken..." _
            exit 1
        fi
        echo "Aufgeraeumt."
        echo ""
    fi

    echo "Abhaengigkeiten werden installiert."
    echo ""
    echo "  WICHTIG: Das dauert beim ersten Mal 2 bis 10 Minuten."
    echo "  Waehrenddessen passiert oft minutenlang scheinbar nichts -"
    echo "  das ist normal. Bitte dieses Fenster NICHT schliessen."
    echo ""

    if [ -f "package-lock.json" ]; then
        if ! npm ci --no-audit --no-fund; then
            echo ""
            echo "Hinweis: \"npm ci\" war nicht moeglich, versuche \"npm install\"..."
            echo ""
            if ! npm install --no-audit --no-fund; then
                echo ""
                echo "[FEHLER] npm install fehlgeschlagen."
                echo "Bitte Netzwerkverbindung und verfuegbaren Speicherplatz pruefen."
                echo ""
                read -r -p "Zum Beenden Enter druecken..." _
                exit 1
            fi
        fi
    else
        if ! npm install --no-audit --no-fund; then
            echo ""
            echo "[FEHLER] npm install fehlgeschlagen."
            echo "Bitte Netzwerkverbindung und verfuegbaren Speicherplatz pruefen."
            echo ""
            read -r -p "Zum Beenden Enter druecken..." _
            exit 1
        fi
    fi

    if [ ! -f "node_modules/.bin/next" ]; then
        echo ""
        echo "[FEHLER] Die Installation ist unvollstaendig geblieben."
        echo ""
        echo "Das deutet fast immer auf die Internetverbindung hin."
        echo "Bitte Verbindung pruefen und diese Datei erneut starten -"
        echo "aufgeraeumt wird dann automatisch."
        echo ""
        read -r -p "Zum Beenden Enter druecken..." _
        exit 1
    fi
    echo ""
    echo "Installation abgeschlossen."
    echo ""
fi

if [ ! -f ".env.local" ]; then
    echo "Es wurden noch keine Zugangsdaten eingerichtet."
    echo "Der Einrichtungsassistent startet jetzt..."
    echo ""
    bash "scripts/cms-setup.sh"
    if [ ! -f ".env.local" ]; then
        echo ""
        echo "Einrichtung wurde abgebrochen. Der Server wird nicht gestartet."
        read -r -p "Zum Beenden Enter druecken..." _
        exit 1
    fi
    echo ""
fi

repo_root="$(pwd)"
if lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
    stale_pid="$(lsof -tiTCP:3000 -sTCP:LISTEN -Pn 2>/dev/null | head -1)"
    stale_cwd=""
    if [ -n "$stale_pid" ]; then
        stale_cwd="$(lsof -p "$stale_pid" 2>/dev/null | awk '$4=="cwd"{print $NF; exit}')"
    fi
    if [ -n "$stale_pid" ] && [ "$stale_cwd" = "$repo_root" ]; then
        echo "Ein verwaister CMS-Server von einem vorherigen Lauf wurde gefunden"
        echo "und wird automatisch beendet..."
        pgid="$(ps -o pgid= -p "$stale_pid" 2>/dev/null | tr -d ' ')"
        if [ -n "$pgid" ]; then
            kill -TERM "-$pgid" 2>/dev/null
            sleep 1
            if lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
                kill -KILL "-$pgid" 2>/dev/null
                sleep 1
            fi
        fi
        echo ""
    fi
fi

if lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
    echo "[HINWEIS] Auf Port 3000 laeuft bereits ein Programm."
    echo "Vermutlich ist das CMS schon in einem anderen Fenster gestartet."
    echo ""
    echo "Bitte das andere CMS-Fenster schliessen und es erneut versuchen."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

echo "Der Server wird gestartet. Dieses Fenster waehrend der Nutzung bitte"
echo "geoeffnet lassen."
echo ""
echo "Das CMS oeffnet sich gleich automatisch in einem eigenen Fenster."
echo "Zum Beenden: dieses Fenster schliessen oder STRG+C druecken."
echo ""

bash "scripts/cms-open-app.sh" &

node "scripts/cms-supervisor.mjs" -p 3000

echo ""
echo "Der Server wurde beendet."
read -r -p "Zum Beenden Enter druecken..." _
