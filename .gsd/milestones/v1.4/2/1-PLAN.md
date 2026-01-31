---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Timer Core & Persistence

## Objective
Enhance the workout timer with pause/resume functionality and robust state persistence to prevent loss of progress.

## Context
- .gsd/SPEC.md
- .gsd/phases/2/RESEARCH.md
- src/hooks/useTimer.js (Core logic)
- src/screens/ActiveTimer.jsx (UI controls)

## Tasks

<task type="auto">
  <name>Implement Pause/Resume in useTimer</name>
  <files>/home/tazztone/_coding/WOD-generator/src/hooks/useTimer.js</files>
  <action>
    - Add a `isPaused` state (boolean) to the hook.
    - Expose `setIsPaused` and `isPaused` to the returning object.
    - Update the `setInterval` logic to skip all time decrements and status transitions if `isPaused` is true.
    - Ensure `totalTime` and `roundTime` also stop incrementing when paused.
  </action>
  <verify>Check useTimer.js for isPaused check inside the interval.</verify>
  <done>Timer stops decrementing when isPaused is true.</done>
</task>

<task type="auto">
  <name>Add Pause/Resume UI to ActiveTimer</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/ActiveTimer.jsx</files>
  <action>
    - Add a "Pause/Resume" button to the main timer display.
    - Use the `Pause` and `Play` icons from `lucide-react`.
    - Change button text/icon based on `isPaused` state.
  </action>
  <verify>Check ActiveTimer.jsx for Pause/Play button implementation.</verify>
  <done>Users can toggle pause/resume during a workout.</done>
</task>

<task type="auto">
  <name>Implement Timer Persistence</name>
  <files>/home/tazztone/_coding/WOD-generator/src/hooks/useTimer.js</files>
  <action>
    - Define a `TIMER_STATE_KEY` for localStorage.
    - Add a `useEffect` that saves `{ status, timeLeft, totalTime, currentRound, roundTime, workoutId: workout.id }` to localStorage whenever any of these values change (except when status is 'pre' or 'finished').
    - On hook initialization, check for existing state. If the `workoutId` matches the current workout, initialize states from the saved data.
    - Clear the saved state when `status === 'finished'`.
  </action>
  <verify>Check useTimer.js for localStorage saving and loading logic.</verify>
  <done>Workout progress is saved to localStorage and restored on page refresh.</done>
</task>

## Success Criteria
- [ ] Workout can be paused and resumed without losing tracked time.
- [ ] If the app is refreshed mid-workout, it resumes exactly where it left off.
- [ ] Paused state is clearly visible in the UI.
