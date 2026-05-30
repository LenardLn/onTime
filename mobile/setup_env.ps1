# Set Android SDK paths
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
$env:Path += ";$env:ANDROID_HOME\emulator"

# Fix JAVA_HOME to point to the correct version (21)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

Write-Host "--- Environment Fixed ---" -ForegroundColor Cyan
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "JAVA_HOME   : $env:JAVA_HOME"
Write-Host ""
Write-Host "Testing tools..."
adb version
java -version

Write-Host ""
Write-Host "Ready! Now run: npm run android" -ForegroundColor Green
