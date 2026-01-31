---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Data Integrity & Safety

## Objective
Harden the application against data corruption and ensure valid configuration states.

## Context
- .gsd/SPEC.md
- src/App.jsx (JSON parsing)
- src/screens/ConfigScreen.jsx (Validation)
- src/engine/storage.js (Migration logic)

## Tasks

<task type="auto">
  <name>Implement robust JSON parsing and Error Boundaries</name>
  <files>/home/tazztone/_coding/WOD-generator/src/App.jsx</files>
  <action>
    - Add try-catch blocks around all localStorage.getItem and JSON.parse calls.
    - If parsing fails, fall back to empty state or default config instead of crashing.
  </action>
  <verify>Check App.jsx for try-catch around history loading.</verify>
  <done>JSON.parse calls are wrapped in defensive try-catch blocks.</done>
</task>

<task type="auto">
  <name>Add Equipment Form Validation</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/ConfigScreen.jsx</files>
  <action>
    - Prevent workout generation if zero equipment types are selected.
    - Disable the 'Generate' button and show a subtle warning or change button style if equipment is empty.
  </action>
  <verify>Check ConfigScreen.jsx for equipment length check before onGenerate.</verify>
  <done>Generate button is disabled or blocked when no equipment is selected.</done>
</task>

<task type="auto">
  <name>Implement Schema Migration Logic</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/storage.js</files>
  <action>
    - Add a 'version' field to DEFAULT_CONFIG.
    - Create a 'migrateConfig' function in storage.js that takes raw data and applies necessary patches based on version differences.
    - Update loadConfig to use this migration function.
  </action>
  <verify>Check storage.js for migrateConfig function.</verify>
  <done>Storage utility handles versioned configuration data without loss.</done>
</task>

## Success Criteria
- [ ] Corrupted localStorage data no longer crashes the app.
- [ ] Users cannot generate workouts with zero equipment (prevents engine errors).
- [ ] Future config changes are handled via migration logic.
