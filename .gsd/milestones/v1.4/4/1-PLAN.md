---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: History Refinement & Swipe-to-delete

## Objective
Improve the history log by saving completion time and adding swipe-to-delete for individual entries.

## Context
- .gsd/SPEC.md
- src/screens/HistoryScreen.jsx
- src/screens/ActiveTimer.jsx
- src/App.jsx

## Tasks

<task type="auto">
  <name>Save Completion Time to History</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/ActiveTimer.jsx, /home/tazztone/_coding/WOD-generator/src/App.jsx</files>
  <action>
    - In `ActiveTimer.jsx`, when the workout is finished, pass the `totalTime` (or time taken) to the `onSave` callback.
    - In `App.jsx`, update the `saveToHistory` function to include the `timeTaken` in the history entry object.
  </action>
  <verify>Check saveToHistory calls and history object structure.</verify>
  <done>History entries now include the time taken to complete the workout.</done>
</task>

<task type="auto">
  <name>Implement Swipe-to-delete in History</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/HistoryScreen.jsx</files>
  <action>
    - Implement a simple touch-based swipe detection in `HistoryScreen.jsx` for individual history items.
    - Reveal a "Delete" button when swiping left.
    - Add an `onDeleteEntry` prop to `HistoryScreen` and wire it to a function in `App.jsx` that removes the entry from the state and `localStorage`.
  </action>
  <verify>Check HistoryScreen for touch events and delete button logic.</verify>
  <done>Users can delete individual history entries by swiping and clicking delete.</done>
</task>

## Success Criteria
- [ ] Workout completion time is visible in the history items.
- [ ] Individual history entries can be removed without clearing the entire log.
