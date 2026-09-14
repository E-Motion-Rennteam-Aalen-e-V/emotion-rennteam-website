#!/bin/bash
# Doppelklick-/Terminal-Start des Redaktions-CMS fuer Linux.
# Inhaltlich identisch mit CMS-Start.command (macOS) - siehe dort fuer den
# ausfuehrlichen Kommentar zur bewussten Duplizierung zwischen den
# Plattform-Startern. cms-update.sh, cms-setup.sh und cms-open-app.sh sind
# bereits plattformuebergreifend (bash) und erkennen Linux selbststaendig.
#
# Hinweis: ob ein Doppelklick diese Datei direkt ausfuehrt oder im
# Dateimanager oeffnet, haengt vom jeweiligen Linux-Dateimanager ab. Falls ein
# Doppelklick nicht funktioniert, im Terminal ausfuehren:
#   bash CMS-Start.sh

cd "$(dirname "$0")"

echo "============================================"
echo "  E-Motion Rennteam Aalen - Redaktions-CMS"
echo "============================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[FEHLER] Node.js wurde nicht gefunden."
    echo "Bitte installiere Node.js von https://nodejs.org/ (LTS-Version)"
    echo "oder ueber den Paketmanager deiner Distribution, und starte dieses"
    echo "Fenster danach neu."
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
    echo "CMS-Start.sh muss im selben Ordner liegen wie \"package.json\"."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

# Der Update-Check laeuft NICHT mehr hier im Vordergrund - das wuerde den
# Start unnoetig verzoegern, bevor ueberhaupt etwas zu sehen ist. Stattdessen
# prueft scripts/cms-supervisor.mjs direkt beim Start (und danach alle paar
# Minuten) im Hintergrund auf Updates, waehrend der Server bereits laeuft -
# man landet dadurch sofort auf der Login-Seite.

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

# Laeuft schon ein CMS auf Port 3000? Dann wuerde Next.js auf einen anderen
# Port ausweichen und das App-Fenster ins Leere zeigen.
# Handelt es sich um einen verwaisten Server aus einem vorherigen Lauf
# (gleiches Arbeitsverzeichnis), wird er automatisch bereinigt.
repo_root="$(pwd)"
if command -v lsof >/dev/null 2>&1 && lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
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

if command -v lsof >/dev/null 2>&1 && lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
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

# Der Supervisor startet den eigentlichen Server und prueft waehrend des
# Betriebs alle paar Minuten selbststaendig auf Updates - wird eines
# gefunden, wendet er es an und startet den Server automatisch neu.
node "scripts/cms-supervisor.mjs" -p 3000

echo ""
echo "Der Server wurde beendet."
read -r -p "Zum Beenden Enter druecken..." _
