# Local Android Release Build Script
# This mimics the GitHub Action workflow without needing Docker

Write-Host "🚀 Starting Local Android Build..." -ForegroundColor Cyan

# 1. Environment Check
if (!(Get-Command npm -ErrorAction SilentlyContinue)) { Write-Error "npm not found. Please install Node.js."; exit }

# 2. Build Web Assets
Write-Host "📦 Building Web App..." -ForegroundColor Yellow
npm run build

# 3. Sync Capacitor
Write-Host "🔄 Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 3.5 Versioning Setup (Persistent Auto-Increment)
$buildFile = Join-Path $PSScriptRoot ".build_number"
if (Test-Path $buildFile) {
    [int]$currentBuild = Get-Content $buildFile
    $nextBuild = $currentBuild + 1
}
else {
    $nextBuild = 1
}
$env:BUILD_NUMBER = $nextBuild.ToString()
$versionCode = 7000 + $nextBuild
Write-Host "🔢 Version Code: $versionCode (Incremental Build: #$nextBuild)" -ForegroundColor Green

# 4. Android Signing Setup
$keystorePath = Join-Path $PSScriptRoot "my-release-key.keystore"
if (!(Test-Path $keystorePath)) { 
    Write-Error "Keystore not found at $keystorePath. Please run the keytool command first."
    exit 
}

# Copy keystore to where Gradle expects it
Copy-Item $keystorePath "android/app/release-key.keystore" -Force

$env:ANDROID_KEYSTORE_PASSWORD = Read-Host -Prompt "Enter Keystore Password"
$env:ANDROID_KEY_ALIAS = "my-key-alias"
$env:ANDROID_KEY_PASSWORD = $env:ANDROID_KEYSTORE_PASSWORD
# We tell the build.gradle it's okay to sign
$env:ANDROID_KEYSTORE_BASE64 = "LOCAL_BUILD" 

# 5. Build signed APK & App Bundle
Write-Host "🏗️  Building Release APK & App Bundle (.aab)..." -ForegroundColor Yellow
Set-Location android
./gradlew bundleRelease assembleRelease
Set-Location ..

# 6. Success & Rename
if ($LASTEXITCODE -eq 0) {
    $nextBuild | Out-File -FilePath $buildFile -Encoding ascii
    
    # Define descriptive names
    $apkPath = "android/app/build/outputs/apk/release/app-release.apk"
    $aabPath = "android/app/build/outputs/bundle/release/app-release.aab"
    
    $newApkName = "wod-gen-v7.0.0-build$nextBuild.apk"
    $newAabName = "wod-gen-v7.0.0-build$nextBuild.aab"
    
    $finalApkPath = "android/app/build/outputs/apk/release/$newApkName"
    $finalAabPath = "android/app/build/outputs/bundle/release/$newAabName"
    
    Move-Item -Path $apkPath -Destination $finalApkPath -Force
    Move-Item -Path $aabPath -Destination $finalAabPath -Force

    Write-Host "`n✅ Build Successful!" -ForegroundColor Green
    Write-Host "🔢 Local Build Number updated to: $nextBuild" -ForegroundColor Cyan
    Write-Host "📍 APK: $finalApkPath" -ForegroundColor White
    Write-Host "📍 AAB: $finalAabPath" -ForegroundColor White
}
else {
    Write-Error "Build failed with exit code $LASTEXITCODE"
}
