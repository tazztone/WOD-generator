# Developer Guide

This guide is for human developers working on understanding, modifying, or extending the **WOD Gen Ultimate** codebase.

---

## 🎯 1. Project Goal & Context

This is a **Client-Side Progressive Web App (PWA)** built with React, which also supports native Android builds via Capacitor.
*   **Core Value**: Generates functional fitness workouts tailored to constraints (Equipment, Injuries, Time).
*   **Key Constraint**: Must work 100% offline. No external API calls for workout generation. All logic is contained in `src/engine/`.

---

## 🏛️ 2. Architecture & File Structure

The project uses a **Features-First Modular Architecture**:

### 📂 `src/data/` (Static Configuration)
*   **`exercises.js`**: Re-exports `exercises.json` and `injuries.json`.
*   **`exercises.json`**: The exercise database. Each exercise object contains:
    *   `id`: Unique string (e.g., `dl_bb`).
    *   `pattern`: Movement pattern (`Squat`, `Hinge`, `Push`, `Pull`, `Core`, `Cardio`). Used for balancing.
    *   `equipment`: Required gear (`Barbell`, `Dumbbell`, `Bodyweight`, `Machine`, `PullupBar`).
    *   `tags`: Array of muscle or movement tags (`knees`, `impact`, `overhead`). Used for injury filtering.
    *   `intensity`: Base intensity (`Low`, `Medium`, `High`, `VeryHigh`). Used for rep scaling.
*   **`injuries.json`**: Map of injury locations to exercise tags that should be avoided.

### ⚙️ `src/engine/` (Pure Business Logic)
*Note: Files in this folder must be pure JavaScript and cannot import React or UI components.*
*   **`generator.js`**: Contains the main `WorkoutDirector` factory class.
*   **`TimerEngine.js`**: Framework-free state machine managing timers (EMOM, Tabata, AMRAP, etc.).
*   **`scaling.js`**: Translation of base exercise rep counts and distances, applying difficulty multipliers.
*   **`pipeline.js`**: Rules applied to filter and prioritize exercises during generation.
*   **`audio.js`**: Sound effects (Web Audio API oscillators) and text-to-speech coaching.

### 🧩 `src/components/` & `src/screens/` (UI Library & Views)
*   **`components/ui/`**: Atomic components (`Button`, `Card`).
*   **`screens/`**: Feature-specific views:
    *   `ConfigScreen`: Form for user settings (Duration, Equipment).
    *   `PreviewScreen`: Displays generated workout + Swap UI.
    *   `ActiveTimer`: Workout runner with timer state binding.
    *   `HistoryScreen`: List of past workouts saved in `localStorage`.

---

## 💾 3. State Management & Immutability

1.  **Global State**: Managed in `App.jsx` and wrapped inside contexts like `WorkoutContext` and `SettingsContext`.
2.  **Immutability**: The generated `workout` object is treated as immutable. To modify it (e.g., swapping an exercise), invoke `engine/generator.js#swapExercise()`, which returns a fresh, copy-on-write workout object.

---

## 🎨 4. Design & Styling (Tailwind)

*   **Theme**: Dark mode by default (`slate-950`).
*   **Color Palette**: Harmonious Emerald accent colors (`text-emerald-400`, `bg-emerald-500`).
*   **Glassmorphism**: Subtle panel overlays using `bg-slate-900/50` combined with `backdrop-blur`.
*   **Typography**: Clean sans-serif headings with bold, uppercase treatments.
*   **Animations**: Built using `tailwindcss-animate` utility classes (e.g., `animate-in`, `fade-in`).

---

## 🛠️ 5. Common Modification Patterns

### ➤ How to Add a New Exercise
1.  Open `src/data/exercises.json`.
2.  Add a new exercise object to the database array:
    ```json
    {
      "id": "pushup_strict",
      "name": "Strict Push-Up",
      "pattern": "Push",
      "equipment": "Bodyweight",
      "tags": ["shoulders", "chest"],
      "intensity": "Medium"
    }
    ```
3.  **Crucial**: Ensure `tags` are accurate to prevent injury selection leakages.

### ➤ How to Add a New Injury Filter
1.  Open `src/data/injuries.json` and map the user-facing body part to relevant exercise tags:
    ```json
    "Wrists": ["grip", "push"]
    ```
2.  Update `ConfigScreen.jsx` to render a toggle option for the new injury filter.

### ➤ How to Tweak Rep/Distance Scaling Logic
1.  Open `src/engine/scaling.js`.
2.  Modify `calculateBaseReps` or update specific difficulty scale multipliers.
3.  **Mandatory**: Run `npm test` to ensure scaling tests continue to pass.

---

## 📱 6. Mobile & Capacitor Specifics

When building for Android/iOS via Capacitor, certain hardware behaviors diverge from the standard PWA web version:

1.  **Hardware Back Button**
    *   Handled via the custom hook `src/hooks/useCapacitorBackButton.js` using `@capacitor/app`.
    *   If a modal is open, back button closes it.
    *   From `active` workout timer screen, back button prompts the exit dialog.
    *   On the root config screen, double-tapping the back button within 2 seconds exits the app.

2.  **Screen Wake Lock**
    *   Handled via `src/hooks/useWakeLock.js`.
    *   Web relies on the standard `navigator.wakeLock` API.
    *   Android uses `@capacitor-community/keep-awake` for battery-efficient awake locking.
    *   Both automatically re-acquire the lock when returning from background visibility states.

3.  **Background Timer Catch-up**
    *   Mobile operating systems freeze intervals when the app is backgrounded.
    *   `TimerEngine` tracks elapsed duration dynamically using epoch timestamp deltas (`Date.now() - lastTickTime`) rather than assuming consistent 1-second interval execution.
    *   Upon app resume, `TimerEngine.tick()` calculates the exact elapsed seconds and fast-forwards state variables without triggering a backlog of audio/haptic events.
