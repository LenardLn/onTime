# OnTime mobile — install deps, ensure Android project, start backend + Metro + app
$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$Mobile = Join-Path $Root "mobile"
$Backend = Join-Path $Root "be"
$Manifest = Join-Path $Mobile "android\app\src\main\AndroidManifest.xml"

Set-Location $Mobile

if ($Mobile -match 'OneDrive') {
  Write-Host "WARNING: Project is under OneDrive — npm install may be very slow." -ForegroundColor Yellow
  Write-Host "         Consider copying to C:\dev\onTime first." -ForegroundColor Yellow
}

if (-not (Test-Path (Join-Path $Mobile ".npmrc"))) {
  @"
strict-ssl=false
registry=https://registry.npmjs.org/
audit=false
fund=false
"@ | Set-Content (Join-Path $Mobile ".npmrc")
  Write-Host "Created .npmrc with strict-ssl=false (SSL fix)" -ForegroundColor Yellow
}

Write-Host "==> [1/6] npm install (mobile) — may take several minutes" -ForegroundColor Cyan
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

if (-not (Test-Path (Join-Path $Mobile "android"))) {
  Write-Host "==> [2/6] Generating Android project (first time only)..." -ForegroundColor Cyan
  npm run init-android
  if ($LASTEXITCODE -ne 0) { throw "react-native init failed" }
  Write-Host "    If App.tsx or src/ were overwritten, restore from git." -ForegroundColor Yellow
} else {
  Write-Host "==> [2/6] android/ already exists — skip init" -ForegroundColor Green
}

if (Test-Path $Manifest) {
  Write-Host "==> [3/6] AndroidManifest permissions" -ForegroundColor Cyan
  $xml = Get-Content $Manifest -Raw
  $perms = @(
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION',
    'android.permission.INTERNET'
  )
  foreach ($perm in $perms) {
    if ($xml -notmatch [regex]::Escape($perm)) {
      $line = "    <uses-permission android:name=`"$perm`" />"
      $xml = $xml -replace '(<manifest[^>]*>)', "`$1`n$line"
      Write-Host "    Added $perm"
    }
  }
  Set-Content $Manifest $xml -NoNewline
} else {
  Write-Host "==> [3/6] No AndroidManifest — skip (no android/)" -ForegroundColor Yellow
}

Write-Host "==> [4/6] Starting backend (new window)..." -ForegroundColor Cyan
$beCmd = @"
Set-Location '$Backend'
if (Test-Path '.\venv\Scripts\Activate.ps1') { .\venv\Scripts\Activate.ps1 }
pip install -r requirements.txt -q
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $beCmd

Write-Host "==> [5/6] Starting Metro (new window)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Mobile'; npm start"

Start-Sleep -Seconds 8

if (Test-Path (Join-Path $Mobile "android")) {
  if (-not $env:ANDROID_HOME) {
    Write-Host "==> [6/6] ANDROID_HOME not set — start an emulator, then run: npm run android" -ForegroundColor Yellow
  } else {
    Write-Host "==> [6/6] Building and launching Android app..." -ForegroundColor Cyan
    npm run android
  }
} else {
  Write-Host "==> [6/6] No android/ — cannot run app. Fix step 2 and run: npm run android" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done. Backend: http://127.0.0.1:8000/docs | Metro: port 8081" -ForegroundColor Green
Write-Host "Open Android emulator first if the app did not launch." -ForegroundColor Green
