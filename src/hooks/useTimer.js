import { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, speak } from '../engine/audio';

// TODO: Add haptic feedback support for mobile devices
export const useTimer = (workout, lang, audioSettings) => {
    // React State for UI
    const [status, setStatusState] = useState('pre'); // pre, work, rest, finished
    const [timeLeft, setTimeLeftState] = useState(10); // Start with 10s countdown
    const [totalTime, setTotalTimeState] = useState(0);
    const [currentRound, setCurrentRoundState] = useState(1);
    const [roundTime, setRoundTimeState] = useState(0);
    const [isPaused, setIsPausedState] = useState(false);

    // Mutable state for interval to avoid dependency loops
    const timerStateRef = useRef({
        status: 'pre',
        timeLeft: 10,
        totalTime: 0,
        currentRound: 1,
        roundTime: 0,
        isPaused: false,
        lastTickTime: Date.now()
    });

    const { countdowns, announcements, beeps } = audioSettings || { countdowns: true, announcements: true, beeps: true };

    // Sync functions
    const setStatus = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.status) : val;
        timerStateRef.current.status = newVal;
        setStatusState(newVal);
    }, []);

    const setTimeLeft = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.timeLeft) : val;
        timerStateRef.current.timeLeft = newVal;
        setTimeLeftState(newVal);
    }, []);

    const setTotalTime = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.totalTime) : val;
        timerStateRef.current.totalTime = newVal;
        setTotalTimeState(newVal);
    }, []);

    const setCurrentRound = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.currentRound) : val;
        timerStateRef.current.currentRound = newVal;
        setCurrentRoundState(newVal);
    }, []);

    const setRoundTime = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.roundTime) : val;
        timerStateRef.current.roundTime = newVal;
        setRoundTimeState(newVal);
    }, []);

    const setIsPaused = useCallback((val) => {
        const newVal = typeof val === 'function' ? val(timerStateRef.current.isPaused) : val;
        timerStateRef.current.isPaused = newVal;
        setIsPausedState(newVal);
        // Reset last tick time when unpausing to prevent sudden jump
        if (!newVal) {
            timerStateRef.current.lastTickTime = Date.now();
        }
    }, []);

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
    }, [workout.id, setStatus, setTimeLeft, setTotalTime, setCurrentRound, setRoundTime]);

    const lastSavedStateRef = useRef({ status: 'pre', currentRound: 1 });

    // Save to Persistence
    useEffect(() => {
        if (status === 'pre') return;
        if (status === 'finished') {
            localStorage.removeItem('wod_timer_v1');
            return;
        }

        const shouldSave =
            isPaused ||
            status !== lastSavedStateRef.current.status ||
            currentRound !== lastSavedStateRef.current.currentRound ||
            (timeLeft % 5 === 0);

        if (shouldSave) {
            const state = {
                workoutId: workout.id,
                status,
                timeLeft,
                totalTime,
                currentRound,
                roundTime
            };
            localStorage.setItem('wod_timer_v1', JSON.stringify(state));
            lastSavedStateRef.current = { status, currentRound };
        }
    }, [status, timeLeft, totalTime, currentRound, roundTime, workout.id, isPaused]);

    // Speak helper
    const speakMovements = useCallback(() => {
        if (!announcements || timerStateRef.current.status === 'finished') return;
        const nextText = lang === 'de' ? "Als nächstes:" : "Up Next:";
        const moveList = workout.exercises.map(e => e.exercise.name).join(', ');
        speak(`${nextText} ${moveList}`, lang);
    }, [workout, announcements, lang]);

    // Ref to hold the latest callback logic
    const tickLogicRef = useRef();

    useEffect(() => {
        tickLogicRef.current = () => {
            const state = timerStateRef.current;
            const now = Date.now();
            const deltaMs = now - state.lastTickTime;

            if (state.isPaused || state.status === 'finished') {
                state.lastTickTime = now;
                return;
            }

            if (deltaMs >= 1000) {
                let passed = Math.floor(deltaMs / 1000);
                state.lastTickTime += passed * 1000;

                let needsUpdate = false;

                while (passed > 0 && state.status !== 'finished' && !state.isPaused) {
                    const isCatchup = passed > 1; // True if fast-forwarding

                    if (state.status === 'pre') {
                        if (state.timeLeft <= 3 && state.timeLeft > 0 && countdowns && !isCatchup) SOUNDS.countdown();
                        if (state.timeLeft <= 0) {
                            if (beeps && !isCatchup) SOUNDS.start();
                            state.status = 'work';
                            state.timeLeft = workout.template === 'Tabata' ? 20 : (workout.template === 'EMOM' ? 60 : workout.timeCap * 60);
                            if (!isCatchup) speakMovements();
                        } else {
                            state.timeLeft -= 1;
                        }
                    } else {
                        // Main Timer Logic
                        state.totalTime += 1;
                        state.roundTime += 1;

                        const isEMOM = workout.template === 'EMOM';
                        const isTabata = workout.template === 'Tabata';

                        if (isEMOM) {
                            if (state.timeLeft === 31 && beeps && !isCatchup) SOUNDS.halfway();
                            if (state.timeLeft === 11 && announcements && !isCatchup) speak("10 seconds", lang);
                            if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) SOUNDS.countdown();
                            if (state.timeLeft <= 1) {
                                if (beeps && !isCatchup) SOUNDS.round();
                                if (state.currentRound >= workout.rounds) {
                                    state.status = 'finished';
                                    if (!isCatchup) SOUNDS.end();
                                } else {
                                    state.currentRound += 1;
                                    state.timeLeft = 60;
                                    state.roundTime = 0;
                                }
                            } else {
                                state.timeLeft -= 1;
                            }
                        } else if (isTabata) {
                            if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) SOUNDS.countdown();
                            if (state.timeLeft <= 1) {
                                if (state.status === 'work') {
                                    state.status = 'rest';
                                    state.timeLeft = 10;
                                    if (beeps && !isCatchup) SOUNDS.round();
                                } else {
                                    if (state.currentRound >= workout.rounds) {
                                        state.status = 'finished';
                                        if (!isCatchup) SOUNDS.end();
                                    } else {
                                        state.status = 'work';
                                        state.timeLeft = 20;
                                        state.currentRound += 1;
                                        if (beeps && !isCatchup) SOUNDS.start();
                                    }
                                }
                            } else {
                                state.timeLeft -= 1;
                            }
                        } else {
                            // AMRAP, RFT, Chipper
                            const totalDuration = workout.timeCap * 60;
                            if (state.timeLeft === Math.floor(totalDuration / 2) + 1 && beeps && !isCatchup) SOUNDS.halfway();
                            if (state.timeLeft === 61 && announcements && !isCatchup) speak(lang === 'de' ? "Noch eine Minute" : "One minute remaining", lang);

                            if (state.timeLeft <= 4 && state.timeLeft > 1 && countdowns && !isCatchup) SOUNDS.countdown();
                            if (state.timeLeft <= 1) {
                                state.status = 'finished';
                                if (!isCatchup) SOUNDS.end();
                            } else {
                                state.timeLeft -= 1;
                            }
                        }
                    }

                    passed--;
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    setStatusState(state.status);
                    setTimeLeftState(state.timeLeft);
                    setTotalTimeState(state.totalTime);
                    setCurrentRoundState(state.currentRound);
                    setRoundTimeState(state.roundTime);
                }
            }
        };
    }, [workout, countdowns, announcements, beeps, speakMovements, lang]);

    useEffect(() => {
        timerStateRef.current.lastTickTime = Date.now();
        const intervalId = setInterval(() => {
            if (tickLogicRef.current) {
                tickLogicRef.current();
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

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
