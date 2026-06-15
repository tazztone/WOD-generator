import { useCapacitorBackButton } from '../hooks/useCapacitorBackButton';
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
    useCapacitorBackButton();

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
            unit: settings.unit,
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
            toggleUnit: settings.toggleUnit,
            setConfig: settings.setConfig,
            setWorkout: workout.setWorkout,
            setModalOpen: settings.setModalOpen,
            generateWorkout: workout.generateWorkout,
            clearWorkout: workout.clearWorkout,
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