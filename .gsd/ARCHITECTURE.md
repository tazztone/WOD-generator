# Architecture

> Updated 2026-02-03 (v1.11 Complete)

## Overview

The WOD Generator is a mobile-first web application (targeting Android via Capacitor) designed to generate CrossFit-style "Workout of the Day" routines. It features dynamic scaling based on user difficulty, equipment availability, and injury-avoidance settings.

```
┌─────────────────────────────────────────┐
│               App.jsx                   │
│          (Root & Navigation)            │
├─────────────────────────────────────────┤
│             Context Layer               │
│ (AppContext, WorkoutContext, Settings)  │
├─────────────────────────────────────────┤
│            Screens Layer                │
│ (Config, Preview, ActiveTimer, History) │
├─────────────────────────────────────────┤
│             Engine Layer                │
│   (Pipeline, Strategies, Calculator)    │
├─────────────────────────────────────────┤
│              Data Layer                 │
│      (Exercise DB, Locales)             │
└─────────────────────────────────────────┘
```

## Components

### Shell & Header
- **Purpose:** Provide consistent layout and global navigation.
- **Location:** `src/components/layout/`
- **Dependencies:** React, Lucide-React.

### Context Layer
- **WorkoutContext:** Manages generated workout state, active timer status, and history.
- **SettingsContext:** Manages user preferences, equipment availability, and injury filters.
- **AppContext:** Global UI state (modals, toasts).

### Generator Engine (Pipeline Pattern)
- **Purpose:** Core logic for creating workouts.
- **Location:** `src/engine/`
- **Structure:**
    - `pipeline.js`: Orchestrates the generation process.
    - `strategies/`: specific generation logic (e.g., `AmrapStrategy`, `EmomStrategy`).
    - `generator.js`: Facade for the pipeline.
- **Dependencies:** `src/data/exercises.js`.

### Active Timer
- **Purpose:** Interactive workout execution with countdowns and UI feedback.
- **Location:** `src/screens/ActiveTimer.jsx`
- **Dependencies:** `src/hooks/useTimer.js`, `src/hooks/useWakeLock.js`.

### Storage Utility
- **Purpose:** Abstraction over localStorage for persistent config and history.
- **Location:** `src/engine/storage.js`

## Data Flow

1. **Configuration:** `ConfigScreen` updates `SettingsContext` → auto-persists to `storage.js`.
2. **Generation:** `PreviewScreen` triggers `WorkoutContext.generate()` → `pipeline.js` executes strategies → updates `WorkoutContext`.
3. **Execution:** `ActiveTimer` consumes `WorkoutContext` → tracks progress → `saveHistory()` updates state and localStorage.
4. **Android Native:** `App.addListener('backButton')` intercepts hardware back press to navigate internal routing.

## Integration Points

| Service | Type | Purpose |
|---------|------|---------|
| @capacitor/app | Native API | Hardware back button handling |
| @capacitor/toast | Native API | Low-level system notifications |
| @capacitor-community/keep-awake | Native API | Prevents screen timeout during workouts |

## Technical Debt

- [ ] **Error Handling:** Missing React Error Boundaries for critical UI crashes.
- [ ] **Seeded Randomness:** Generator relies on `Math.random()`; needs seed support for shareability (v2.0 goal).
- [ ] **Data Persistence:** LocalStorage is the only persistence layer; no cloud sync.

## Conventions

**Naming:** PascalCase for React components, camelCase for functions and utilities.
**Structure:** Feature-based directory organization (`screens`, `engine`, `hooks`, `context`).
**Styling:** Utility-first CSS using Tailwind.