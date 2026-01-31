---
phase: 2
level: 2
researched_at: 2026-01-31
---

# Phase 2 Research: Timer & UI Refinement

## Questions Investigated
1. **Precision Pause/Resume:** How to handle the transition between `work`, `rest`, and `paused` without double-ticking or losing seconds?
2. **Timer Persistence:** How to ensure the timer survives a page refresh or app reload (common on Android if the OS kills the background process)?
3. **Audio Experience:** How to implement volume control and ensure the "3-2-1" countdown triggers reliably for all workout types?
4. **Button Loading States:** Standardizing the `Button` component to support async operations (like saving results).

## Findings

### Pause/Resume Implementation
- **Status:** Add `paused` as a valid status. When `status === 'paused'`, the `setInterval` in `useTimer.js` should skip the state updates.
- **precision:** `setInterval` is fine for 1s ticks, but we should probably refactor the `useEffect` to avoid clearing/recreating the interval on every single dependency change, as this can lead to "stretched" seconds. Use a `lastTick` ref.

### State Persistence
- **Storage:** Use `localStorage.setItem('timer_state', ...)` whenever non-paused time passes.
- **Recovery:** On hook mount, check if a saved state exists for the current workout. If the workout ID matches, resume from that state.
- **Cleanup:** Clear the state when `status === 'finished'` or when a new workout is generated.

### Audio & Volume
- **Volume:** Introduce a `volume` (0.0 to 1.0) setting in `DEFAULT_CONFIG`. Multiply the `gain` values in `audio.js` by this global setting.
- **Countdown:** The `useTimer` hook currently only triggers `SOUNDS.countdown()` for `pre`, `EMOM`, and `Tabata`. AMRAP and RFT are missing it. I need to add `if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown()` to the catch-all logic.

### Button Component
- **Async:** Add a `loading` prop to the `Button` component that replaces the icon/text with a spinner (already have Lucide's `Loader2` available or similar).

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Persistence Trigger | On every second | Keep-alive is crucial; localStorage writes are cheap enough for 1/s on modern devices. |
| Audio Implementation | Global multiplier | Fastest and most consistent way to add volume control to the existing Web Audio setup. |
| Pause Logic | Status-based | Simplest integration with the existing state machine. |

## Patterns to Follow
- Pass `paused` through the `useTimer` return object.
- Use `useEffect` in `App.jsx` or a sub-provider to sync volume from config to `audio.js`.

## Ready for Planning
- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified
