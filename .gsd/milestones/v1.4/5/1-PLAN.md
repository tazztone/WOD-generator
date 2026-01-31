---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Translation Centralization & Smart Tooltips

## Objective
Centralize all application strings into a single localization file and add explanatory tooltips to the configuration screen to improve user understanding of advanced features.

## Context
- src/data/locales.js
- src/screens/ConfigScreen.jsx
- src/screens/ActiveTimer.jsx
- src/screens/PreviewScreen.jsx
- src/screens/HistoryScreen.jsx

## Tasks

<task type="auto">
  <name>Centralize All Translations</name>
  <files>/home/tazztone/_coding/WOD-generator/src/data/locales.js, /home/tazztone/_coding/WOD-generator/src/screens/ActiveTimer.jsx, /home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx, /home/tazztone/_coding/WOD-generator/src/screens/HistoryScreen.jsx</files>
  <action>
    - Move local `T` objects from `ActiveTimer.jsx`, `PreviewScreen.jsx`, and `HistoryScreen.jsx` into the `LOCALES` object in `src/data/locales.js`, following a nested screen structure (e.g., `screens.preview.xxx`).
    - Update all screen components to import and use the centralized `LOCALES`.
    - Ensure English and German versions are fully synchronized.
  </action>
  <verify>Check locales.js for unified structure and verify screens load text correctly via grep for LOCALES usage.</verify>
  <done>All UI strings are managed in a single file, eliminating duplication and simplifying future translations.</done>
</task>

<task type="auto">
  <name>Implement Smart Logic Tooltips</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/ConfigScreen.jsx, /home/tazztone/_coding/WOD-generator/src/data/locales.js</files>
  <action>
    - Add tooltip text for "Level", "Focus", and "Strength" logic to `locales.js`.
    - Level: Explain Rx (100% volume) vs Scaled (60%).
    - Focus: Explain how exercise selection is biased.
    - Strength: Explain smart pairing with the Metcon.
    - In `ConfigScreen.jsx`, add `HelpCircle` icons next to these labels and wire them to the `onTooltip` handler.
  </action>
  <verify>Check ConfigScreen.jsx for new HelpCircle icons and onTooltip calls.</verify>
  <done>Users can access explanations for "Smart" features directly from the configuration screen.</done>
</task>

## Success Criteria
- [ ] `locales.js` contains all app translations.
- [ ] No local `T` objects remain in screen files.
- [ ] Config screen displays tooltips for Level, Focus, and Strength.
