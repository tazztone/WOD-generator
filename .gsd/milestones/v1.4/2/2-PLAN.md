---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Audio & UI Polish

## Objective
Implement volume controls, missing audio cues, and enhanced UI component states.

## Context
- .gsd/SPEC.md
- .gsd/phases/2/RESEARCH.md
- src/engine/audio.js (Audio Engine)
- src/components/ui/Button.jsx (UI Component)
- src/screens/ActiveTimer.jsx (Audio Cues)
- src/engine/storage.js (Storage)

## Tasks

<task type="auto">
  <name>Implement Volume Control</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/audio.js, /home/tazztone/_coding/WOD-generator/src/engine/storage.js, /home/tazztone/_coding/WOD-generator/src/screens/ConfigScreen.jsx</files>
  <action>
    - Add `volume: 0.7` to `DEFAULT_CONFIG` in `storage.js`.
    - In `audio.js`, add a module-level variable `globalVolume`.
    - Create a function `setGlobalVolume(val)` in `audio.js` to update it.
    - Multiply the gain values in `playBeep` by `globalVolume`.
    - In `ConfigScreen.jsx`, add a slider for Volume control.
    - In `App.jsx`, sync `config.volume` to `audio.js`.
  </action>
  <verify>Check ConfigScreen.jsx for Volume slider.</verify>
  <done>Audio beeps respect the user's volume setting and can be adjusted in UI.</done>
</task>

<task type="auto">
  <name>Add Final Countdown Beeps for All Workouts</name>
  <files>/home/tazztone/_coding/WOD-generator/src/hooks/useTimer.js</files>
  <action>
    - Ensure `SOUNDS.countdown()` triggers in the last 3 seconds of AMRAP and RFT workouts.
    - Centralize the countdown logic in `useTimer.js` to avoid duplication.
  </action>
  <verify>Check useTimer.js for countdown trigger in generic timer logic.</verify>
  <done>AMRAP and RFT workouts now have 3-2-1 countdown beeps.</done>
</task>

<task type="auto">
  <name>Enhance Button with Loading State</name>
  <files>/home/tazztone/_coding/WOD-generator/src/components/ui/Button.jsx</files>
  <action>
    - Add a `loading` prop to the `Button` component.
    - When `loading` is true, disable the button and show a spinner (Lucide `Loader2` animate-spin) instead of the icon/content.
    - Ensure `disabled` prop also correctly prevents `onClick`.
  </action>
  <verify>Check Button.jsx for loading spinner implementation.</verify>
  <done>Buttons support a visual loading state and correctly handle disabled status.</done>
</task>

## Success Criteria
- [ ] Users can adjust beep volume in settings (or via global config).
- [ ] All workout types have 3-2-1 countdown beeps at the end.
- [ ] Buttons show a spinner during asynchronous actions (like saving).
