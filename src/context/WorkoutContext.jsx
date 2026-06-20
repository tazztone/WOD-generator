import { createContext, useContext, useState, useEffect } from 'react';
import {
  loadHistory,
  saveToHistory,
  deleteHistoryEntry,
  clearHistory,
  loadSavedWorkouts,
  toggleSavedWorkout,
} from '../engine/storage';
import { generateWorkout, swapExercise } from '../engine/generator';
import { useSettings } from './SettingsContext';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const { config, lang } = useSettings();

  const [appState, setAppState] = useState('config'); // config, preview, active, history, calculator
  const [workout, setWorkout] = useState(null);
  const [history, setHistory] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Load History & Saved Workouts on Mount
  useEffect(() => {
    setHistory(loadHistory());
    setSavedWorkouts(loadSavedWorkouts());
  }, []);

  const handleGenerateWorkout = () => {
    const newWorkout = generateWorkout(config);
    setWorkout(newWorkout);
    setAppState('preview');
  };

  const clearWorkout = () => {
    setWorkout(null);
    setAppState('config');
  };

  const handleSwapWorkout = (index, newExId) => {
    if (!workout) return;
    const updatedWorkout = swapExercise(workout, index, newExId, config);
    setWorkout(updatedWorkout);
  };

  const handleSaveToHistory = (result) => {
    const updated = saveToHistory(result);
    setHistory(updated);
  };

  const handleDeleteHistoryEntry = (id) => {
    const updated = deleteHistoryEntry(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleToggleSaveWorkout = (w) => {
    try {
      const updated = toggleSavedWorkout(w);
      setSavedWorkouts(updated);
    } catch (e) {
      if (e.message === 'MAX_LIMIT_REACHED') {
        alert(
          lang === 'de'
            ? 'Maximal 50 Workouts können gespeichert werden.'
            : 'Maximum of 50 saved workouts reached.'
        );
      }
    }
  };

  const value = {
    appState,
    setAppState,
    workout,
    setWorkout,
    history,
    savedWorkouts,
    generateWorkout: handleGenerateWorkout,
    clearWorkout,
    swapExercise: handleSwapWorkout,
    saveToHistory: handleSaveToHistory,
    deleteHistoryEntry: handleDeleteHistoryEntry,
    clearHistory: handleClearHistory,
    toggleSaveWorkout: handleToggleSaveWorkout,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within WorkoutProvider');
  return context;
};
