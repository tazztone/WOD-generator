---
phase: 1-2
plan: 1.10
wave: 1-3
gap_closure: false
---

# Plan 1.10: Architectural Refinement & Audio Polish

## Objective
Finalize architectural cleanup and technical debt reduction. This plan delivers a de-bloated state management system, a more extensible workout generation engine, and a polished user experience with better audio and UI layout.

## Context
Load these files for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/context/AppContext.jsx
- src/engine/generator.js
- src/engine/audio.js

## Tasks

<task type="auto">
  <name>Externalize Hardcoded Constants</name>
  <files>
    src/config/workoutConfig.js
    src/engine/generator.js
    src/engine/scaling.js
  </files>
  <action>
    Extract hardcoded constants (clash tags, focus patterns, balancing weights) into a centralized config file.
    
    Steps:
    1. Create `src/config/workoutConfig.js`.
    2. Move `clashTags`, `focusPatterns`, and other magic numbers from `generator.js` and `scaling.js`.
    3. Update imports in affected files.
    
    AVOID: Keeping any magic strings/numbers in the core logic.
    USE: A structured object/exported constants in `src/config/workoutConfig.js`.
  </action>
  <verify>
    Check if `generator.js` imports from `../config/workoutConfig.js` and no local constants remain for balancing.
  </verify>
  <done>
    Constants externalized and imports verified.
  </done>
</task>

<task type="auto">
  <name>Refactor WorkoutDirector to Declarative Pipeline</name>
  <files>
    src/engine/generator.js
    src/engine/pipeline.js
  </files>
  <action>
    Refactor the `getWeightedPool` method into a pipeline of rule functions.
    
    Steps:
    1. Define a `Rule` interface/type: `(pool, director) => pool`.
    2. Extract `skillFilter`, `overlapFilter`, `balanceWeight`, `focusWeight` into a new file `src/engine/pipeline.js` or keep inside `generator.js` as standalone functions.
    3. Update `WorkoutDirector.getWeightedPool` to iterate over an array of these rules.
    
    AVOID: Giant switch/if-else blocks in `getWeightedPool`.
    USE: `rules.reduce((pool, rule) => rule(pool, this), initialPool)`.
  </action>
  <verify>
    Run existing tests to ensure workout generation still produces valid workouts.
    npm test
  </verify>
  <done>
    WorkoutDirector uses a rule-based pipeline for exercise selection.
  </done>
</task>

<task type="auto">
  <name>De-bloat AppContext (Split into Domain Slices)</name>
  <files>
    src/context/AppContext.jsx
    src/context/SettingsContext.jsx
    src/context/WorkoutContext.jsx
    src/App.jsx
  </files>
  <action>
    Split the monolithic `AppContext` into focused contexts.
    
    Steps:
    1. Create `SettingsContext.jsx` for `lang`, `config`, `tooltip`, `modalOpen`.
    2. Create `WorkoutContext.jsx` for `workout`, `history`, `savedWorkouts`, `appState`.
    3. Update `App.jsx` to wrap components in multiple providers.
    4. Refactor `useAppContext` or create `useSettings` and `useWorkout`.
    
    AVOID: Prop drilling or circular dependencies between contexts.
    USE: Composition of providers in `main.jsx` or `App.jsx`.
  </action>
  <verify>
    Verify app boots and navigation/generation still works.
  </verify>
  <done>
    AppContext is split and state management is more modular.
  </done>
</task>

<task type="auto">
  <name>Add Context Integration Tests</name>
  <files>
    src/test/Context.test.jsx
  </files>
  <action>
    Add integration tests to verify the interactions between the new contexts and the UI.
    
    Steps:
    1. Use React Testing Library to render a test component wrapped in the new providers.
    2. Verify that updating settings affects workout generation or UI display.
  </action>
  <verify>
    npm test src/test/Context.test.jsx
  </verify>
  <done>
    Tests pass with >80% coverage on context logic.
  </done>
</task>

<task type="auto">
  <name>UI/UX Polish: Header and Audio</name>
  <files>
    src/App.jsx
    src/engine/audio.js
    src/screens/TimerScreen.jsx
  </files>
  <action>
    Address UI layout issues and improve audio feedback.
    
    Steps:
    1. Adjust CSS/Layout in `App.jsx` or relevant layout components to fix the "empty space" at the top.
    2. Update `src/engine/audio.js` with better beep samples or timing logic.
    3. (Optional) Integrate voice samples for "3, 2, 1, GO".
    
    AVOID: Breaking existing responsiveness on different screen sizes.
  </action>
  <verify>
    Visual inspection (if possible) and audio check on device/simulator.
  </verify>
  <done>
    Header layout is tight and audio beeps are crisp and timely.
  </done>
</task>

## Must-Haves
After all tasks complete, verify:
- [ ] No regressions in workout generation quality.
- [ ] App state persists correctly across reloads (localStorage).
- [ ] Audio triggers at the correct intervals during countdown and workout.
- [ ] Code is significantly more modular and readable.

## Success Criteria
- [ ] All tasks verified passing
- [ ] Must-haves confirmed
- [ ] No regressions in existing 35 tests
