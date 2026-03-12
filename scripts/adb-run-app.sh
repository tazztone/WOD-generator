#!/bin/bash

# Configuration
PACKAGE_NAME="com.wodgen.ultimate"
MAIN_ACTIVITY=".MainActivity"

# Use system ADB or fall back
ADB=$(command -v adb || echo "/home/tazztone/Android/Sdk/platform-tools/adb")

echo "📦 Building web assets and syncing to Capacitor..."
npm run build && npx cap sync

echo "🚀 Building and installing debug APK..."
cd android && ./gradlew installDebug

if [ $? -eq 0 ]; then
    echo "✅ Install successful. Launching $PACKAGE_NAME..."
    $ADB shell am start -n $PACKAGE_NAME/$MAIN_ACTIVITY
else
    echo "❌ Build or Install failed."
    exit 1
fi
