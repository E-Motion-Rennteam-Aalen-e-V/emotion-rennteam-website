#!/bin/bash
# Einmalig auf einem echten Mac auszufuehren, nachdem "E-Motion CMS.app"
# neu gebaut oder geaendert wurde (z.B. neues Icon, geaenderter Launcher).
#
# Ad-hoc-Signierung (kein Apple-Developer-Account/Zertifikat noetig, nur die
# Xcode Command Line Tools: xcode-select --install) macht die App fuer
# Gatekeeper konsistent nutzbar: ohne jede Signatur zeigt macOS auf manchen
# Versionen/Architekturen (v.a. Apple Silicon) statt der ueblichen
# "unbekannter Entwickler"-Warnung die haertere Meldung "... ist beschaedigt
# und kann nicht geoeffnet werden". Ad-hoc-Signierung verhindert das - die
# einmalige "unbekannter Entwickler"-Warnung bleibt trotzdem bestehen (dafuer
# ist ein bezahltes Zertifikat + Notarisierung noetig), laesst sich aber mit
# Rechtsklick -> "Oeffnen" bestaetigen.
#
# Muss nach JEDER Aenderung an der App (auch am Quellcode/Icon) erneut
# laufen, sonst greift die alte Signatur nicht mehr / macOS beschwert sich.
set -euo pipefail

if [[  "$(uname -s)" != "Darwin" ]]; then
    echo "[FEHLER] Dieses Skript funktioniert nur auf macOS (braucht codesign)." >&2
    exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
app_path="$repo_root/E-Motion CMS.app"

if [[ ! -d "$app_path" ]]; then
    echo "[FEHLER] \"$app_path\" nicht gefunden." >&2
    exit 1
fi

if ! command -v codesign >/dev/null 2>&1; then
    echo "[FEHLER] codesign nicht gefunden. Xcode Command Line Tools installieren:" >&2
    echo "  xcode-select --install" >&2
    exit 1
fi

echo "Entferne evtl. vorhandenes Quarantaene-Flag..."
xattr -cr "$app_path"

# Stelle sicher, dass der Launcher ausfuehrbar ist. Geht das Executable-Bit
# verloren (z.B. durch Oeffnen und Speichern in einem Editor, der 644 setzt,
# oder durch unvollstaendiges ZIP-Entpacken), wuerde macOS die App mit
# "beschaedigt und kann nicht geoeffnet werden" ablehnen - obwohl codesign
# selbst keinen Fehler meldet. Explizites chmod +x hier verhindert das.
echo "Setze Ausfuehrungsrechte fuer Launcher..."
chmod +x "$app_path/Contents/MacOS/cms-launcher"

echo "Signiere \"$app_path\" ad-hoc (Signatur: -, kein Zertifikat noetig)..."
codesign --force --deep --sign - "$app_path"

echo ""
echo "Fertig. Verifiziere Signatur:"
codesign --verify --verbose "$app_path"

echo ""
echo "Diese Version von \"E-Motion CMS.app\" jetzt committen, damit alle,"
echo "die das Repo per GitHub-ZIP herunterladen, die signierte Version bekommen."
