# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Enhance the WOD Generator's usability, reliability, and maintainability. This milestone focuses on UI refinements to maximize screen real estate, adding critical error recovery mechanisms, ensuring basic accessibility, and creating a data-driven testing infrastructure.

## Goals
1. **UI/UX Optimization**: Consolidate controls (Focus selector, Volume) to improve layout efficiency.
2. **Reliability**: Implement error boundaries to prevent white-screen crashes.
3. **Accessibility**: Add ARIA labels to ensure basic screen reader support.
4. **Testing Infrastructure**: Create a system to mass-generate workouts for statistical analysis and bug detection.

## Success Criteria
- [ ] **UI**: "Focus" selector rendered as a dropdown in the 3rd column of the generator.
- [ ] **UI**: Volume slider moved to the Timer page; global volume logic updated.
- [ ] **Reliability**: `ErrorBoundary` component wraps the main app; crash UI shown on error.
- [ ] **Accessibility**: Interactive elements (buttons, inputs) have `aria-label` or equivalent.
- [ ] **Testing**: A script (e.g., `scripts/analyze-distribution.js`) exists that generates >1000 workouts and outputs JSON stats.