---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Release Track Adjustment

## Objective
Switch the Google Play release track from `production` to `internal` to comply with the 14-day testing requirements for new developer accounts and ensure CI/CD reliability.

## Context
- .gsd/SPEC.md
- .github/workflows/android-release.yml

## Tasks

<task type="auto">
  <name>Switch Track to Internal</name>
  <files>
    <file>.github/workflows/android-release.yml</file>
  </files>
  <action>
    - Change `track: production` to `track: internal` in the `upload-google-play` action step.
    
    RATIONALE:
    - New Google Play Developer accounts require a 14-day closed test with 12 testers before production publishing is allowed.
    - Using the `internal` track allows the workflow to succeed while the production track is locked.
  </action>
  <verify>grep "track: internal" .github/workflows/android-release.yml</verify>
  <done>
    - `track` is set to `internal`.
  </done>
</task>

<task type="auto">
  <name>Verify Workflow Syntax</name>
  <files>
    <file>.github/workflows/android-release.yml</file>
  </files>
  <action>
    - Run a syntax check on the YAML file.
  </action>
  <verify>python3 -c 'import yaml; yaml.safe_load(open(".github/workflows/android-release.yml"))'</verify>
  <done>
    - YAML syntax is valid.
  </done>
</task>

<task type="auto">
  <name>Commit Change</name>
  <files>
    <file>.github/workflows/android-release.yml</file>
  </files>
  <action>
    - Commit the track change to the repository.
  </action>
  <verify>git status</verify>
  <done>
    - Change is committed.
  </done>
</task>

## Success Criteria
- [ ] Workflow is configured to use the `internal` release track.
- [ ] YAML syntax is verified.
- [ ] Change is committed to the main branch.
