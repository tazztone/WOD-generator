# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Rectify build environment issues by aligning Capacitor versions with the current Node.js environment (v20) and restoring missing Android native bridge files.

## Goals
1. Downgrade Capacitor core packages to version 7 to support Node 20.
2. Regenerate the `android/capacitor-cordova-android-plugins` directory.
3. Fix the Gradle configuration errors related to missing scripts.

## Success Criteria
- [ ] `package.json` updated with Capacitor `^7.0.0`.
- [ ] `npm install` and `npx cap sync android` complete successfully.
- [ ] `android/capacitor-cordova-android-plugins/cordova.variables.gradle` exists.
- [ ] Gradle project syncs without errors.
