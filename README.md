# WOD Gen Ultimate

[![Version](https://img.shields.io/badge/version-7.0.0-blue)](https://github.com/tazztone/WOD-generator)
[![React](https://img.shields.io/badge/react-18-61dafb)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/tailwind-3.4-06b6d4)](https://tailwindcss.com/)
[![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20Android-green)](#)

A professional-grade CrossFit®-style Workout of the Day (WOD) generator and interval timer. Unlike standard randomizers, it uses a smart algorithmic engine to produce balanced, effective workouts tailored to equipment availability, skill level, and injury constraints. Runs 100% offline as a Progressive Web App (PWA) and supports native Android deployment via Capacitor.

---

## 🚀 Key Features

*   **9 Workout Templates** – AMRAP, RFT, EMOM, Chipper, Tabata, Ladder, Death By, Partner, and Strength Bias.
*   **Smart "Director" Engine** – Enforces stateful movement balancing (such as 1:1 Push/Pull ratios), pairwise fatigue prevention, and injury-specific body-part exclusions.
*   **Skill-Based Scaling** – Substituting complex movements (e.g. Handstand Push-Ups or Muscle-Ups) for beginner/scaled alternatives rather than just scaling rep numbers.
*   **Pro Interval Timer** – Built-in audio coach (Web Speech API), screen wake-lock protection, and background catch-up persistence.
*   **Privacy First** – Fully local storage of all completed workouts and preferences. No cloud accounts, databases, or API calls.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **UI Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 3.4 |
| **Native Wrapper** | Capacitor 7 |
| **Audio & TTS** | Web Speech API (Announcer) + Web Audio API (Oscillators) |
| **Storage** | LocalStorage |
| **Testing** | Vitest + JSDOM |

---

## 📚 Project Documentation Index

Use these specialized guides to explore different aspects of the codebase:

*   📖 **[Domain Model & Glossary](file:///home/tazztone/_coding/WOD-generator/CONTEXT.md)** – Overview of core concepts (AMRAP, RFT, EMOM) and difficulty scales (Rx, Scaled, Beginner).
*   ⚙️ **[Developer & Architecture Guide](file:///home/tazztone/_coding/WOD-generator/docs/DEVELOPER_GUIDE.md)** – File organization, state management strategy, Tailwind system, and mobile integration mechanisms (wake locks, timer persistence, back-button interception).
*   🧠 **[Workout Engine Design](file:///home/tazztone/_coding/WOD-generator/docs/ENGINE_DESIGN.md)** – Deep-dive into the stateful generation pipelines, static/dynamic rules, substitution logic, and simulation reports.
*   🤖 **[Android Build & Publishing Guide](file:///home/tazztone/_coding/WOD-generator/docs/ANDROID_GUIDE.md)** – Prerequisites, local Gradle compilation, signing keystores, and Google Play Console release instructions.
*   🤖 **[AI Agent Rules](file:///home/tazztone/_coding/WOD-generator/AGENTS.md)** – Strict, minimal instructions and rules for AI assistants editing the repository.

---

## ⚡ Quick Start

### Prerequisites
*   Node.js v18 or later
*   npm

### Get Running Locally
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/tazztone/WOD-generator.git
    cd WOD-generator
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🛠️ Development & Script Reference

The project includes pre-configured npm scripts to help manage testing, compilation, and engine tuning:

### Core Commands
*   `npm run dev` – Boots up the Vite local server with hot module reloading.
*   `npm run build` – Compiles production web assets into the `dist/` directory.
*   `npm run preview` – Bootstraps a local server to test the production build locally.
*   `npm test` – Runs the full Vitest unit test suite (focuses heavily on testing engine/ logic).
*   `npm run lint` – Runs ESLint syntax verification.
*   `npm run format` – Formats code files using Prettier.

### Capacitor Mobile Commands
*   `npm run cap:sync` – Performs a production build and immediately syncs the assets to the Android platform folder (`dist/` -> `android/`).
*   `npm run resources` – Automatically generates native application launch assets and icons.

### Engine Simulation & Tuning
*   `npm run analyze` – Generates 10,000 workouts using simulated user configurations and prints a distribution report containing push/pull ratio, pool utilization, and leakage metrics.
*   `npm run analyze:logic` – Sanity checks repetition distributions and verifies rounds ratios across all templates.

---

## 🔒 Privacy Policy

**WOD Gen Ultimate** is built as an offline-first application.
*   **Zero Data Collection**: We do not collect, monitor, store, or share any personal information, usage statistics, or tracking metrics.
*   **Local Storage**: All workout histories, app configurations, and custom preferences are stored strictly on your device using `localStorage`. This data never leaves your device.
*   **Device Permissions**: Minimum permissions are requested solely for active features:
    *   *Keep Awake (Wake Lock)*: Prevents screen sleeping during active workouts.
    *   *Haptics*: Provides vibration alerts for timer round changes.
*   **No Third-Party SDKs**: No trackers, ads, or analytics software are integrated.

---

## 📄 License

Proprietary — All rights reserved.
