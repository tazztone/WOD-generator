# SMART LOGIC IMPROVEMENT PLAN
**Version:** v2.0-Draft
**Date:** 2026-01-31

## 1. Problem Statement
Despite expanding the database (Core/Cardio utilization dropped from ~140 to ~105 hits/ex), the generator still exhibits:
1.  **Push Dominance**: Push/Pull ratio is 1.34 (improved from 1.52, but still biased).
2.  **Simple Scaling**: Difficulty is handled via simple multipliers rather than movement substitution.
3.  **Basic Patterning**: Selection is random-with-filter, lacking "flow".

## 2. Proposed Improvements

### A. Dynamic Pattern Balancing (The "Director")
Instead of pure random selection from the pool, implement a `PatternDirector` that tracks the "State" of the current workout.

**Logic:**
```javascript
const targetBalance = { Push: 1, Pull: 1, Squat: 1, Hinge: 1, Core: 0.5 };
const currentBalance = { Push: 0, Pull: 0, ... };

function getPriorityPatterns() {
   // return patterns where currentBalance < targetBalance
}
```

### B. Smart Substitution (Difficulty)
Implement a `substitutionMap` for scaling.

**Data Structure:**
```javascript
const SUBSTITUTIONS = {
    'hspu': { scaled: 'push_press_db', beginner: 'pushup' },
    'pullup': { scaled: 'ring_row', beginner: 'bent_row' },
    'box_jump': { scaled: 'step_ups', beginner: 'step_ups' }
};
```

**Logic:**
If `config.difficulty === 'Beginner'`, check substitutions *before* fallback to generic rep scaling.

### C. Complementary Buy-In Logic
Make the Buy-In oppose the workout focus.

**Logic:**
```javascript
if (config.focus === 'Cardio') {
    buyInPool = ['Strength', 'Core']; // Don't add more cardio
} else if (config.focus === 'Strength') {
    buyInPool = ['Cardio']; // Get heart rate up
}
```

### D. Chipper "Flow" Control
Chippers (long lists of exercises) need to alternate muscle groups to be sustainable.

**Logic:**
Enforce `Pairwise Constraint`:
`Ex[i].tags` must not overlap significantly with `Ex[i-1].tags`.
*   *Bad*: Push Press -> HSPU (Both 'shoulders', 'overhead')
*   *Good*: Push Press -> Box Jump (Shoulders -> Legs)

## 3. Implementation Phases
1.  **Phase 1 (Refactoring)**: Extract `generateWorkout` into a class or set of pure functions (`GeneratorEngine`).
2.  **Phase 2 (Balancing)**: Implement the "Director" pattern weighting to fix Push/Pull.
3.  **Phase 3 (Intelligence)**: Implement Substitutions and Flow Control.

## 4. Expected Outcomes
*   Push/Pull ratio -> 1.05
*   Chipper "Overload" warnings -> 0
*   User satisfaction -> Higher (Workouts feel "programmed" rather than "random").
