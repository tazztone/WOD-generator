# ROADMAP.md

> **Current Milestone**: v1.9
> **Goal**: Decouple workout logic and increase UI reliability.

## Must-Haves
- [ ] **Architecture**: Decouple workout templates (AMRAP, RFT, etc.) from the generator logic to allow easier expansion.
- [ ] **Testing**: Implement comprehensive Vitest/React Testing Library tests for core UI screens (Config, Preview, History).

## Phases

### Phase 1: Architecture Refactor
**Status**: ⬜ Not Started
**Objective**: Extract template-specific logic into separate strategy modules to allow easier expansion.

### Phase 2: UI Testing Infrastructure
**Status**: ⬜ Not Started
**Objective**: Set up React Testing Library and Vitest environment for component testing.

### Phase 3: Core Screen Testing
**Status**: ⬜ Not Started
**Objective**: Implement tests for `ConfigScreen` and `PreviewScreen`.

### Phase 4: Management Screen Testing
**Status**: ⬜ Not Started
**Objective**: Implement tests for `HistoryScreen` and `OneRepMaxScreen`.

### Phase 5: Verification & Audit
**Status**: ⬜ Not Started
**Objective**: Final regression sweep and documentation of the new architecture.

## Future Milestones

### v2.0 - User Systems & Cloud
**Goal**: Transform the app from a stateless tool to a personalized training companion.
- [ ] **Features**: User Profiles (Name, Skill Level, Equipment preset).
- [ ] **Features**: Cloud Sync (Save history across devices).
- [ ] **Features**: Seeded Randomness (Shareable "WOD of the Day").
- [ ] **Features**: "Hero WOD" database integration.

---

## Completed Milestones

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