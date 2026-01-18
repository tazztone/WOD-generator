# AI Agent Documentation (`AGENTS.md`)

Welcome, Agent. This document is your primary source of truth for understanding, modifying, and extending the **WOD Gen Ultimate** codebase.

## 🎯 1. Project Goal & Context
This is a **Client-Side Progressive Web App (PWA)** built with React.
*   **Core Value**: Generates functional fitness workouts tailored to constraints (Equipment, Injuries, Time).
*   **Key Constraint**: Must work 100% offline. No external API calls for workout generation. All logic is contained in `src/engine/`.
*   **Target Audience**: CrossFit athletes, Garage Gym owners.

---

## 🏛️ 2. Architecture & File Structure

The project was recently refactored (Jan '26) from a Monolith to a **Features-First Modular Architecture**.

### 📂 `src/data/` (Static Configuration)
*   **`exercises.js`**: The heart of the app.
*   **`EXERCISE_DB`**: Array of objects. Each exercise object MUST have:
    *   `id`: Unique string (e.g., `dl_bb`).
    *   `pattern`: Movement pattern (`Squat`, `Hinge`, `Push`, `Pull`, `Core`, `Cardio`). Used for balancing.
    *   `equipment`: (`Barbell`, `Dumbbell`, `Bodyweight`, `Machine`, `PullupBar`).
    *   `tags`: Array of strings (`knees`, `impact`, `overhead`). Used for injury filtering.
    *   `intensity`: (`Low`, `Medium`, `High`, `VeryHigh`). Used for rep scaling.

### ⚙️ `src/engine/` (Pure Business Logic)
**Rule**: These files must be pure JavaScript. NO React imports.
*   **`generator.js`**:
    *   `generateWorkout(config)`: The main factory function. Randomly selects exercises based on filters and patterns.
    *   `getReps(...)`: Heuristic function to determine rep counts based on exercise intensity and workout duration.
    *   `swapExercise(...)`: Returns a *new* workout object with one exercise replaced. Immutability is key.
*   **`audio.js`**:
    *   Uses `window.AudioContext` for beeps (Oscillators) to avoid loading mp3 assets.
    *   Uses `window.speechSynthesis` for voice announcements.

### 🧩 `src/components/` (UI Library)
*   **`ui/`**: Atomic components (`Button`, `Card`). These should be dumb and presentational.
*   **`layout/`**: `Shell` (App container) and `Header`.

### 📱 `src/screens/` (Views)
Feature-specific views that consume UI components and bind data.
*   **`ConfigScreen`**: Form for user inputs (Duration, Equipment).
*   **`PreviewScreen`**: Displays the generated workout + Swap UI.
*   **`ActiveTimer`**: The actual workout runner. Complex temporal logic.
*   **`HistoryScreen`**: Read-only list of past workouts.

### 🪝 `src/hooks/` (State Logic)
*   **`useTimer`**: The most complex state machine. Handles phases (`pre` -> `work` -> `rest` -> `finished`).
*   **`useWakeLock`**: Navigator API to prevent screen sleep.

---

## 💾 3. State Management Strategy

1.  **Global App State**: Handled in `App.jsx`.
    *   `config`: User preferences.
    *   `workout`: Currently generated workout object.
    *   `history`: Array of completed workouts (Persisted to localStorage).
    *   `appState`: Simple string router (`'config' | 'preview' | 'active' | 'history'`).

2.  **Immutability**:
    *   The `workout` object is treated as immutable.
    *   Modifications (Swap) call `engine/generator.js` which returns a *fresh* object.

---

## 🎨 4. Design & Styling (Tailwind)

*   **Theme**: Dark mode default (`slate-950`).
*   **Primary Color**: Emerald (`text-emerald-400`, `bg-emerald-500`).
*   **Typography**: Sans-serif, bold, uppercase for headers.
*   **Animations**: uses `tailwindcss-animate` utility classes (e.g., `animate-in`, `fade-in`, `zoom-in-95`).
*   **Glassmorphism**: Heavy use of `bg-slate-900/50`, `backdrop-blur`.

---

## 🛠️ 5. Common Modification Patterns

### ➤ How to Add a New Exercise
1.  Open `src/data/exercises.js`.
2.  Add an object to `EXERCISE_DB`.
3.  **Crucial**: Ensure `tags` are accurate. If it hurts knees, add `'knees'`.

### ➤ How to Add a New Injury Filter
1.  Open `src/data/exercises.js`.
2.  Add key to `INJURY_MAP` (e.g., `'Wrists': ['grip', 'push']`).
3.  Update `ConfigScreen.jsx` to render a new toggle button for it.

### ➤ How to Tweak Rep Logic
1.  Open `src/engine/generator.js`.
2.  Modify `getReps`.
3.  **Mandatory**: Run `npm test` to ensure you haven't broken the beginner scaling.

---

## 🛠️ 6. Development Scripts

### Web Build (Production)
```bash
npm run build
```
Outputs to `dist/`. This is what gets deployed to Vercel or synced to Capacitor.

### Testing (Watch Mode)
```bash
npm test -- --watch
```
Useful for TDD.

---

## 🧪 7. Testing Strategy

We use **Vitest**.
*   **Focus**: Unit testing the **Engine** (`src/engine/`).
*   **Why**: React components are visual and change often. The engine logic (Workouts must be valid) is critical and stable.
*   **Command**: `npm test`
*   **File**: `src/engine/generator.test.js`

---

## 📚 8. Glossary

*   **WOD**: Workout of the Day.
*   **AMRAP**: As Many Rounds As Possible (Time is fixed, work is variable).
*   **RFT**: Rounds For Time (Work is fixed, time is variable).
*   **EMOM**: Every Minute on the Minute.
*   **Rx**: Prescribed standard (Expert difficulty).
*   **Scaled**: Modified standard (Beginner difficulty).

---

## 🤖 9. Native Android Support (Capacitor)

The project now supports building a native Android `.apk` using Capacitor. We use a **Hybrid Architecture** where native functionalities extend the React PWA.

### 9.1 Native Capabilities (Key Differences from Web)

1.  **Navigation (Back Button)**
    *   **Web**: Uses browser history API.
    *   **Android**: Uses `@capacitor/app` to intercept the hardware back button.
    *   **Logic**: `App.jsx` handles custom routing logic (e.g., `Active -> Preview`). On the root screen, double-tap back within 2s to exit.

2.  **Screen Wake Lock** (`src/hooks/useWakeLock.js`)
    *   **Web**: Uses native `navigator.wakeLock` API.
    *   **Android**: Ues `@capacitor-community/keep-awake` for reliable screen keeping.
    *   **Auto-Restore**: Re-acquires lock when app returns from background (`visibilitychange`).

3.  **Background Timer Persistence** (`src/hooks/useTimer.js`)
    *   **Problem**: In standard PWAs, timers throttle/stop when backgrounded.
    *   **Solution**: We listen to `appStateChange`.
    *   **Implementation**: When app resumes, we calculate elapsed time (`Date.now() - timestamp`) and fast-forward the timer state.

### 9.2 Build & Deploy

### Prerequisites
*   Android Studio (installed and configured with an SDK).
*   Java/JDK (usually bundled with Android Studio).

### Development Workflow
1.  **Sync Changes**: If you modify the React code, you must sync it to the Android project.
    ```bash
    npm run build
    npx cap sync
    ```

2.  **Run on Device/Emulator**:
    ```bash
    npx cap open android
    # Then click the "Run" (▶) button in Android Studio
    ```

3.  **Build APK (Command Line)**:
    ```bash
    cd android
    ./gradlew assembleDebug
    ```
    The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

👉 **[See Full Mobile Build Guide](docs/MOBILE_BUILD.md)** for detailed technical build instructions.
👉 **[Google Play Publishing Guide](docs/GOOGLE_PLAY_PUBLISH.md)** for store listing and account setup.

