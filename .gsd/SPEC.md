# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Rectify the GitHub Action workflow for Android releases by aligning parameters with the actual project structure, ensuring successful automated publishing to the Google Play Store.

## Goals
1. Synchronize the `packageName` in `.github/workflows/android-release.yml` with the `applicationId` in `android/app/build.gradle`.
2. Resolve the "whatsnew" directory warning by either creating the directory or removing the reference in the workflow.
3. Verify that the build process correctly identifies and uses the new package identity.
4. Switch the Google Play release track to `internal` to bypass production publishing restrictions during the 14-day testing period.

## Non-Goals (Out of Scope)
- Modifying the app's functionality or logic.
- Setting up Google Play Console permissions (must be done by user).
- Modifying native Java/Kotlin code beyond build configuration.

## Users
- Developers managing the CI/CD pipeline.
- Production users receiving updates via the Play Store.

## Constraints
- Must maintain compatibility with existing Capacitor/Android build structure.
- Secrets (`GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, etc.) are assumed to be correctly configured in GitHub.

## Success Criteria
- [ ] Workflow `.github/workflows/android-release.yml` is updated with `com.wodgen.ultimate`.
- [ ] The "whatsnew" directory warning is addressed (reference removed or directory created).
- [ ] A successful local dry-run or validation of the YAML syntax.
- [ ] Change is committed and pushed to the repository.
- [ ] Workflow track is set to `internal`.
