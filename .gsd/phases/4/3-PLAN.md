---
phase: 4
plan: 3
wave: 2
---

# Plan 4.3: Web Share API Integration

## Objective
Implement native sharing capabilities using the Web Share API.

## Context
- .gsd/SPEC.md
- src/screens/PreviewScreen.jsx

## Tasks

<task type="auto">
  <name>Implement Web Share API</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx</files>
  <action>
    - Check for `navigator.share` availability.
    - If available, use it in the `Share` button to trigger the native sharing dialog.
    - Title should be "Workout of the Day", Text should be the workout definition.
    - Fallback to clipboard if the API is not supported.
  </action>
  <verify>Check for navigator.share logic in PreviewScreen.</verify>
  <done>Native share dialog appears on supported devices.</done>
</task>

## Success Criteria
- [ ] Share button triggers native dialog on mobile devices.
- [ ] Fallback still works on Desktop.
