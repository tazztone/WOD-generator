# ROADMAP.md

> **Current Milestone**: v1.3 - Feature Completion & Polish
> **Goal**: Complete all remaining pending items to reach full feature parity and stability.

## Must-Haves
- [x] Fix Android navigation and layout issues (Back button, Timer button position)
- [ ] Enhance Timer logic (Pause/Resume, Persistence, Beeps, Volume control)
- [ ] Expand Workout Generator (New templates, double limits, workout focus selection)
- [x] Improve Data Safety (Schema migration, JSON parsing error handling, form validation)
- [ ] UX/UI Polish (Icon visibility, Swipe-to-delete, Button loading states)
- [ ] Sharing & Integration (Enhanced clipboard, Web Share API, Wodify research)
- [ ] Technical Debt (Merge translations, add integration tests)

## Phases

### Phase 1: Core Reliability & Android Fixes
**Status**: ✅ Complete
**Objective**: Resolve critical Android-specific issues and implement foundational data safety.
- [x] Fix Android BACK button logic
- [x] Fix "Start Timer" button position
- [x] Add try-catch for JSON.parse in App.jsx
- [x] Add form validation for equipment selection
- [x] Add schema version migration logic

### Phase 2: Timer & UI Refinement
**Status**: ⬜ Not Started
**Objective**: Complete the timer feature set and polish visual elements.
- Add pause/resume functionality to timer
- Persist timer state to localStorage
- Add countdown beeps (3-2-1)
- Add volume control setting
- Improve visibility of "change" exercise icon
- Add loading/spinner state to Button component

### Phase 3: Generator Expansion
**Status**: ⬜ Not Started
**Objective**: Significantly increase the variety and scale of generated workouts.
- Double max duration and movements (120min / 12 movements)
- Add workout focus selection (Core, Cardio, Strength)
- Expand workout templates (Ladder, Death By, Buy-In/Buy-Out)
- Add "Partner" workout style

### Phase 4: Data Management & Integration
**Status**: ⬜ Not Started
**Objective**: Enhance history, saving capabilities, and external integrations.
- Add feature to save workouts for later
- Save time taken to complete workout in historical log
- Add swipe-to-delete for history entries
- Update "share" (clipboard) and implement Web Share API
- Research Wodify export integration

### Phase 5: Documentation & Testing
**Status**: ⬜ Not Started
**Objective**: Finalize non-functional requirements and verify system integrity.
- Add detailed tooltips for smart algorithms
- Merge screen-specific translations into main locales.js
- Add integration tests for full workout generation + swap flow
- Final end-to-end verification
