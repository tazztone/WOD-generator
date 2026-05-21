import { createContext, useContext, useState, useEffect } from 'react';
import { HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from '../engine/storage';
import { generateWorkout as engineGenerate, swapExercise as engineSwap } from '../engine/generator';
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
        try {
            const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistory) setHistory(JSON.parse(savedHistory));

            const savedWorkoutsData = localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY);
            if (savedWorkoutsData) setSavedWorkouts(JSON.parse(savedWorkoutsData));
        } catch (e) {
            // Ignore parse errors, defaulting to empty state
        }
    }, []);

    const generateWorkout = () => {
        const newWorkout = engineGenerate(config);
        setWorkout(newWorkout);
        setAppState('preview');
    };

    const clearWorkout = () => {
        setWorkout(null);
        setAppState('config');
    };

    const swapExercise = (index, newExId) => {
        if (!workout) return;
        const updatedWorkout = engineSwap(workout, index, newExId, config);
        setWorkout(updatedWorkout);
    };

    const saveToHistory = (result) => {
        const newEntry = {
            ...result,
            id: Date.now(),
            date: new Date().toISOString()
        };
        // Cap history at 200 entries to avoid localStorage quota errors
        let updated = [newEntry, ...history];
        if (updated.length > 200) {
            updated = updated.slice(0, 200);
        }
        setHistory(updated);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    };

    const deleteHistoryEntry = (id) => {
        const updated = history.filter(entry => entry.id !== id);
        setHistory(updated);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    };

    const toggleSaveWorkout = (w) => {
        const isSaved = savedWorkouts.some(sw => sw.id === w.id);
        let updated;
        if (isSaved) {
            updated = savedWorkouts.filter(sw => sw.id !== w.id);
        } else {
            if (savedWorkouts.length >= 50) {
                alert(lang === 'de' ? 'Maximal 50 Workouts können gespeichert werden.' : 'Maximum of 50 saved workouts reached.');
                return;
            }
            updated = [w, ...savedWorkouts];
        }
        setSavedWorkouts(updated);
        localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
    };

    const value = {
        appState,
        setAppState,
        workout,
        setWorkout,
        history,
        savedWorkouts,
        generateWorkout,
        clearWorkout,
        swapExercise,
        saveToHistory,
        deleteHistoryEntry,
        clearHistory,
        toggleSaveWorkout
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) throw new Error('useWorkout must be used within WorkoutProvider');
    return context;
};
