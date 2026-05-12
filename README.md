# WOD Generator

[![Version](https://img.shields.io/badge/version-7.0.0-blue)](https://github.com/tazztone/WOD-generator)
[![React](https://img.shields.io/badge/react-18-61dafb)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/tailwind-3.4-06b6d4)](https://tailwindcss.com/)
[![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20Android-green)](#)

A professional-grade CrossFit®-style Workout of the Day (WOD) generator and interval timer. Unlike simple randomizers, it uses a smart algorithmic engine to produce balanced, effective workouts tailored to your equipment, skill level, and time constraints. Runs fully offline as a PWA and supports native Android builds via Capacitor.

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite |
| Styling | Tailwind CSS 3.4 |
| Native Android | Capacitor |
| Audio | Web Speech API (voice coach) + Web Audio API |
| Storage | LocalStorage — privacy-first, no cloud |
| Build | Vite |

## Architecture

```
src/
├── components/       # React UI components (Timer, WOD preview, Logbook, Config)
├── engine/           # Smart generation algorithms — Director, balancer, substitution rules
├── data/             # Movement database, equipment maps, difficulty/scaling tables
├── hooks/            # Custom hooks: useWakeLock, useTimer, useLogbook
└── utils/            # Rep scaling, audio helpers, share formatting
```

The core **Director pattern** in `engine/` drives stateful workout balance — tracking push/pull ratios, preventing consecutive muscle group overlap, and auto-substituting movements for skill level and injury restrictions.

## Key Features

- **9 Workout Modes** — AMRAP, RFT, EMOM, Chipper, Tabata, Ladder, Death By, Partner, Strength Bias
- **Smart Generation Engine** — stateful 1:1 push/pull balancing, flow control, injury protection (exclude body parts), dynamic rep/weight scaling
- **Pro Timer** — voice coach (Web Speech API), screen wake lock, background persistence on Android, large high-contrast display
- **Logbook** — local storage of every completed workout with score tracking (rounds + reps or time)
- **PWA + Android** — fully offline, installable on iOS/Android/desktop home screen; native Android via Capacitor

## Quick Start

**Prerequisites:** Node.js v18+, npm

```bash
git clone https://github.com/tazztone/WOD-generator.git
cd WOD-generator
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build   # Production web build → dist/
```

See [`docs/ANDROID_GUIDE.md`](docs/ANDROID_GUIDE.md) for Android / Google Play Store build instructions and [`AGENTS.md`](AGENTS.md) for full technical documentation.

## License

Proprietary — all rights reserved.
