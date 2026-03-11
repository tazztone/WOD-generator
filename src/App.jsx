// TODO: Add React Error Boundary wrapper to gracefully handle runtime errors (Done in main.jsx)
import { Shell, Header } from './components/layout/Layout';
import { Tooltip } from './components/ui/Tooltip';
import { ConfigScreen } from './screens/ConfigScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { ActiveTimer } from './screens/ActiveTimer';
import { HistoryScreen } from './screens/HistoryScreen';
import { OneRepMaxScreen } from './screens/OneRepMaxScreen';
import { useAppContext } from './context/AppContext';
import { UpdatePrompt } from './components/common/UpdatePrompt';

export default function CrossFitGenerator() {
    const { state, actions } = useAppContext();
    const {
        appState,
        lang,
        config,
        workout,
        history,
        savedWorkouts,
        tooltip,
        modalOpen
    } = state;

    const {
        setAppState,
        toggleLang,
        setConfig,
        setWorkout,
        setModalOpen,
        generateWorkout,
        clearWorkout,
        swapExercise,
        saveToHistory,
        deleteHistoryEntry,
        clearHistory,
        toggleSaveWorkout,
        handleTooltip,
        clearTooltip
    } = actions;

    return (
        <Shell>
            <UpdatePrompt />
            {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} text={tooltip.text} />}

            <Header
                onBack={clearWorkout}
                onLangToggle={toggleLang}
                onHistory={() => setAppState('history')}
                onCalculator={() => setAppState('calculator')}
                lang={lang}
                appState={appState}
            />

            <main className="flex-1 flex flex-col relative overflow-hidden" onClick={clearTooltip}>
                {appState === 'config' && (
                    <ConfigScreen
                        config={config}
                        setConfig={setConfig}
                        onGenerate={generateWorkout}
                        lang={lang}
                        onTooltip={handleTooltip}
                    />
                )}
                {appState === 'preview' && workout && (
                    <PreviewScreen
                        workout={workout}
                        config={config}
                        onManualSwap={swapExercise}
                        onStart={() => setAppState('active')}
                        lang={lang}
                        onBack={clearWorkout}
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        isSaved={savedWorkouts.some(sw => sw.id === workout.id)}
                        onToggleSave={() => toggleSaveWorkout(workout)}
                        onTooltip={handleTooltip}
                    />
                )}
                {appState === 'active' && workout && (
                    <ActiveTimer
                        workout={workout}
                        onExit={() => setAppState('preview')}
                        onSave={saveToHistory}
                        lang={lang}
                        setModalOpen={setModalOpen}
                    />
                )}
                {appState === 'history' && (
                    <HistoryScreen
                        history={history}
                        savedWorkouts={savedWorkouts}
                        onDeleteEntry={deleteHistoryEntry}
                        onDeleteSaved={(id) => toggleSaveWorkout({ id })}
                        onStartWorkout={(w) => { setWorkout(w); setAppState('active'); }}
                        clearHistory={clearHistory}
                        onBack={() => setAppState('config')}
                        lang={lang}
                    />
                )}
                {appState === 'calculator' && (
                    <OneRepMaxScreen
                        lang={lang}
                        onBack={() => setAppState('config')}
                    />
                )}
            </main>
        </Shell>
    );
}