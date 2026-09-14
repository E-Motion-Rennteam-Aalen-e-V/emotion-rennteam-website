# Interaktive Ersteinrichtung der lokalen CMS-Zugangsdaten (.env.local).
# Wird von CMS-Zugangsdaten-aendern.bat und CMS-Start.bat aufgerufen.

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $repoRoot ".env.local"

Write-Host ""
Write-Host "=== Einrichtung: CMS-Zugangsdaten ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $envPath) {
    $overwrite = Read-Host "Es existiert bereits eine .env.local. Ueberschreiben? (j/n)"
    if ($overwrite -notmatch '^[jJ]') {
        Write-Host "Abgebrochen. Bestehende Datei bleibt unveraendert."
        exit 0
    }
    Write-Host ""
}

$username = Read-Host "Benutzername fuer den Login (Enter fuer 'admin')"
if ([string]::IsNullOrWhiteSpace($username)) { $username = "admin" }

function Read-PasswordPlain([string]$prompt) {
    $secure = Read-Host -Prompt $prompt -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

while ($true) {
    $pw1 = Read-PasswordPlain "Neues Passwort (mind. 8 Zeichen)"
    if ([string]::IsNullOrWhiteSpace($pw1) -or $pw1.Length -lt 8) {
        Write-Host "Das Passwort muss mindestens 8 Zeichen lang sein." -ForegroundColor Yellow
        continue
    }
    $pw2 = Read-PasswordPlain "Passwort wiederholen"
    if ($pw1 -ne $pw2) {
        Write-Host "Die Passwoerter stimmen nicht ueberein. Bitte erneut versuchen." -ForegroundColor Yellow
        continue
    }
    break
}

Write-Host ""
Write-Host "Passwort-Hash wird erzeugt..."
Push-Location $repoRoot
try {
    $hash = & node "scripts/cms-hash-password.mjs" "$pw1" 2>$null
} finally {
    Pop-Location
}
if ([string]::IsNullOrWhiteSpace($hash)) {
    Write-Host "[FEHLER] Der Passwort-Hash konnte nicht erzeugt werden. Ist Node.js installiert?" -ForegroundColor Red
    exit 1
}
$hash = $hash.Trim()

$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $rng.GetBytes($bytes)
} finally {
    $rng.Dispose()
}
$sessionSecret = ($bytes | ForEach-Object { $_.ToString("x2") }) -join ""

Write-Host ""
Write-Host "--- GitHub-Anbindung (optional, aber empfohlen) ---"
Write-Host "Damit Speicherungen automatisch als Commit ins GitHub-Repository geschrieben werden."
Write-Host "Ohne Token werden Aenderungen NUR lokal auf diesem PC gespeichert."
Write-Host "Token erstellen: https://github.com/settings/tokens (fine-grained, 'Contents: Read and write')"
Write-Host "(Der Token wird beim Einfuegen sichtbar - das ist normal, damit Copy-Paste zuverlaessig funktioniert.)"

# Prueft den Token sofort gegen die GitHub-API, statt ihn blind zu
# akzeptieren - sonst faellt ein falsch eingefuegter oder zu schwach
# berechtigter Token erst Wochen spaeter beim ersten echten Speichern auf,
# als kryptisches "(401)" ohne jeden Hinweis, was zu tun ist.
function Test-GithubToken([string]$token, [string]$owner, [string]$repo) {
    $headers = @{
        Authorization        = "Bearer $token"
        Accept               = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
    }

    # /repos/{owner}/{repo} alone doesn't prove the token is valid: for a
    # PUBLIC repo (like this one), GitHub serves that endpoint's basic
    # metadata even with no/garbage auth, since anyone can read it
    # anonymously. /user has no such loophole - it returns "who am I" and
    # always requires genuinely valid auth, so check that first.
    try {
        Invoke-WebRequest -Uri "https://api.github.com/user" -Headers $headers -UseBasicParsing -ErrorAction Stop | Out-Null
    } catch {
        $status = $null
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        if ($status -eq 401 -or $status -eq 403) {
            return @{ Ok = $false; Message = "Token ist UNGUELTIG, abgelaufen oder wurde falsch eingefuegt (Status $status)." }
        }
        return @{ Ok = $null; Message = "Token konnte nicht geprueft werden (evtl. keine Internetverbindung) - wird trotzdem uebernommen." }
    }

    try {
        $response = Invoke-WebRequest -Uri "https://api.github.com/repos/$owner/$repo" -Headers $headers -UseBasicParsing -ErrorAction Stop
        $data = $response.Content | ConvertFrom-Json
        if ($data.permissions -and -not $data.permissions.push) {
            return @{ Ok = $false; Message = "Token ist gueltig, hat aber KEINE Schreibrechte fuer '$owner/$repo' (Berechtigung 'Contents: Read and write' fehlt)." }
        }
        return @{ Ok = $true; Message = "Token gueltig, Schreibzugriff auf '$owner/$repo' bestaetigt." }
    } catch {
        $status = $null
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        if ($status -eq 404 -or $status -eq 403) {
            return @{ Ok = $false; Message = "Token ist gueltig, aber Repository '$owner/$repo' wurde nicht gefunden oder der Token hat keinen Zugriff darauf (Status $status)." }
        }
        return @{ Ok = $null; Message = "Token konnte nicht vollstaendig geprueft werden - wird trotzdem uebernommen." }
    }
}

$githubOwner = "Hudnur111"
$githubRepo = "Website---E-Motion-Rennteam-Aalen-"
$githubBranch = "website"
$githubToken = ""

while ($true) {
    $githubToken = (Read-Host "GitHub Personal Access Token (leer lassen zum Ueberspringen)").Trim()
    if ([string]::IsNullOrWhiteSpace($githubToken)) { break }

    $ownerInput = Read-Host "GitHub-Benutzer/Organisation (Enter fuer '$githubOwner')"
    if (-not [string]::IsNullOrWhiteSpace($ownerInput)) { $githubOwner = $ownerInput.Trim() }

    $repoInput = Read-Host "Repository-Name (Enter fuer '$githubRepo')"
    if (-not [string]::IsNullOrWhiteSpace($repoInput)) { $githubRepo = $repoInput.Trim() }

    $branchInput = Read-Host "Branch, in den committet wird (Enter fuer '$githubBranch')"
    if (-not [string]::IsNullOrWhiteSpace($branchInput)) { $githubBranch = $branchInput.Trim() }

    Write-Host "Token wird geprueft..."
    $result = Test-GithubToken -token $githubToken -owner $githubOwner -repo $githubRepo
    if ($result.Ok -eq $true) {
        Write-Host $result.Message -ForegroundColor Green
        break
    } elseif ($result.Ok -eq $null) {
        Write-Host $result.Message -ForegroundColor Yellow
        break
    } else {
        Write-Host $result.Message -ForegroundColor Red
        $retry = Read-Host "Token erneut eingeben? (j/n, 'n' uebernimmt ihn trotzdem)"
        if ($retry -match '^[jJ]') { continue }
        break
    }
}

$lines = @(
    "CMS_ADMIN_USER=$username",
    "CMS_ADMIN_PASSWORD_HASH=$hash",
    "CMS_SESSION_SECRET=$sessionSecret",
    "GITHUB_TOKEN=$githubToken",
    "GITHUB_OWNER=$githubOwner",
    "GITHUB_REPO=$githubRepo",
    "GITHUB_BRANCH=$githubBranch"
)
Set-Content -Path $envPath -Value $lines -Encoding UTF8

Write-Host ""
Write-Host "Fertig! Zugangsdaten wurden gespeichert." -ForegroundColor Green
Write-Host "Benutzername: $username"
if ([string]::IsNullOrWhiteSpace($githubToken)) {
    Write-Host "Hinweis: Kein GitHub-Token gesetzt - Aenderungen werden vorerst nur lokal gespeichert." -ForegroundColor Yellow
    Write-Host "Das kannst du jederzeit spaeter nachholen, indem du die Einrichtung erneut ausfuehrst."
}
