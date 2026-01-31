---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Core Android Fixes

## Objective
Normalize Android navigation and layout behavior to prevent accidental data loss and UI occlusion.

## Context
- .gsd/SPEC.md
- .gsd/phases/1/RESEARCH.md
- src/App.jsx (Navigation logic)
- src/screens/PreviewScreen.jsx (Timer button layout)

## Tasks

<task type="auto">
  <name>Fix Android Back Button logic</name>
  <files>/home/tazztone/_coding/WOD-generator/src/App.jsx</files>
  <action>
    Modify the back button listener in App.jsx to handle local screen state (like modals).
    - Introduce a mechanism (e.g., a simple global flag or passed-up state) so that PreviewScreen can 'lock' the back button when a modal is open.
    - If a modal is open, the back button should close the modal instead of resetting the appState to 'config'.
  </action>
  <verify>Check code for modal-aware back button logic.</verify>
  <done>Back button listener in App.jsx checks for active modals before changing appState.</done>
</task>

<task type="auto">
  <name>Fix Start Timer button safe-area</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx</files>
  <action>
    Fix the button overlap on Android devices with bottom navigation bars.
    - Update the bottom container in PreviewScreen.jsx to use safe-area-inset-bottom.
    - Add padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem) to the container.
  </action>
  <verify>Check CSS in PreviewScreen.jsx for env(safe-area-inset-bottom).</verify>
  <done>Start Timer button container respects safe area insets on mobile.</done>
</task>

## Success Criteria
- [ ] Android back button can close modals in PreviewScreen without discarding the workout.
- [ ] Start Timer button is fully visible and not obscured by Android system navigation overlay.
