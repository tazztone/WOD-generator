# TODOs

## PENDING
🔴 [ ] Fix Android BACK button: discarding workout instead of returning from exercise swap (Bug)
🔴 [ ] Fix "Start Timer" button position: obscured by Android navigation overlay (UI Bug)
🔴 [ ] Improve visibility of "change" exercise icon (currently dark gray on dark)
🔴 [ ] Update "share" feature to include warmup and strength parts in clipboard
🔴 [ ] Add pause/resume functionality to timer (src/hooks/useTimer.js)
🔴 [ ] Persist timer state to localStorage to survive page refresh (src/hooks/useTimer.js)
🔴 [ ] Add form validation: ensure at least one equipment type is selected (src/screens/ConfigScreen.jsx)
🔴 [ ] Add schema version migration logic for storage (src/engine/storage.js)
🔴 [ ] Add try-catch for JSON.parse to handle corrupted localStorage (src/App.jsx)
🟡 [ ] Add feature to save workouts for later
🟡 [ ] Double max duration and movements (to 120min + 12 movements)
🟡 [ ] Add optional workout focus selection (e.g., Core, Cardio, Strength)
🟡 [ ] Add detailed explanations (tooltips) for smart algorithms throughout the app
🟡 [ ] Research Wodify export integration (https://docs.wodify.com/reference/post_workout-1)
🟡 [ ] Add "Partner" workout style (You go, I go)
🟡 [ ] Save time taken to complete workout in the logbook
🟡 [ ] Add countdown beeps at 3-2-1 for AMRAP/RFT final seconds (src/hooks/useTimer.js)
🟡 [ ] Add volume control setting for users (src/engine/audio.js)
🟡 [ ] Add swipe-to-delete for individual history entries (src/screens/HistoryScreen.jsx)
🟡 [ ] Expand workout templates: Ladder, Death By, Buy-In/Buy-Out (src/engine/generator.js)
🟡 [ ] Merge screen-specific translations into main locales.js (src/screens/ActiveTimer.jsx, src/screens/PreviewScreen.jsx)
🟢 [ ] Add integration tests for full workout generation + swap flow (src/engine/generator.test.js)
🟢 [ ] Add Web Share API support for native sharing on mobile devices (src/screens/PreviewScreen.jsx)
🟢 [ ] Add loading/spinner state to Button component for async actions (src/components/ui/Button.jsx)
