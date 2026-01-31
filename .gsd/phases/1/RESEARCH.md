---
phase: 1
level: 2
researched_at: 2026-01-31
---

# Phase 1 Research: Core Reliability & Android Fixes

## Questions Investigated
1. **How to prevent Android hardware back button from discarding workouts during modal interactions?**
   Currently, the global listener in `App.jsx` only looks at `appState`. If a user is in `PreviewScreen` and has the "Swap Exercise" modal open, pressing Back triggers `setAppState('config')`, which loses the current workout and its customizations.
2. **Why is the "Start Timer" button obscured on Android?**
   The button in `PreviewScreen.jsx` is positioned with `absolute bottom-0`. Android devices with software navigation bars (or gesture navigation) overlap this area if safe-area-insets are not respected.
3. **How to implement robust schema migration for localStorage?**
   The app uses `localStorage` for both config and history. Adding a `version` field to `DEFAULT_CONFIG` will allow for incremental migrations.

## Findings

### Android Back Button Strategy
The current listener in `App.jsx` is too coarse. 
**Recommendation:** Implement a simple "Back Handler" registry or pass a `hasOpenModal` flag up to `App.jsx`. Alternatively, use Capacitor's event bubbling by not stopping propagation in the sub-component, but `App.jsx` currently intercepts it globally.
*   **Decision:** Add a `onBackOverride` prop to the main screens if necessary, or check the state of the active screen before deciding the next `appState`.

### Safe Area Insets (CSS)
The "Start Timer" button is in an absolute container.
**Recommendation:** 
- Add `pb-[calc(env(safe-area-inset-bottom)+20px)]` to the bottom container in `PreviewScreen.jsx`.
- Ensure `viewport-fit=cover` is in `index.html`.

### Icon Visibility
The "Change" exercise icon (`RefreshCw`) uses `text-slate-700` which has poor contrast on `slate-900`.
**Recommendation:** Change to `text-slate-500` and `group-hover:text-emerald-400`.

### Data Safety & Migration
**Recommendation:**
- Implement `src/engine/storage.js` `migrate(config)` function.
- Version 1: Initial (Current)
- Version 2: Multi-equipment support (Next)
- Wrap all `JSON.parse` calls in `try...catch`.

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Back Button Fix | Local state check in App.jsx | Fast to implement, low risk of breaking browser history. |
| UI Overlay | Safe Area CSS | Standard way to handle notch/nav-bar overlaps in Capacitor. |
| Validation | Block generation | Prevent "empty" workout generations if no equipment selected. |

## Patterns to Follow
- Use `try/catch` for all storage operations.
- Use `env(safe-area-inset-...)` for mobile-specific layouts.

## Dependencies Identified
| Package | Version | Purpose |
|---------|---------|---------|
| @capacitor/app | ^7.0.0 | Native back button events |
| @capacitor/toast | ^7.0.0 | User feedback for exit |

## Risks
- **Storage Corruption:** If migration logic fails, user might lose history. *Mitigation: Always keep a backup of the raw data before attempting migration.*

## Ready for Planning
- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified
