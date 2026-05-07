import { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, speak } from '../engine/audio';

// TODO: Add haptic feedback support for mobile devices
export const useTimer = (workout, lang, audioSettings) => {
    const [status, setStatus] = useState('pre'); // pre, work, rest, finished
    const [timeLeft, setTimeLeft] = useState(10); // Start with 10s countdown
    const [totalTime, setTotalTime] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [roundTime, setRoundTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const lastSavedStatus = useRef(status);
    const lastSavedRound = useRef(currentRound);

    const { countdowns, announcements, beeps } = audioSettings || { countdowns: true, announcements: true, beeps: true };

    // Initial Load from Persistence
    useEffect(() => {
        try {
            const saved = localStorage.getItem('wod_timer_v1');
            if (saved) {
                const state = JSON.parse(saved);
                if (state.workoutId === workout.id) {
                    setStatus(state.status);
                    setTimeLeft(state.timeLeft);
                    setTotalTime(state.totalTime);
                    setCurrentRound(state.currentRound);
                    setRoundTime(state.roundTime);
                }
            }
        } catch (e) {
            console.error('Failed to restore timer state', e);
        }
    }, [workout.id]);

    // Save to Persistence
    useEffect(() => {
        if (status === 'pre') return;
        if (status === 'finished') {
            localStorage.removeItem('wod_timer_v1');
            return;
        }

        const state = {
            workoutId: workout.id,
            status,
            timeLeft,
            totalTime,
            currentRound,
            roundTime
        };

        const statusChanged = lastSavedStatus.current !== status;
        const roundChanged = lastSavedRound.current !== currentRound;

        // Optimization: Avoid synchronous LocalStorage writes on every tick (1s).
        // Save immediately if paused, status changed, round changed, or every 5 seconds while running.
        if (!isPaused && !statusChanged && !roundChanged && timeLeft % 5 !== 0) return;

        localStorage.setItem('wod_timer_v1', JSON.stringify(state));
        lastSavedStatus.current = status;
        lastSavedRound.current = currentRound;
    }, [status, timeLeft, totalTime, currentRound, roundTime, workout.id, isPaused]);

    const timerRef = useRef(null);


    // Speak helper
    const speakMovements = useCallback(() => {
        if (!announcements || status === 'finished') return;
        const nextText = lang === 'de' ? "Als nächstes:" : "Up Next:";
        const moveList = workout.exercises.map(e => e.exercise.name).join(', ');
        speak(`${nextText} ${moveList}`, lang);
    }, [workout, announcements, status, lang]);

    // App State / Background handling
    useEffect(() => {
        let lastDate = Date.now();
        let appListener = null;

        const setupListener = async () => {
            try {
                const { App } = await import('@capacitor/app');
                appListener = await App.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive) {
                        // App going to background
                        lastDate = Date.now();
                    } else {
                        // App returning to foreground
                        const now = Date.now();
                        const passed = Math.floor((now - lastDate) / 1000);
                        if (passed > 0) {
                            console.log(`App resumed. Catching up ${passed}s`);
                            setTimeLeft(t => Math.max(0, t - passed)); // Reduce time, trigger transitions
                            setTotalTime(t => t + passed);
                            setRoundTime(t => t + passed);
                        }
                    }
                });
            } catch (e) { console.log('Background handling disabled (non-native)'); }
        };

        setupListener();
        return () => { if (appListener) appListener.remove(); };
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            if (status === 'finished' || isPaused) return;

            if (status === 'pre') {
                if (timeLeft <= 3 && timeLeft > 0 && countdowns) SOUNDS.countdown();
                if (timeLeft <= 0) {
                    if (beeps) SOUNDS.start();
                    setStatus('work');
                    const initialTime = workout.template === 'Tabata' ? 20 : (workout.template === 'EMOM' ? 60 : workout.timeCap * 60);
                    setTimeLeft(initialTime);
                    speakMovements();
                } else {
                    setTimeLeft(t => t - 1);
                }
                return;
            }

            // Main Timer Logic
            setTotalTime(tt => tt + 1);
            setRoundTime(rt => rt + 1);

            const isEMOM = workout.template === 'EMOM';
            const isTabata = workout.template === 'Tabata';

            if (isEMOM) {
                if (timeLeft === 31 && beeps) SOUNDS.halfway();
                if (timeLeft === 11 && announcements) speak("10 seconds", lang);
                if (timeLeft <= 4 && timeLeft > 1 && countdowns) SOUNDS.countdown();
                if (timeLeft <= 1) {
                    if (beeps) SOUNDS.round();
                    setCurrentRound(r => r + 1);
                    setTimeLeft(60);
                    setRoundTime(0);
                    if (currentRound >= workout.rounds) {
                        setStatus('finished');
                        SOUNDS.end();
                    }
                } else {
                    setTimeLeft(t => t - 1);
                }
            } else if (isTabata) {
                if (timeLeft <= 4 && timeLeft > 1 && countdowns) SOUNDS.countdown();
                if (timeLeft <= 1) {
                    if (status === 'work') {
                        setStatus('rest');
                        setTimeLeft(10);
                        if (beeps) SOUNDS.round();
                    } else {
                        setStatus('work');
                        setTimeLeft(20);
                        setCurrentRound(r => r + 1);
                        if (beeps) SOUNDS.start();
                        if (currentRound >= workout.rounds) {
                            setStatus('finished');
                            SOUNDS.end();
                        }
                    }
                } else {
                    setTimeLeft(t => t - 1);
                }
            } else {
                // AMRAP, RFT, Chipper
                const totalDuration = workout.timeCap * 60;
                if (timeLeft === Math.floor(totalDuration / 2) + 1 && beeps) SOUNDS.halfway();
                if (timeLeft === 61 && announcements) speak(lang === 'de' ? "Noch eine Minute" : "One minute remaining", lang);
                
                if (timeLeft <= 4 && timeLeft > 1 && countdowns) SOUNDS.countdown();
                if (timeLeft <= 1) {
                    setStatus('finished');
                    SOUNDS.end();
                } else {
                    setTimeLeft(t => t - 1);
                }
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [status, timeLeft, workout, currentRound, countdowns, announcements, beeps, speakMovements, lang, isPaused]);

    return {
        status,
        setStatus,
        timeLeft,
        totalTime,
        currentRound,
        setCurrentRound,
        roundTime,
        isPaused,
        setIsPaused
    };
};
