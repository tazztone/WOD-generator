---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Generator Engine Expansion

## Objective
Expand the generator engine to support new templates (Ladder, Death By, Buy-In/Buy-Out), extreme durations, and partner modes.

## Context
- .gsd/SPEC.md
- .gsd/phases/3/RESEARCH.md
- src/engine/generator.js (Logic)

## Tasks

<task type="auto">
  <name>Implement Scaling for Extreme Durations</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/generator.js</files>
  <action>
    - Update `getReps` to handle durations up to 120m.
    - Introduce `isExtraLong = duration > 45` and `isExtreme = duration > 80`.
    - Apply additional rep reductions for these thresholds to maintain intensity.
    - Ensure `Machine` cal and `Run` distances scale appropriately for ultra-long sessions.
  </action>
  <verify>Check getReps function in generator.js for new thresholds.</verify>
  <done>Reps scale conservatively for durations up to 120 min.</done>
</task>

<task type="auto">
  <name>Implement New Generator Templates</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/generator.js</files>
  <action>
    - Add `Ladder` (Ascending/Descending), `Death By`, and `Buy-In/Buy-Out` logic to `generateWorkout`.
    - For `Ladder`: Reps in `selectedExercises` should be a range or a string (e.g., "1-2-3-4...").
    - For `Death By`: Set a fixed EMOM-style structure that increments reps.
    - For `Buy-In/Buy-Out`: Add specific start/end exercises that are not part of the main circuit loop.
    - Support `isPartner` flag: If true, double the total rep volume or rounds.
  </action>
  <verify>Check generateWorkout for new template cases.</verify>
  <done>Workout generator supports 5+ new template variants.</done>
</task>

<task type="auto">
  <name>Implement Focus Selection Logic</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/generator.js</files>
  <action>
    - Refine the `focus` logic (lines 106-116).
    - Ensure it correctly biases the `availableExercises` pool for 'Core', 'Cardio', and 'Strength' focuses.
    - Ensure 'Balanced' focus remains the default behavior.
  </action>
  <verify>Check generator.js for focus-based exercise filtering.</verify>
  <done>Generated workouts reflect the selected focus bias.</done>
</task>

## Success Criteria
- [ ] Generator handles 120min duration without crashing.
- [ ] "Ladder" and "Death By" templates display correctly and have valid rep schemes.
- [ ] Workout object includes buy-in/buy-out fields when applicable.
