---
phase: 1
level: 1
researched_at: 2026-01-31
---

# Phase 1 Research: Workflow Hotfix

## Questions Investigated
1. Confirm the primary cause of the "Package not found" error.
2. Verify if `whatsNewDirectory` is optional in `r0adkll/upload-google-play@v1`.
3. Check for other hardcoded package name references in the codebase.

## Findings

### Primary Failure Cause
The `packageName` in the GitHub Action was set to `com.tazztone.wodgen`, whereas the application's actual ID (defined in `build.gradle`, `strings.xml`, and `capacitor.config.json`) is `com.wodgen.ultimate`. Google Play API rejects uploads where the package name does not match an existing app in the console.

### whatsNewDirectory Reference
The `whatsNewDirectory` input is optional. Removing it will stop the warning "Unable to find 'whatsnew' directory" without affecting the core functionality of the upload, unless localized release notes are specifically required.

### Codebase Scanning
Scanning the project revealed that `com.wodgen.ultimate` is used consistently in:
- `android/app/build.gradle` (namespace & applicationId)
- `android/app/src/main/res/values/strings.xml`
- `android/app/src/main/java/com/wodgen/ultimate/MainActivity.java`
- `capacitor.config.json`

The only incorrect reference is in the workflow file.

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package Name | `com.wodgen.ultimate` | Matches the actual Android project configuration. |
| Release Notes | Remove `whatsNewDirectory` reference | Simplifies the workflow and removes unnecessary warnings for now. |

## Patterns to Follow
- Always align workflow `packageName` with `applicationId` in `build.gradle`.

## Ready for Planning
- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified
