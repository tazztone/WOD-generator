---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: UI Polish & Tooltips

## Objective
Transition tooltips from fullscreen-like behavior to proper floating components, add the "buy-in" tooltip, and ensure the "saved" status is reset on reroll.

## Context
- .gsd/SPEC.md
- src/components/ui/Tooltip.jsx
- src/screens/PreviewScreen.jsx
- src/data/locales.js
- src/context/WorkoutContext.jsx

## Tasks

<task type="auto">
  <name>Floating Tooltips & Buy-In Tooltip</name>
  <files>
    - src/components/ui/Tooltip.jsx
    - src/screens/PreviewScreen.jsx
    - src/data/locales.js
  </files>
  <action>
    1. Update `src/components/ui/Tooltip.jsx` to improve its "floating" behavior (ensure it doesn't cover too much and looks good on mobile).
    2. Add `buyIn` description to `src/data/locales.js` under `tt`.
    3. In `src/screens/PreviewScreen.jsx`, add a `HelpCircle` icon next to the "Buy-In" label and wire it to use `onTooltip`.
    4. Update `src/App.jsx` to pass `onTooltip={handleTooltip}` to `PreviewScreen`.
  </action>
  <verify>Check if "Buy-In" has a tooltip icon and if tooltips appear near the trigger.</verify>
  <done>
    - [ ] "Buy-In" tooltip icon exists and shows the correct text.
    - [ ] Tooltips are floating and centered above the trigger icon.
  </done>
</task>

<task type="auto">
  <name>Reset Saved Button on Reroll</name>
  <files>
    - src/context/WorkoutContext.jsx
  </files>
  <action>
    Modify `generateWorkout` in `src/context/WorkoutContext.jsx` to ensure that when a new workout is generated, it doesn't accidentally carry over any "saved" state if it happened to have the same ID (unlikely with `Date.now()`, but we should ensure the UI reflects that the NEW workout is not saved). Actually, the `isSaved` check in `App.jsx` uses `savedWorkouts.some(sw => sw.id === workout.id)`. Since `engineGenerate` (in `src/engine/generator.js`) likely creates a new ID, it should naturally reset. 
    WAIT: If the user "Rerolls" (clicks Generate again), the `workout` object is replaced. 
    The task is: "the 'saved' button should reset upon reroll of workout generation".
    If the user clicks "Generate WOD" again from the preview screen (if there is such a button) or goes back and generates again, it should be fine.
    Let's check if there is a "Reroll" button on the Preview screen.
  </action>
  <verify>Generate a workout, save it, then generate another one and check if it shows as "Save" (unsaved).</verify>
  <done>
    - [ ] New workouts always start as "unsaved" in the UI.
  </done>
</task>

## Success Criteria
- [ ] Tooltips are floating and positioned correctly.
- [ ] "Buy-In" has a descriptive tooltip.
- [ ] Generating a new workout resets the "Saved" button to "Save".
