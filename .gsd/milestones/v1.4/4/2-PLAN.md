---
phase: 4
plan: 2
wave: 1
---

# Plan 4.2: Saved Workouts & Wodify Formatting

## Objective
Enable users to save generated workouts for later and refine the sharing text for gym management software (Wodify).

## Context
- .gsd/SPEC.md
- src/engine/storage.js
- src/screens/PreviewScreen.jsx
- src/screens/HistoryScreen.jsx

## Tasks

<task type="auto">
  <name>Implement Saved Workouts Storage</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/storage.js, /home/tazztone/_coding/WOD-generator/src/App.jsx</files>
  <action>
    - Add `SAVED_WORKOUTS_STORAGE_KEY` to `storage.js`.
    - In `App.jsx`, manage a `savedWorkouts` state and persist it to `localStorage`.
    - Add a `toggleSaveWorkout` function to `App.jsx`.
  </action>
  <verify>Check storage.js for new key and App.jsx for savedWorkouts state management.</verify>
  <done>Infrastructure for saving workouts to persistent storage is in place.</done>
</task>

<task type="auto">
  <name>Add "Save for Later" UI</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx, /home/tazztone/_coding/WOD-generator/src/screens/HistoryScreen.jsx</files>
  <action>
    - Add a "Star" or "Bookmark" button to `PreviewScreen.jsx` to save the current workout.
    - Update `HistoryScreen.jsx` to include a tabbed interface (e.g., "History" vs "Saved") or a separate section for saved workouts.
    - Allow users to "Start" a saved workout from the History screen.
  </action>
  <verify>Check PreviewScreen and HistoryScreen for save toggle and saved list display.</verify>
  <done>Users can save workouts from the preview and access them later from the history screen.</done>
</task>

<task type="auto">
  <name>Refine Wodify-Friendly Share Text</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx</files>
  <action>
    - Update the text generation logic in `copyToClipboard` to use clear section headers (PART A, PART B) and double spacing.
    - Ensure exercises are listed with clear reps and names, formatted to look "pro" when pasted into Wodify or similar apps.
  </action>
  <verify>Check the string template in copyToClipboard.</verify>
  <done>Sharing text is professionally formatted for external apps.</done>
</task>

## Success Criteria
- [ ] "Save" button works in Preview screen.
- [ ] Saved workouts list is accessible and persistent.
- [ ] Clipboard text is well-formatted for Wodify.
