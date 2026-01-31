---
phase: 5
plan: 2
wave: 1
---

# Plan 5.2: Integration Testing Suite

## Objective
Implement a robust integration test suite using Vitest to verify the core application logic, specifically the "Generate -> Swap -> Warmup" flow, ensuring system integrity.

## Context
- .gsd/SPEC.md
- src/engine/generator.js
- src/engine/integration.test.js (to be created)
- src/data/exercises.js

## Tasks

<task type="auto">
  <name>Setup Integration Test Suite</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/integration.test.js</files>
  <action>
    - Create a new test file `src/engine/integration.test.js`.
    - Implement a test case that:
        1. Mocks a user configuration (e.g., specific equipment, duration, focus).
        2. Calls `generateWorkout`.
        3. Verifies the workout structure and exercise counts.
        4. Simulates an exercise swap using `swapExercise`.
        5. Verifies that the swapped exercise maintains pattern consistency.
        6. Verifies that `generateWarmupLogic` responds correctly to the new exercise set.
  </action>
  <verify>Run `npm test` or `npx vitest run src/engine/integration.test.js`.</verify>
  <done>Core workout logic is covered by integration tests, preventing regressions in future updates.</done>
</task>

<task type="auto">
  <name>Verify Data Schema Resilience</name>
  <files>/home/tazztone/_coding/WOD-generator/src/engine/integration.test.js</files>
  <action>
    - Add test cases to verify that the generator handles missing/empty exercise pools gracefully.
    - Test the `getReps` scaling for extreme durations to ensure no NaN or undefined values are returned.
  </action>
  <verify>Run `npx vitest run src/engine/integration.test.js`.</verify>
  <done>The application logic is resilient to edge cases in data and configuration.</done>
</task>

## Success Criteria
- [ ] `src/engine/integration.test.js` exists and passes.
- [ ] Integration tests cover the full Generation -> Swap -> Warmup lifecycle.
- [ ] Extreme duration scaling is verified via tests.
