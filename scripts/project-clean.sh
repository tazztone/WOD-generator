#!/bin/bash

echo "🧹 Cleaning Gradle build cache..."
cd android && ./gradlew clean

if [ $? -eq 0 ]; then
    echo "✅ Project cleaned successfully."
else
    echo "❌ Clean failed."
    exit 1
fi
