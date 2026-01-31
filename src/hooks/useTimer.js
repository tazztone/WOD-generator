import { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, speak } from '../engine/audio';

// TODO: Add haptic feedback support for mobile devices
export const useTimer = (workout, lang, voiceEnabled) => {
    const [status, setStatus] = useState('pre'); // pre, work, rest, finished
    const [timeLeft, setTimeLeft] = useState(10); // Start with 10s countdown
    const [totalTime, setTotalTime] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [roundTime, setRoundTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
        localStorage.setItem('wod_timer_v1', JSON.stringify(state));
    }, [status, timeLeft, totalTime, currentRound, roundTime, workout.id]);

    const timerRef = useRef(null);


    // Speak helper
    const speakMovements = useCallback(() => {
        if (!voiceEnabled || status === 'finished') return;
        const nextText = lang === 'de' ? "Als nächstes:" : "Up Next:";
        const moveList = workout.exercises.map(e => e.exercise.name).join(', ');
        speak(`${nextText} ${moveList}`, lang);
    }, [workout, voiceEnabled, status, lang]);

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
                if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                if (timeLeft <= 0) {
                    SOUNDS.start();
                    setStatus('work');
                    setTimeLeft(workout.timeCap * 60); // Set main timer
                    if (workout.template === 'Tabata') setTimeLeft(20);
                    if (workout.template === 'EMOM') setTimeLeft(60);
                    speakMovements();
                } else {
                    setTimeLeft(t => t - 1);
                }
                return;
            }

            // Main Timer Logic
            setTotalTime(tt => tt + 1);
            setRoundTime(rt => rt + 1);

            if (workout.template === 'EMOM') {
                if (timeLeft === 10) speak("10 seconds", lang);
                // TODO: Add half-time audio cue (e.g., "30 seconds" for EMOM)
                if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                if (timeLeft <= 0) {
                    // New Minute
                    SOUNDS.round();
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
            } else if (workout.template === 'Tabata') {
                if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                if (timeLeft <= 0) {
                    if (status === 'work') {
                        setStatus('rest');
                        setTimeLeft(10);
                        SOUNDS.start();
                    } else {
                        setStatus('work');
                        setTimeLeft(20);
                        setCurrentRound(r => r + 1);
                        SOUNDS.start();
                        if (currentRound >= 8) {
                            setStatus('finished');
                            SOUNDS.end();
                        }
                    }
                } else {
                    setTimeLeft(t => t - 1);
                }
            } else {
                // AMRAP, RFT, Chipper (Count DOWN or UP)
                // TODO: Add "halfway there" audio cue for AMRAP/RFT
                if (workout.template === 'AMRAP' || workout.template === 'RFT') {
                    if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                    if (timeLeft <= 0) {
                        setStatus('finished');
                        SOUNDS.end();
                    } else {
                        setTimeLeft(t => t - 1);
                    }
                }
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [status, timeLeft, workout, currentRound, voiceEnabled, speakMovements, lang, isPaused]);

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
