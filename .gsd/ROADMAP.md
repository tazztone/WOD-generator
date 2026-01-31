# ROADMAP.md

> **Current Milestone**: v1.6
> **Goal**: Upgrade the generation engine with "Smart Logic" (Balancing, Flow Control, Substitutions).

## Must-Haves
- [ ] Refactor: Extract generation logic into modular functions/classes
- [ ] Logic: "Director" pattern for Push/Pull balancing
- [ ] Logic: Smart Substitutions (Difficulty scaling via replacement)
- [ ] Logic: Chipper Flow Control (Muscle group non-overlap)

## Phases

### Phase 1: Engine Refactoring
**Status**: 🏃 In Progress
**Objective**: restructure `generator.js` to allow stateful tracking during workout generation.

### Phase 2: Balancing & Substitutions
**Status**: ⬜ Not Started
**Objective**: Implement the "Director" and Substitution logic.

### Phase 3: Flow Control
**Status**: ⬜ Not Started
**Objective**: Ensure Chippers and long workouts flow smoothly without local fatigue.

---

## Completed Milestones

### v1.5 - UI/UX & Reliability
- [x] UI: Focus selector as dropdown in 3rd column
- [x] UI: Move volume control to timer page (combine with mute)
- [x] Reliability: React Error Boundary
- [x] Accessibility: Basic ARIA attributes
- [x] Testing: Mass generation and analysis script
