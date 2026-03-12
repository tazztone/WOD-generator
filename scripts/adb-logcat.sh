#!/bin/bash

# Configuration
PACKAGE_NAME="com.wodgen.ultimate"
MAIN_ACTIVITY=".MainActivity"

# Use system ADB or fall back
ADB=$(command -v adb || echo "/home/tazztone/Android/Sdk/platform-tools/adb")

PID=$($ADB shell pidof -s $PACKAGE_NAME)

if [ -z "$PID" ]; then
    echo "⚠️ $PACKAGE_NAME is not running. Starting it now..."
    $ADB shell am start -n $PACKAGE_NAME/$MAIN_ACTIVITY
    sleep 2
    PID=$($ADB shell pidof -s $PACKAGE_NAME)
fi

if [ -z "$PID" ]; then
    echo "❌ Failed to find or start $PACKAGE_NAME"
    exit 1
fi

echo "📋 Streaming logs for $PACKAGE_NAME (PID: $PID)..."
$ADB logcat --pid=$PID
