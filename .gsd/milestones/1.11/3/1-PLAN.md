---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Granular Audio Control

## Objective
Allow users to toggle individual audio feedback types (countdowns, announcements, beeps) to customize their workout experience.

## Context
- src/engine/storage.js
- src/engine/audio.js
- src/screens/ActiveTimer.jsx
- src/hooks/useTimer.js
- src/data/locales.js

## Tasks

<task type="auto">
  <name>Update Config & Locales</name>
  <files>
    - src/engine/storage.js
    - src/data/locales.js
  </files>
  <action>
    1. Add `audioSettings: { countdowns: true, announcements: true, beeps: true }` to `DEFAULT_CONFIG` in `storage.js`.
    2. Add labels for these settings in `src/data/locales.js` (EN/DE).
  </action>
  <verify>Check if localStorage reflects the new config structure after a fresh load.</verify>
  <done>
    - [ ] Configuration schema includes granular audio flags.
    - [ ] Translation strings exist for the new settings.
  </done>
</task>

<task type="auto">
  <name>UI: Audio Settings Toggles</name>
  <files>
    - src/screens/ActiveTimer.jsx
  </files>
  <action>
    1. Update the "Audio Settings" UI (likely the volume modal/popover) in `ActiveTimer.jsx` to include toggles for Countdowns, Announcements, and Beeps.
  </action>
  <verify>Open the volume control in the timer and see if individual toggles appear.</verify>
  <done>
    - [ ] UI allows toggling individual audio feedback types.
  </done>
</task>

<task type="auto">
  <name>Engine: Respect Audio Flags</name>
  <files>
    - src/engine/audio.js
    - src/hooks/useTimer.js
  </files>
  <action>
    1. Update `audio.js` to accept or check specific flags before playing sounds.
    2. Modify `useTimer.js` or the call sites in `ActiveTimer.jsx` to pass the correct flags from `config.audioSettings`.
  </action>
  <verify>Turn off "Countdowns" and verify beeps still play but voice counts don't (or vice versa).</verify>
  <done>
    - [ ] Audio engine correctly filters sounds based on user settings.
  </done>
</task>

## Success Criteria
- [ ] Users can disable countdowns while keeping transition beeps.
- [ ] Users can disable voice announcements.
- [ ] Settings persist across sessions.
