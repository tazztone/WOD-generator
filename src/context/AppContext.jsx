import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadConfig, saveConfig, HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from '../engine/storage';
import { generateWorkout as engineGenerate, swapExercise as engineSwap } from '../engine/generator';
import { setGlobalVolume } from '../engine/audio';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // --- State ---
    const [appState, setAppState] = useState('config'); // config, preview, active, history, calculator
    const [lang, setLang] = useState('en');
    const [config, setConfig] = useState(loadConfig());
    const [workout, setWorkout] = useState(null);
    const [history, setHistory] = useState([]);
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [tooltip, setTooltip] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const modalOpenRef = useRef(false);

    // --- Effects ---

    // 1. Sync modal ref
    useEffect(() => {
        modalOpenRef.current = modalOpen;
    }, [modalOpen]);

    // 2. Load History & Saved Workouts on Mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistory) setHistory(JSON.parse(savedHistory));

            const savedWorkoutsData = localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY);
            if (savedWorkoutsData) setSavedWorkouts(JSON.parse(savedWorkoutsData));
        } catch (e) {
            console.error('Failed to parse storage data', e);
        }
    }, []);

    // 3. Save Config Changes & Update Audio
    useEffect(() => {
        saveConfig(config);
        if (config.volume !== undefined) {
            setGlobalVolume(config.volume);
        }
    }, [config]);

    // 4. Capacitor Back Button Logic
    useEffect(() => {
        let backButtonListener = null;
        let lastBackPress = 0;

        const setupBackButton = async () => {
            try {
                // Dynamically import to avoid issues in web-only mode
                const { App } = await import('@capacitor/app');
                const { Toast } = await import('@capacitor/toast');

                backButtonListener = await App.addListener('backButton', () => {
                    // Check if a modal is open first
                    if (modalOpenRef.current) {
                        setModalOpen(false);
                        return;
                    }

                    // Navigate based on current React state
                    setAppState(current => {
                        switch (current) {
                            case 'preview': return 'config';
                            case 'active': return 'preview';
                            case 'history': return 'config';
                            case 'calculator': return 'config';
                            case 'config':
                            default: {
                                // At root screen - double tap to exit
                                const now = Date.now();
                                if (now - lastBackPress < 2000) {
                                    App.exitApp();
                                } else {
                                    lastBackPress = now;
                                    Toast.show({ text: 'Tap back again to exit', duration: 'short' });
                                }
                                return current;
                            }
                        }
                    });
                });
            } catch {
                // Not running in Capacitor (e.g., web browser) - silently ignore
            }
        };

        setupBackButton();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, []);

    // --- Actions ---

    const generateWorkout = () => {
        const newWorkout = engineGenerate(config, lang);
        setWorkout(newWorkout);
        setAppState('preview');
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
        const isSaved = savedWorkouts.some(sw => sw.id === w.id);
        let updated;
        if (isSaved) {
            updated = savedWorkouts.filter(sw => sw.id !== w.id);
        } else {
            updated = [w, ...savedWorkouts];
        }
        setSavedWorkouts(updated);
        localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleTooltip = (e, text) => {
        if (!text) return;
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text });
    };

    const clearTooltip = () => setTooltip(null);

    const toggleLang = () => setLang(l => l === 'en' ? 'de' : 'en');

    // --- Value ---
    const value = {
        state: {
            appState,
            lang,
            config,
            workout,
            history,
            savedWorkouts,
            tooltip,
            modalOpen
        },
        actions: {
            setAppState,
            setLang,
            toggleLang,
            setConfig,
            setWorkout,
            setModalOpen,
            generateWorkout,
            swapExercise,
            saveToHistory,
            deleteHistoryEntry,
            clearHistory,
            toggleSaveWorkout,
            handleTooltip,
            clearTooltip
        }
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
