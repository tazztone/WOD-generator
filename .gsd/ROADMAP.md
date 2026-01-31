# ROADMAP.md

> **Current Milestone**: v1.2-env-fix
> **Goal**: Restore Android build functionality by aligning Capacitor versions with Node 20.

## Must-Haves
- [x] Downgrade Capacitor packages to `^7.0.0`.
- [x] Successfully run `npm install` and `npx cap sync android`.
- [x] Verify Gradle project validity.

## Phases

### Phase 1: Environment Alignment
**Status**: ✅ Completed
**Objective**: Update dependencies and sync native Android project.
- [x] Task 1: Update `package.json` Capacitor versions.
- [x] Task 2: Execute `npm install`.
- [x] Task 3: Execute `npx cap sync android`.
- [x] Task 4: Verify directory existence and Gradle sync.
