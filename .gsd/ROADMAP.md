# ROADMAP.md

> **Current Milestone**: None (Planning v2.0)
> **Goal**: -

## Must-Haves
- [ ] (Pending Planning)

## Phases
(Pending Planning)

## Future Milestones

### v2.0 - User Systems & Cloud
**Goal**: Transform the app from a stateless tool to a personalized training companion.
- [ ] **Features**: User Profiles (Name, Skill Level, Equipment preset).
- [ ] **Features**: Cloud Sync (Save history across devices).
- [ ] **Features**: Seeded Randomness (Shareable "WOD of the Day").
- [ ] **Features**: "Hero WOD" database integration.

---

## Completed Milestones

### v1.9 - Testing & Extensibility (Tech Debt)
**Status**: ✅ Completed
- [x] **Architecture**: Decouple workout templates (AMRAP, RFT, etc.) from the generator logic.
- [x] **Testing**: Implement comprehensive Vitest/React Testing Library tests for core UI screens.

### v1.8 - Refactoring & DX
**Status**: ✅ Completed
- [x] **Data**: Migrate `exercises.js` to `src/data/exercises.json`.
- [x] **Architecture**: Refactor `App.jsx` state to use React Context API (`AppContext`).
- [x] **UX**: Replace default PWA update prompt with a custom UI notification.

### v1.7 - Content Expansion & Tuning
**Status**: ✅ Completed
- [x] **Content**: Add 15+ Core exercises.
- [x] **Content**: Add 10+ Cardio/Bodyweight variants.
- [x] **Logic**: Refine "Skill Leakage" (Beginner subs).
- [x] **Logic**: Tweaks for "Chipper" flow.


### v1.6 - Smart Engine Upgrade
**Status**: ✅ Completed
- [x] **Refactor**: Modularized generation engine.
- [x] **Logic**: Implemented `WorkoutDirector` for stateful balancing.
- [x] **Balance**: Achieved 0.95 Push/Pull ratio (perfect balance).
- [x] **Smart Subs**: Added automatic scaling for advanced movements (HSPU, BMU, etc.).
- [x] **Verification**: Validated with 10k workout simulations.

### v1.5 - UI/UX & Reliability
**Status**: ✅ Completed
- [x] UI: Focus selector as dropdown in 3rd column
- [x] UI: Move volume control to timer page (combine with mute)
- [x] Reliability: React Error Boundary
- [x] Accessibility: Basic ARIA attributes
- [x] Testing: Mass generation and analysis script