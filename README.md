# WOD Gen 

![Version](https://img.shields.io/badge/version-7.0.0-emerald)
![Tech](https://img.shields.io/badge/react-18-blue)
![Style](https://img.shields.io/badge/tailwind-3.4-cyan)

**WOD Gen ** is a professional-grade CrossFit®-style workout generator and timer designed for athletes, garage gym owners, and coaches. Unlike simple randomizers, it uses a smart algorithmic engine to create balanced, effective workouts tailored to your specific equipment, skill level, and time constraints.

It runs completely client-side as a Progressive Web App (PWA), meaning it works offline and can be installed specifically on mobile devices. It also supports **Native Android** builds via Capacitor.

---

## 🚀 Key Features

### 🧠 Smart Generation Engine
*   **Stateful Balancing**: Uses a "Director" pattern to ensure perfect movement distribution (e.g., maintaining a 1:1 "Push" vs "Pull" ratio).
*   **Flow Control**: Intelligently prevents muscle group overlap (e.g., avoiding consecutive overhead movements) to ensure workout flow.
*   **Smart Substitutions**: Automatically replaces advanced gymnastics (Muscle-ups, HSPUs) with appropriate variants for **Beginner** levels.
*   **Dynamic Scaling**: Adjusts repetitions and weights based on workout duration and selected difficulty.
*   **Injury Protection**: Exclude specific body parts (Shoulders, Knees, Back) to prevent aggravating injuries.

### ⚡ Comprehensive Workout Modes
*   **AMRAP**: "As Many Rounds As Possible" within a fixed time.
*   **RFT**: "Rounds For Time" - complete the work as fast as possible.
*   **EMOM**: "Every Minute on the Minute" interval training.
*   **Chipper**: High-volume, one-round endurance slogs.
*   **Tabata**: Classic high-intensity intervals (20s work / 10s rest).
*   **Ladder**: Ascending or descending repetition schemes.
*   **Death By**: EMOM-style workouts that increase in volume until failure.
*   **Partner Mode**: Optimized logic for shared workouts, including rep doubling and flow adjustments.
*   **Strength Bias**: Option to add a heavy lifting session ("Part A") before the conditioning piece.

### ⏱️ Pro-Level Timer
*   **Visuals**: Large, high-contrast display readable from across the garage.
*   **Audio Coach**: Synthesized voice announcements ("Up Next: Thrusters") so you don't have to look at the screen.
*   **Live Controls**: Adjust beep volume and toggle voice coaching directly from the timer header.
*   **Sound Effects**: Clear beeps for countdowns, round changes, and rest intervals.
*   **Wake Lock**: Prevents your phone screen from turning off mid-workout.
*   **Background Persistence**: Timer continues to run accurately even if you switch apps or lock your phone (Native Android).

### 📊 Logbook & History
*   **Local Storage**: Automatically saves every completed workout to your device.
*   **Tracking**: Record scores (Rounds + Reps or Time) to track progress.
*   **Privacy Focused**: Data lives on your device, not in the cloud.

---

## 📖 User Guide

### 1. Configuration
The home screen allows you to define the parameters of your session:
*   **Time Domain**: Choose anywhere from 5 to 60 minutes.
*   **Equipment**: Toggle what you have available (Barbell, Dumbbells, Pull-up Bar, Cardio Machine). If you untick "Barbell", no barbell movements will appear.
*   **Style, Level & Focus**: Fine-tune the programming (e.g., Rx vs Beginner) and bias the generator towards specific modalities (Cardio, Strength, Gymnastics).

### 2. Preview & Customization
Once generated, you see the WOD (Workout of the Day) preview.
*   **Swap**: Don't like a specific movement? Click/Tap it to instantly swap it for a valid alternative (same muscle group, same equipment requirements).
*   **Share**: Copy the text representation of the workout to send to friends.

### 3. The Timer
*   **Pre-Workout**: 10-second countdown gives you time to get into position.
*   **Active**: Shows large timer, current round, and the movements you should be doing.
*   **Audio**: Adjust beep volume slider or toggle voice coaching on/off directly in the top bar.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Quick Start
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/wod-generator.git
    cd wod-generator
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

### Building & Deployment
See [`AGENTS.md`](AGENTS.md) for detailed build instructions.

### 🚀 Google Play Store
*   **Android Build & Publishing Guide**: [`docs/ANDROID_GUIDE.md`](docs/ANDROID_GUIDE.md)
*   **Privacy Policy**: [`PRIVACY.md`](PRIVACY.md)

---

## 📱 PWA (Offline Support)
This app is designed to work 100% offline.
*   **Mobile**: Open in Safari/Chrome on iOS/Android and tap "Add to Home Screen" for a native app experience.
*   **Desktop**: Detects as an installable Chrome App.

---

## 📄 License

This project is proprietary.
