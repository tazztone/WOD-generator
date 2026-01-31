# ROADMAP.md

> **Current Milestone**: v1.6 (Completed)
> **Next Milestone**: v1.7 (Planned)

## Future Milestones

### v1.7 - Content Expansion & Tuning
**Goal**: Address the "Pool Saturation" and "Skill Leakage" identified in v1.6 analysis.
- [ ] **Content**: Add 15+ Core exercises (currently 100+ hits/ex).
- [ ] **Content**: Add 10+ Cardio/Bodyweight variants (currently 100+ hits/ex).
- [ ] **Logic**: Refine "Skill Leakage" (ensure moves like Box Jumps/Snatch have beginner subs).
- [ ] **Logic**: Tweaks for "Chipper" flow based on user feedback.

### v2.0 - User Systems & Cloud
**Goal**: Transform the app from a stateless tool to a personalized training companion.
- [ ] **Features**: User Profiles (Name, Skill Level, Equipment preset).
- [ ] **Features**: Cloud Sync (Save history across devices).
- [ ] **Features**: Seeded Randomness (Shareable "WOD of the Day").
- [ ] **Features**: "Hero WOD" database integration.

---

## Completed Milestones

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