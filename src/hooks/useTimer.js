import { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, speak } from '../engine/audio';

export const useTimer = (workout, lang, voiceEnabled) => {
    const [status, setStatus] = useState('pre'); // pre, work, rest, finished
    const [timeLeft, setTimeLeft] = useState(10); // Start with 10s countdown
    const [totalTime, setTotalTime] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [roundTime, setRoundTime] = useState(0);

    const timerRef = useRef(null);

    // Speak helper
    const speakMovements = useCallback(() => {
        if (!voiceEnabled || status === 'finished') return;
        const nextText = lang === 'de' ? "Als nächstes:" : "Up Next:";
        const moveList = workout.exercises.map(e => e.exercise.name).join(', ');
        speak(`${nextText} ${moveList}`, lang);
    }, [workout, voiceEnabled, status, lang]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            if (status === 'finished') return;

            if (status === 'pre') {
                if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                if (timeLeft === 0) {
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
                if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
                if (timeLeft === 0) {
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
                if (timeLeft === 0) {
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
                if (workout.template === 'AMRAP' || workout.template === 'RFT') {
                    if (timeLeft === 0) {
                        setStatus('finished');
                        SOUNDS.end();
                    } else {
                        setTimeLeft(t => t - 1);
                    }
                }
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [status, timeLeft, workout, currentRound, voiceEnabled, speakMovements, lang]);

    return {
        status,
        setStatus,
        timeLeft,
        totalTime,
        currentRound,
        setCurrentRound,
        roundTime
    };
};
