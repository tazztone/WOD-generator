#!/bin/bash

# Configuration
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
DATE_TAG=$(date +"%Y%m%d%H%M%S")
RELEASE_TAG="debug-build-$DATE_TAG"
RELEASE_TITLE="Debug Build $(date +"%Y-%m-%d %H:%M")"

# Check dependencies
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it to push releases."
    exit 1
fi

echo "🚀 Building fresh debug APK..."
cd android && ./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting release."
    exit 1
fi

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found at $APK_PATH"
    exit 1
fi

echo "📦 Pushing debug APK to GitHub Releases ($RELEASE_TAG)..."
# Create a pre-release on GitHub using the gh CLI
gh release create "$RELEASE_TAG" "$APK_PATH" -t "$RELEASE_TITLE" -n "Automated debug build." -p

if [ $? -eq 0 ]; then
    echo "✅ Successfully created release: https://github.com/tazztone/WOD-generator/releases/tag/$RELEASE_TAG"
else
    echo "❌ Failed to create GitHub release. Are you authenticated with 'gh auth login'?"
    exit 1
fi
