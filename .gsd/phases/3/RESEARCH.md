---
phase: 3
level: 2
researched_at: 2026-01-31
---

# Phase 3 Research: Generator Expansion

## Questions Investigated
1. **Large Scale Workouts:** How does the rep scaling logic (`getReps`) behave when duration is 120m or movements are 12?
2. **New Templates:** What are the mathematical rules for `Ladder`, `Death By`, and `Buy-In/Buy-Out`?
3. **Focus Logic:** How can we ensure "Focus" selection actually produces a balanced but biased workout?
4. **Partner WODs:** What defines a "Partner" style in this context?

## Findings

### Scale & Scaling
- **Movements:** 12 movements in a single workout is a "hero WOD" level of complexity. The UI needs to handle the longer exercise list in `PreviewScreen`.
- **Duration:** 120m AMRAPs need even more conservative rep scaling to prevent burnout.
- **Reps:** `getReps` uses `isLong = duration > 25`. We should add `isExtreme = duration > 60` and cap reps even tighter.

### New Template Implementations
- **Ladder:** 
  - *Ascending*: 1, 2, 3... or 2, 4, 6... for a set time (AMRAP).
  - *Descending*: 10, 9, 8... for time (RFT).
- **Death By:**
  - Start with 1 rep. Every minute, increase by 1. Fail when you can't finish in the minute.
  - Duration is the "number of minutes survived".
- **Buy-In/Buy-Out:**
  - Prepend a "Buy-In" exercise (e.g., 50 Burpees or 1k Run).
  - Append a "Buy-Out" (e.g., 100 Situps).
  - These shouldn't be part of the main circuit.

### Focus Selection
- Already have `focusPatterns` in `generator.js`.
- Need to ensure we don't *only* pick focused items, or the workout becomes repetitive. The current "duplicate in pool" approach is good.

### Partner WODs
- **Logic:** Double the volume but allow "break as needed".
- **Formatting:** Prefix the workout name with "PARTNER" and add a note like "Split reps evenly unless specified: You go, I go."

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Ladder Type | Both Ascending/Descending | Provides variety. |
| Death By Duration | Fixed Cap | Since user selects duration, "Death By" should aim to last ~75% of that duration or until failure. |
| Movement Limit | 12 | Matches common long-form workout patterns (e.g., "12 Days of Christmas"). |

## Next Steps
- Update `generator.js` to support new templates.
- Update `ConfigScreen.jsx` UI to expose Focus and extended ranges.
- Update `PreviewScreen` to handle larger lists.
