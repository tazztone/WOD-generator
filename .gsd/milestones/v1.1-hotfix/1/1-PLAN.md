---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Workflow Parameter Realignment

## Objective
Align the GitHub Action workflow with the project's actual Android configuration to enable successful Play Store uploads and remove unnecessary warnings.

## Context
- .gsd/SPEC.md
- .gsd/phases/1/RESEARCH.md
- .github/workflows/android-release.yml
- android/app/build.gradle

## Tasks

<task type="auto">
  <name>Update Workflow Parameters</name>
  <files>
    <file>.github/workflows/android-release.yml</file>
  </files>
  <action>
    - Change `packageName` from `com.tazztone.wodgen` to `com.wodgen.ultimate`.
    - Remove the `whatsNewDirectory` line from the `upload-google-play` action step.
    
    RATIONALE:
    - The `packageName` must match the `applicationId` in `build.gradle` for the Play Store API to recognize the app.
    - The `whatsNewDirectory` is optional and its absence causes a non-fatal but distracting warning when the directory doesn't exist.
  </action>
  <verify>grep "packageName: com.wodgen.ultimate" .github/workflows/android-release.yml && ! grep "whatsNewDirectory" .github/workflows/android-release.yml</verify>
  <done>
    - `packageName` is correctly set.
    - `whatsNewDirectory` setting is removed.
  </done>
</task>

<task type="auto">
  <name>Finalize and Verify Syntax</name>
  <files>
    <file>.github/workflows/android-release.yml</file>
  </files>
  <action>
    - Run a syntax check on the YAML file to ensure no formatting errors were introduced.
  </action>
  <verify>python3 -c 'import yaml; yaml.safe_load(open(".github/workflows/android-release.yml"))'</verify>
  <done>
    - YAML syntax is valid.
  </done>
</task>

## Success Criteria
- [ ] Workflow file matches the `applicationId` used in the Android project.
- [ ] Harmful warning source is removed.
- [ ] Syntax is validated for CI/CD ingestion.
