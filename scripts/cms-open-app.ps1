# Oeffnet das CMS als eigenstaendiges App-Fenster (ohne Adressleiste, Tabs und
# Lesezeichenleiste), damit es sich wie eine richtige Desktop-Anwendung anfuehlt.
# Wird von CMS-Start.bat im Hintergrund gestartet, waehrend der Server hochfaehrt.
#
# Das Fenster oeffnet sofort eine lokale Ladeseite (scripts/cms-loading.html)
# statt zu warten, bis der Server bereit ist - die Ladeseite selbst wartet
# (mit sichtbarer Rueckmeldung: "Server wird gestartet...") und leitet
# automatisch weiter, sobald der Server tatsaechlich antwortet. So sieht die
# Person sofort ein Fenster, statt auf einen leeren Bildschirm zu starren.

$ErrorActionPreference = "SilentlyContinue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$loadingFile = Join-Path $scriptDir "cms-loading.html"

if (Test-Path $loadingFile) {
    $loadingUrl = "file:///" + ($loadingFile -replace '\\', '/')
} else {
    # Sollte nicht passieren, aber lieber direkt auf die Login-Seite als gar
    # nichts zu oeffnen.
    $loadingUrl = "http://localhost:3000/admin/login"
}

$candidatePaths = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$browserExe = $null
foreach ($candidate in $candidatePaths) {
    if ($candidate -and (Test-Path $candidate)) {
        $browserExe = $candidate
        break
    }
}

if ($browserExe) {
    # --app=<url> startet ein eigenes Fenster ohne Browser-Bedienelemente.
    Start-Process -FilePath $browserExe -ArgumentList @(
        "--app=$loadingUrl",
        "--window-size=1360,900"
    )
} else {
    # Weder Edge noch Chrome gefunden: normaler Standardbrowser als Rueckfall.
    Start-Process $loadingUrl
}
