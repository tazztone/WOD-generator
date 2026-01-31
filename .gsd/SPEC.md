# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Finalize architectural cleanup and technical debt reduction before moving into v2.0 feature development. This milestone focuses on de-bloating the global state, refactoring the generation engine for better extensibility, and polishing the user experience with improved UI layout and high-quality audio feedback.

## Goals
1. **Architectural Decoupling**: Split `AppContext` into smaller, focused contexts (e.g., Settings, WorkoutState) to reduce unnecessary re-renders.
2. **Engine Refactoring**: Transition `WorkoutDirector` to a declarative pipeline to make adding new balancing rules easier.
3. **Configuration**: Externalize all hardcoded workout constants and template metadata into structured config files.
4. **UX Polish**: Optimize the header layout for Android/Mobile to eliminate dead space and improve "vibe".
5. **Audio Experience**: Upgrade the timer audio system with better beep timing, high-quality sounds, and voice announcements.

## Success Criteria
- [ ] **Context**: `AppContext.jsx` is refactored into at least two sub-contexts or use hooks for state slices.
- [ ] **Engine**: `WorkoutDirector` uses a sequence of filter/weight functions instead of nested imperative logic.
- [ ] **Config**: A new `src/config/constants.js` or `src/data/config.json` exists containing engine parameters.
- [ ] **UI**: The top margin/padding on the main screen is reduced to better fit mobile status bars.
- [ ] **Audio**: Audio beeps trigger precisely at 3-2-1-GO; voice samples for "Next exercise" or "Rest" are functional.
- [ ] **Verification**: All existing tests pass, and new integration tests cover the refactored AppContext.
