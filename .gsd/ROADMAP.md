# ROADMAP.md

> **Current Milestone**: v1.2-env-fix
> **Goal**: Restore Android build functionality by aligning Capacitor versions with Node 20.

## Must-Haves
- [ ] Downgrade Capacitor packages to `^7.0.0`.
- [ ] Successfully run `npm install` and `npx cap sync android`.
- [ ] Verify Gradle project validity.

## Phases

### Phase 1: Environment Alignment
**Status**: ⬜ Not Started
**Objective**: Update dependencies and sync native Android project.
- Task 1: Update `package.json` Capacitor versions.
- Task 2: Execute `npm install`.
- Task 3: Execute `npx cap sync android`.
- Task 4: Verify directory existence and Gradle sync.
