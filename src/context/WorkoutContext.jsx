import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from '../engine/storage';
import { generateWorkout as engineGenerate, swapExercise as engineSwap } from '../engine/generator';
import { useSettings } from './SettingsContext';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const { config, lang } = useSettings();
    
    const [appState, setAppState] = useState('config'); // config, preview, active, history, calculator
    const [workout, setWorkout] = useState(null);
    const [history, setHistory] = useState([]);
    const [savedWorkoutsMap, setSavedWorkoutsMap] = useState({});

    // Load History & Saved Workouts on Mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistory) setHistory(JSON.parse(savedHistory));

            const savedWorkoutsData = localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY);
            if (savedWorkoutsData) {
                const arr = JSON.parse(savedWorkoutsData);
                const map = {};
                arr.forEach(w => { map[w.id] = w; });
                setSavedWorkoutsMap(map);
            }
        } catch (e) {
            console.error('Failed to parse storage data', e);
        }
    }, []);

    const savedWorkouts = useMemo(() => {
        return Object.values(savedWorkoutsMap).sort((a, b) => (b.id > a.id ? 1 : -1));
    }, [savedWorkoutsMap]);

    const generateWorkout = () => {
        const newWorkout = engineGenerate(config, lang);
        setWorkout(newWorkout);
        setAppState('preview');
    };

    const clearWorkout = () => {
        setWorkout(null);
        setAppState('config');
    };

    const swapExercise = (index, newExId) => {
        if (!workout) return;
        const updatedWorkout = engineSwap(workout, index, newExId, config, lang);
        setWorkout(updatedWorkout);
    };

    const saveToHistory = (result) => {
        const newEntry = {
            ...result,
            id: Date.now(),
            date: new Date().toISOString()
        };
        const updated = [newEntry, ...history];
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
        const isSaved = !!savedWorkoutsMap[w.id];
        let updatedMap;
        if (isSaved) {
            // eslint-disable-next-line no-unused-vars
            const { [w.id]: removed, ...rest } = savedWorkoutsMap;
            updatedMap = rest;
        } else {
            updatedMap = { ...savedWorkoutsMap, [w.id]: w };
        }
        setSavedWorkoutsMap(updatedMap);

        // Persist as array for backward compatibility with storage/exports
        const updatedArray = Object.values(updatedMap).sort((a, b) => (b.id > a.id ? 1 : -1));
        localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(updatedArray));
    };

    const value = {
        appState,
        setAppState,
        workout,
        setWorkout,
        history,
        savedWorkouts,
        savedWorkoutsMap,
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
