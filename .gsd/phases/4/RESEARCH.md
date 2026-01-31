---
phase: 4
level: 2
researched_at: 2026-01-31
---

# Phase 4 Research: Data Management & Integration

## Questions Investigated
1. **Swipe-to-delete**: How to implement swipe gestures without external libraries?
2. **Web Share API**: Native sharing support on Android.
3. **Wodify Integration**: Can we export directly to Wodify?
4. **Data Persistence**: How to structure "Saved for Later" workouts.

## Findings

### Swipe-to-delete
- We will use `touchstart` and `touchend` events to calculate the delta-X.
- If delta-X < -50px, we reveal a "Delete" button behind the item.
- Using CSS `transform: translateX()` for smooth performance.

### Web Share API
- `navigator.share()` is widely supported on modern Android.
- Fallback to standard clipboard copy if the API is unavailable.
- Sharing should include the workout text and a link to the app (if applicable).

### Wodify Integration
- **Direct Import**: Not supported via public API for end-users.
- **Wodify Marketplace**: Only for professional coaches.
- **Solution**: We will provide a "Wodify Format" text copy. Wodify performance logs accept text input for custom workouts. Our format will include clear line breaks and labels that Wodify users expect (Part A, Part B, etc.).

### Saved for Later
- A new `localStorage` key `wod_saved_v1` will store an array of workout objects.
- These workouts can be accessed from a new tab in the History/Logbook screen.

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Animation Lib | Vanilla | Keep the bundle small and avoid unnecessary dependencies for a single feature. |
| Sharing | Web Share + Clipboard | Maximum compatibility. |
| Wodify Export | Plain Text | Most reliable way to "import" into gym management software without deep API integration. |

## Next Steps
- Implement `SAVED_WORKOUTS_STORAGE_KEY` and associated hooks.
- Create a `SwipeableItem` wrapper component.
- Enhance `HistoryScreen` with tabs: "History" and "Saved".
- Implement `navigator.share` in `PreviewScreen`.
