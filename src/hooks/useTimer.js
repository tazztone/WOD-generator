import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SOUNDS, speak } from '../engine/audio';
import { getExerciseName } from '../engine/utils';
import { TimerEngine } from '../engine/TimerEngine';

export const useTimer = (workout, lang, audioSettings) => {
  const { announcements } = audioSettings || { announcements: true };

  // React state for UI rendering
  const [status, setStatusState] = useState('pre');
  const [timeLeft, setTimeLeft] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [currentRound, setCurrentRoundState] = useState(1);
  const [roundTime, setRoundTime] = useState(0);
  const [isPaused, setIsPausedState] = useState(false);

  // Engine reference
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = new TimerEngine({ workout, audioSettings });
  }

  const getEngine = useCallback(() => {
    return engineRef.current;
  }, []);

  // Haptic feedback adapter
  const haptic = useCallback(async (pattern) => {
    try {
      if (pattern === 50) {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (pattern === 200) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (Array.isArray(pattern)) {
        if (pattern.length > 2) {
          await Haptics.vibrate({ duration: 500 });
        } else {
          await Haptics.impact({ style: ImpactStyle.Medium });
        }
      } else {
        await Haptics.vibrate({ duration: pattern });
      }
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    }
  }, []);

  // Text-to-speech helper
  const moveListString = useMemo(() => {
    return workout?.exercises?.map((e) => getExerciseName(e.exercise, lang)).join(', ') || '';
  }, [workout, lang]);

  const speakMovements = useCallback(() => {
    if (!announcements) return;
    const nextText = lang === 'de' ? 'Als nächstes:' : 'Next up:';
    speak(`${nextText} ${moveListString}`, lang);
  }, [announcements, lang, moveListString]);

  // Sync helper: copies engine state to React states
  const syncState = useCallback((engineState) => {
    setStatusState(engineState.status);
    setTimeLeft(engineState.timeLeft);
    setTotalTime(engineState.totalTime);
    setCurrentRoundState(engineState.currentRound);
    setRoundTime(engineState.roundTime);
    setIsPausedState(engineState.isPaused);
  }, []);

  // Handle incoming actions/effects from the TimerEngine
  const handleEvent = useCallback(
    (event) => {
      switch (event.type) {
        case 'SOUND_COUNTDOWN':
          SOUNDS.countdown();
          break;
        case 'HAPTIC_LIGHT':
          haptic(50);
          break;
        case 'SOUND_START':
          SOUNDS.start();
          break;
        case 'HAPTIC_START':
          haptic([200, 100, 200]);
          break;
        case 'SPEAK_MOVEMENTS':
          speakMovements();
          break;
        case 'SOUND_HALFWAY':
          SOUNDS.halfway();
          break;
        case 'SPEAK_10_SECONDS':
          speak('10 seconds', lang);
          break;
        case 'SOUND_ROUND':
          SOUNDS.round();
          break;
        case 'HAPTIC_MEDIUM':
          haptic(200);
          break;
        case 'SOUND_END':
          SOUNDS.end();
          break;
        case 'HAPTIC_END':
          haptic([500, 200, 500]);
          break;
        case 'SPEAK_ONE_MINUTE':
          speak(lang === 'de' ? 'Noch eine Minute' : 'One minute remaining', lang);
          break;
        case 'SPEAK_TEXT':
          speak(event.text, lang);
          break;
      }
    },
    [haptic, speakMovements, lang]
  );

  // Set pause/resume state on the engine
  const setIsPaused = useCallback(
    (val) => {
      const engine = getEngine();
      const nextPaused = typeof val === 'function' ? val(engine.state.isPaused) : val;
      engine.setPaused(nextPaused);
      syncState(engine.state);
    },
    [getEngine, syncState]
  );

  const setStatus = useCallback(
    (val) => {
      const engine = getEngine();
      const nextStatus = typeof val === 'function' ? val(engine.state.status) : val;
      engine.state.status = nextStatus;
      syncState(engine.state);
    },
    [getEngine, syncState]
  );

  const setCurrentRound = useCallback(
    (val) => {
      const engine = getEngine();
      const nextRound = typeof val === 'function' ? val(engine.state.currentRound) : val;
      engine.state.currentRound = nextRound;
      syncState(engine.state);
    },
    [getEngine, syncState]
  );

  // Initial load from local persistence and resetting engine on workout change
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wod_timer_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workoutId === workout.id) {
          engineRef.current = TimerEngine.restore(parsed, workout, audioSettings);
          syncState(engineRef.current.state);
          return;
        }
      }
    } catch {
      // Fallback
    }
    engineRef.current = new TimerEngine({ workout, audioSettings });
    syncState(engineRef.current.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.id, audioSettings, syncState]);

  // Handle updates and local storage saves
  const lastSavedStateRef = useRef({ status: 'pre', currentRound: 1 });
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || engine.state.status === 'pre') return;

    if (engine.state.status === 'finished') {
      localStorage.removeItem('wod_timer_v1');
      return;
    }

    const shouldSave =
      engine.state.isPaused ||
      engine.state.status !== lastSavedStateRef.current.status ||
      engine.state.currentRound !== lastSavedStateRef.current.currentRound;

    if (shouldSave) {
      const payload = {
        workoutId: workout.id,
        status: engine.state.status,
        timeLeft: engine.state.timeLeft,
        totalTime: engine.state.totalTime,
        currentRound: engine.state.currentRound,
        roundTime: engine.state.roundTime,
        isPaused: engine.state.isPaused,
      };
      localStorage.setItem('wod_timer_v1', JSON.stringify(payload));
      lastSavedStateRef.current = {
        status: engine.state.status,
        currentRound: engine.state.currentRound,
      };
    }
  }, [status, currentRound, isPaused, timeLeft, totalTime, roundTime, workout.id]);

  // Throttled persistence loop
  useEffect(() => {
    if (status === 'pre' || status === 'finished' || isPaused) return;

    const interval = setInterval(() => {
      const engine = engineRef.current;
      if (engine) {
        const payload = {
          workoutId: workout.id,
          status: engine.state.status,
          timeLeft: engine.state.timeLeft,
          totalTime: engine.state.totalTime,
          currentRound: engine.state.currentRound,
          roundTime: engine.state.roundTime,
          isPaused: engine.state.isPaused,
        };
        localStorage.setItem('wod_timer_v1', JSON.stringify(payload));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, isPaused, workout.id]);

  // Core timing interval (updates every 100ms)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const engine = engineRef.current;
      if (engine && !engine.state.isPaused && engine.state.status !== 'finished') {
        const { state: nextState, events } = engine.tick(Date.now());
        syncState(nextState);
        events.forEach(handleEvent);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [syncState, handleEvent]);

  return {
    status,
    setStatus,
    timeLeft,
    totalTime,
    currentRound,
    setCurrentRound,
    roundTime,
    isPaused,
    setIsPaused,
  };
};
