import { useEffect, useRef } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';
import { WorkoutProvider, useWorkout } from './WorkoutContext';

export const AppProvider = ({ children }) => {
    return (
        <SettingsProvider>
            <WorkoutProvider>
                <AppInnerProvider>
                    {children}
                </AppInnerProvider>
            </WorkoutProvider>
        </SettingsProvider>
    );
};

/**
 * Handles side effects that need both contexts (like back button)
 */
const AppInnerProvider = ({ children }) => {
    const { modalOpen, setModalOpen } = useSettings();
    const { setAppState } = useWorkout();
    const modalOpenRef = useRef(false);

    useEffect(() => {
        modalOpenRef.current = modalOpen;
    }, [modalOpen]);

    // Capacitor Back Button Logic
    useEffect(() => {
        let backButtonListener = null;
        let lastBackPress = 0;

        const setupBackButton = async () => {
            try {
                const { App } = await import('@capacitor/app');
                const { Toast } = await import('@capacitor/toast');

                backButtonListener = await App.addListener('backButton', () => {
                    if (modalOpenRef.current) {
                        setModalOpen(false);
                        return;
                    }

                    setAppState(current => {
                        switch (current) {
                            case 'preview': return 'config';
                            case 'active': return 'preview';
                            case 'history': return 'config';
                            case 'calculator': return 'config';
                            case 'config':
                            default: {
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
                // Not running in Capacitor
            }
        };

        setupBackButton();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, [setAppState, setModalOpen]);

    return children;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const settings = useSettings();
    const workout = useWorkout();

    return {
        state: {
            appState: workout.appState,
            lang: settings.lang,
            config: settings.config,
            workout: workout.workout,
            history: workout.history,
            savedWorkouts: workout.savedWorkouts,
            tooltip: settings.tooltip,
            modalOpen: settings.modalOpen
        },
        actions: {
            setAppState: workout.setAppState,
            setLang: settings.setLang,
            toggleLang: settings.toggleLang,
            setConfig: settings.setConfig,
            setWorkout: workout.setWorkout,
            setModalOpen: settings.setModalOpen,
            generateWorkout: workout.generateWorkout,
            swapExercise: workout.swapExercise,
            saveToHistory: workout.saveToHistory,
            deleteHistoryEntry: workout.deleteHistoryEntry,
            clearHistory: workout.clearHistory,
            toggleSaveWorkout: workout.toggleSaveWorkout,
            handleTooltip: settings.handleTooltip,
            clearTooltip: settings.clearTooltip
        }
    };
};