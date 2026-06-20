## Architecture & State Rules

- All files under `src/engine/` must be pure JavaScript (no React or UI package imports).
- Treat workout state objects as immutable; generate fresh copies via `swapExercise` or generator functions instead of mutating them in-place.

## Timing Engine

- Update timer state in `TimerEngine` using epoch timestamp differences (`Date.now() - lastTick`) to support background throttling and catch-up.
- Keep tick calculations side-effect free; return events from the tick function to be processed by UI handlers rather than invoking audio or native APIs directly.
