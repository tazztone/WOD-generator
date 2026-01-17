# Android Build & Google Play Publishing Guide

This comprehensive guide covers everything from building the app locally to automating releases and publishing to the Google Play Store.

---

## 🏗️ 1. Local Development & Build

### Prerequisites
*   **Android Studio**: Installed and configured.
*   **Java 21**: Recommended for the current Gradle setup.
*   **Capacitor CLI**: Used for syncing web assets to the native project.

### The Local Build Script
We use a specialized PowerShell script for fast, signed local builds that mimics the GitHub pipeline.

1.  **Run the Script**:
    ```powershell
    .\build-android-local.ps1
    ```
2.  **What it does**:
    *   Syncs web assets (`npm run build` + `npx cap sync`).
    *   **Auto-Version**: Increments a local `.build_number` file so every build is unique.
    *   **Signs**: Asks for your keystore password to create production-ready files.
    *   **Renames**: Produces descriptive files like `wod-gen-v7.0.0-build5.aab`.

3.  **Outputs**: Found in `android/app/build/outputs/`
    *   `.apk`: For direct testing on your phone.
    *   `.aab`: The bundle required for Google Play Console.

---

## 🚀 2. Automated CI/CD (GitHub Actions)

The workflow `Build & Publish Android Release` handles the entire "Pro" pipeline for you.

### How to Trigger
*   **Git Tag (Best)**: Just push a tag: `git tag v7.0.1; git push origin v7.0.1`.
*   **Manual**: Go to the **Actions** tab in GitHub, select the workflow, and click **Run workflow**.

### Features
*   **Zero-Touch Signing**: Uses GitHub Secrets to sign the release.
*   **Optimization**: Runs R8/Minification to shrink the app size.
*   **Release Artifacts**: Automatically creates a GitHub Release and attaches the signed APK, AAB, and the ProGuard `mapping.txt` (needed for crash debugging).

---

## 📱 3. Google Play Console Setup

### Account & App Creation
1.  **Developer Account**: Register at [Google Play Console](https://play.google.com/console) ($25 one-time fee).
2.  **Create App**: Select **App**, **Free**, and provide "WOD Gen Ultimate" as the name.

### Mandatory Declarations
*   **Privacy Policy**: Provide a link to your privacy policy (e.g., hosted on GitHub Pages).
*   **Ads**: Select "No ads".
*   **Data Safety**: Since all data is local (`localStorage`) and not sent to servers, declare that no data is collected/shared.

### Store Listing
*   **App Icon**: 512x512 PNG.
*   **Feature Graphic**: 1024x500 banner (Required).
*   **Screenshots**: Provide at least 2 phone screenshots.

---

## 📤 4. Publishing a Release

1.  **Create Release**: Go to **Production** or **Internal Testing**.
2.  **App Signing**: Choose **"Let Google generate an app signing key"** (Recommended).
3.  **Upload AAB**: Drag and drop the `.aab` file from your local build or GitHub Release.
4.  **Upload Mapping File**: 
    *   *Important*: Upload the `mapping.txt` file generated during the build. This clears the "Deobfuscation" warning and makes crash reports readable.
5.  **Rollout**: Review and submit for Google's approval (usually 3-7 days for the first release).

---

## 🛠️ Troubleshooting & Maintenance

*   **Version Code Error**: If Google rejects an upload because the version code is used, ensure you are using the `build-android-local.ps1` script (which auto-increments) or triggering a fresh GitHub Action run.
*   **Keystore Safety**: **NEVER** commit your `.keystore` file to Git. Your `.gitignore` is already configured to prevent this. Keep your local copy in a secure backup (e.g., 1password).
*   **Sync Issues**: If React changes aren't appearing in the app, run `npx cap sync android`.
