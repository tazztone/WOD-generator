---
phase: 5
level: 2
researched_at: 2026-01-31
---

# Phase 5 Research: Documentation & Testing

## Questions Investigated
1. **Tooltip Implementation**: How to best explain the "Smart" logic without cluttering the UI?
2. **Translation Strategy**: How to centralize `T` objects from screen files into `locales.js`?
3. **Vitest Integration Tests**: How to simulate a user session (Select -> Generate -> Swap) in a unit test environment?
4. **Final Verification**: What is the definitive checklist for "Feature Complete"?

## Findings

### Smart Analytics Tooltips
- **Targets**: 
  - **Level**: Explain Rx (100% volume) vs Scaled (60% volume + simplified moves).
  - **Focus**: Explain how the pool is biased towards specific patterns.
  - **Strength**: Explain the "Smart Pairing" (e.g. Squat metcon -> Hinge strength).
- **Implementation**: use existing `onTooltip` handler and `HelpCircle` icon from `lucide-react`.

### Translation Centralization
- **Current State**: `ActiveTimer`, `HistoryScreen`, and `PreviewScreen` have local `const T`.
- **Recommendation**: Move these into `LOCALES` in `src/data/locales.js`. Access them via `t.screens.activeTimer.xxx` or similar nesting. This prevents duplication (e.g. `back` translates identically in multiple screens).

### Integration Testing (Vitest)
- We already have `generator.test.js`.
- **Extension**: Create `src/engine/integration.test.js` that:
  1. Creates a mocked `config`.
  2. Runs `generateWorkout`.
  3. Takes the result and runs `swapExercise` on the first slot.
  4. Verifies that the new workout has the correct new exercise and that the `warmup` logic re-ran.
- **Tools**: Use `vi.fn()` if needed for mocking `Date.now()`.

### E2E Checklist
1. App launches and loads previous config correctly.
2. Workout generation respects ALL equipment filters.
3. Swapping exercise shows valid patterns only.
4. Timer can pause/resume and persists through app backgrounding.
5. Workout saves to history with correct score and timestamp.
6. Android Back button behaves as expected (closes modals -> goes back -> double tap exit).

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Localization | Centralized in `locales.js` | Maintainability and consistency. |
| Tooltips | `HelpCircle` + Tooltip system | Minimal UI impact while providing deep context. |
| Testing Level | Integration (Logic Layer) | Most bang-for-buck for a solo developer project. E2E (Playwright/Appium) is overkill for this scope. |

## Next Steps
- Implement centralized translations.
- Add tooltips to `ConfigScreen`.
- Create the integration test suite.
- Run final E2E verification.
