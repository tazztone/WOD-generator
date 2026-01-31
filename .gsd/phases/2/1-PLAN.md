---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Logic Reset & Stale State Cleanup

## Objective
Ensure the "saved" button reset is robust across all navigation paths and remove any potential for stale workout state leakage.

## Context
- .gsd/ROADMAP.md
- src/context/WorkoutContext.jsx
- src/screens/PreviewScreen.jsx

## Tasks

<task type="auto">
  <name>Verify and Harden Reset Logic</name>
  <files>
    - src/context/WorkoutContext.jsx
  </files>
  <action>
    1. Review `generateWorkout` to ensure it always creates a fresh state.
    2. Add a `clearWorkout` action to `WorkoutContext` if needed for when users navigate back to config, ensuring no "ghost" workout remains if generation is interrupted.
  </action>
  <verify>Check that navigating back and forth doesn't show the previous workout's saved status.</verify>
  <done>
    - [ ] Navigation flows (Back -> Generate) always result in an unsaved state for new workouts.
  </done>
</task>

## Success Criteria
- [ ] New workouts consistently show "Save" (not "Saved") even if a previous workout was saved in the same session.
