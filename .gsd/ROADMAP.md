# ROADMAP.md

> **Current Milestone**: v1.8
> **Goal**: Improve code maintainability, data management, and user experience for updates.

## Must-Haves
- [ ] **Data**: Migrate `exercises.js` to `src/data/exercises.json`.
- [ ] **Architecture**: Refactor `App.jsx` state to use React Context API (`AppContext`).
- [ ] **UX**: Replace default PWA update prompt with a custom UI notification.

## Phases

### Phase 1: Data Migration
**Status**: ⬜ Not Started
**Objective**: Convert the hardcoded exercise database into a JSON file and update the import logic.

### Phase 2: State Management Refactor
**Status**: ⬜ Not Started
**Objective**: Extract global state from `App.jsx` into a React Context provider.

### Phase 3: PWA Update UI
**Status**: ⬜ Not Started
**Objective**: Implement a user-friendly "New Update Available" toast/banner.

### Phase 4: Regression Testing
**Status**: ⬜ Not Started
**Objective**: Verify all application features (generation, timer, settings) function correctly after refactoring.

## Future Milestones

### v2.0 - User Systems & Cloud
**Goal**: Transform the app from a stateless tool to a personalized training companion.
- [ ] **Features**: User Profiles (Name, Skill Level, Equipment preset).
- [ ] **Features**: Cloud Sync (Save history across devices).
- [ ] **Features**: Seeded Randomness (Shareable "WOD of the Day").
- [ ] **Features**: "Hero WOD" database integration.

---

## Completed Milestones

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