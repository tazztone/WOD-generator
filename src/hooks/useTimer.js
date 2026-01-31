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
                if (timeLeft <= 1) {
                    // Logic handled in next tick or immediate?
                    // The original had if (timeLeft <= 0) which means it hits 0 then starts.
                    // We want 3-2-1-GO.
                }
                if (timeLeft <= 0) {
                    SOUNDS.start();
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
                if (timeLeft === 31) SOUNDS.halfway();
                if (timeLeft === 11) speak("10 seconds", lang);
                if (timeLeft <= 4 && timeLeft > 1) SOUNDS.countdown();
                if (timeLeft <= 1) {
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
            } else if (isTabata) {
                if (timeLeft <= 4 && timeLeft > 1) SOUNDS.countdown();
                if (timeLeft <= 1) {
                    if (status === 'work') {
                        setStatus('rest');
                        setTimeLeft(10);
                        SOUNDS.round();
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
                // AMRAP, RFT, Chipper
                const totalDuration = workout.timeCap * 60;
                if (timeLeft === Math.floor(totalDuration / 2) + 1) SOUNDS.halfway();
                if (timeLeft === 61) speak(lang === 'de' ? "Noch eine Minute" : "One minute remaining", lang);
                
                if (timeLeft <= 4 && timeLeft > 1) SOUNDS.countdown();
                if (timeLeft <= 1) {
                    setStatus('finished');
                    SOUNDS.end();
                } else {
                    setTimeLeft(t => t - 1);
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
