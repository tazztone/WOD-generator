---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: UI Expansion & Settings

## Objective
Update the configuration UI to support extended ranges, new focuses, and the partner mode toggle.

## Context
- .gsd/SPEC.md
- src/screens/ConfigScreen.jsx (UI)
- src/data/locales.js (Translations)
- src/engine/storage.js (Data schema)

## Tasks

<task type="auto">
  <name>Expand ConfigScreen UI</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/ConfigScreen.jsx</files>
  <action>
    - Update Duration slider: max 60 -> 120.
    - Update Movements slider: max 6 -> 12.
    - Add a "Workout Focus" selector (Cardio, Strength, Gymnastics, Core, Balanced).
    - Add a "Partner Mode" toggle switch (similar to the Strength toggle).
    - Ensure `setConfig` handles all new fields.
  </action>
  <verify>Check ConfigScreen.jsx for updated slider ranges and new inputs.</verify>
  <done>UI supports all Phase 3 engine features.</done>
</task>

<task type="auto">
  <name>Update Data Schema and Translations</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/storage.js, /home/tazztone/_coding/WOD-generator/src/data/locales.js</files>
  <action>
    - Update `DEFAULT_CONFIG` in `storage.js` to include `isPartner: false`.
    - Update `locales.js` with new strings for "Focus", "Partner Mode", "Ladder", "Death By", etc., in both English and German.
  </action>
  <verify>Check storage.js and locales.js for new keys.</verify>
  <done>Localization and storage schema updated for new features.</done>
</task>

<task type="auto">
  <name>Final Preview Polishing</name>
  <files>/home/tazztone/_coding/WOD-generator/src/screens/PreviewScreen.jsx</files>
  <action>
    - Ensure `PreviewScreen` displays "PARTNER" prefix if `config.isPartner` is true.
    - Ensure Buy-In and Buy-Out (if present in workout object) are displayed as separate sections above/below Part B.
    - Verify that 12 exercises still look good in the scrollable view.
  </action>
  <verify>Check PreviewScreen.jsx for Partner and Buy-In layout logic.</verify>
  <done>Workouts with 12 movements or partner settings display correctly.</done>
</task>

## Success Criteria
- [ ] Users can select up to 120 minutes and 12 movements.
- [ ] "Partner Mode" can be toggled in settings.
- [ ] "Focus" can be selected (Cardio, Strength, etc.).
- [ ] New UI elements are localized in English and German.
