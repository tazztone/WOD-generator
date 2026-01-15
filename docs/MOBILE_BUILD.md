# Mobile Build & Deployment Guide

This guide covers the steps to build, test, and release the Android version of the WOD Generator.

## Prerequisites

1.  **Android Studio**: Must be installed.
2.  **Android SDK**: Ensure the SDK is installed and its path is known.
3.  **Capacitor CLI**: Installed in the project (part of `package.json`).

## Project Setup

### 1. SDK Configuration
If building via command line fails with "SDK location not found", create/edit `android/local.properties`:

```properties
sdk.dir=C:\\Path\\To\\Your\\Android\\Sdk
```
*Note: On Windows, use double backslashes (`\\`).*

### 2. Assets (Icons & Splash)
To update the app icon and splash screen:

1.  Place your source icon (1024x1024 recommended) in `assets/logo.png`.
    *   *Optional:* Place a separate splash image in `assets/splash.png` (2732x2732 recommended). If omitted, `logo.png` is used.
    *   *Optional:* For dark mode, provide `assets/logo-dark.png` and `assets/splash-dark.png`.

2.  Run the generation script:
    ```bash
    npm run resources
    ```

This command uses `@capacitor/assets` to generate all required icon and splash screen densities for Android (and PWA/iOS if configured).

## Building the App

### 1. Sync Web Assets
Always run this after making changes to the React code:
```bash
npm run build
npx cap sync
```

### 2. Build Debug APK (Fastest for Testing)
Run this command from the root directory:
```bash
cd android
./gradlew assembleDebug
```
**Output Location:** `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Build Release Bundle (For Play Store)
1.  Open the project in Android Studio:
    ```bash
    npx cap open android
    ```
2.  Go to **Build > Generate Signed Bundle / APK**.
3.  Choose **Android App Bundle**.
4.  Create a new Keystore (keep this file safe!).
5.  Select **Release** build variant.
6.  Upload the `.aab` file to the Google Play Console.

## 4. Publishing to the Store
For administrative steps (Account setup, Store Listing, Privacy Policy), see:
👉 **[Google Play Publishing Guide](GOOGLE_PLAY_PUBLISH.md)**

## Troubleshooting

-   **"SDK location not found"**: Check `android/local.properties`.
-   **Native Native changes not reflecting**: Run `npx cap sync`.

## CI/CD Automation

We use GitHub Actions to automate the build and release process.

### Build & Publish Android Release
This workflow builds the APK and automatically creates a new GitHub Release for it.

*   **Trigger**: Manual. Go to **Actions** tab -> **Build & Publish Android Release** -> **Run workflow**.
*   **Quality Gate**: Runs `lint` and `tests` before building. Fails if code is broken.
*   **Inputs**:
    *   `Tag Name`: The version tag (e.g., `v7.0.1-debug`).
    *   `Release Title`: A name for the release.
*   **Output**:
    *   Creates a new GitHub Release with **auto-generated release notes**.
    *   Uploads a named APK: `wod-gen-[TAG_NAME].apk`.


