import React, { useState, useEffect } from 'react';
import { Shell, Header } from './components/layout/Layout';
import { Tooltip } from './components/ui/Tooltip';
import { ConfigScreen } from './screens/ConfigScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { ActiveTimer } from './screens/ActiveTimer';
import { HistoryScreen } from './screens/HistoryScreen';
import { generateWorkout, swapExercise, isExerciseValid } from './engine/generator';
import { loadConfig, saveConfig, HISTORY_STORAGE_KEY } from './engine/storage';

export default function CrossFitGenerator() {
    const [appState, setAppState] = useState('config'); // config, preview, active, history
    const [lang, setLang] = useState('en');
    const [config, setConfig] = useState(loadConfig());

    const [workout, setWorkout] = useState(null);
    const [history, setHistory] = useState([]);
    const [tooltip, setTooltip] = useState(null);

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Handle Browser Back Button
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state?.appState) {
                setAppState(event.state.appState);
            } else {
                setAppState('config'); // Default fallback
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Sync state to History
    useEffect(() => {
        // If current state is different from history state, push it
        if (window.history.state?.appState !== appState) {
            window.history.pushState({ appState }, '', '');
        }
    }, [appState]);

    // Save Config on Change
    useEffect(() => {
        saveConfig(config);
    }, [config]);

    const saveToHistory = (result) => {
        const newEntry = { ...result, id: Date.now(), date: new Date().toISOString() };
        const updated = [newEntry, ...history];
        setHistory(updated);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleGenerate = () => {
        const newWorkout = generateWorkout(config, lang);
        setWorkout(newWorkout);
        setAppState('preview');
    };

    const handleManualSwap = (index, newExId) => {
        if (!workout) return;
        const updatedWorkout = swapExercise(workout, index, newExId, config, lang);
        setWorkout(updatedWorkout);
    };

    // Tooltip Logic
    const handleTooltip = (e, text) => {
        if (!text) return;
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text });
    };
    const clearTooltip = () => setTooltip(null);

    return (
        <Shell>
            {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} text={tooltip.text} />}

            <Header
                onBack={() => setAppState('config')}
                onLangToggle={() => setLang(l => l === 'en' ? 'de' : 'en')}
                onHistory={() => setAppState('history')}
                lang={lang}
                appState={appState}
            />

            <main className="flex-1 flex flex-col relative overflow-hidden" onClick={clearTooltip}>
                {appState === 'config' && (
                    <ConfigScreen
                        config={config}
                        setConfig={setConfig}
                        onGenerate={handleGenerate}
                        lang={lang}
                        onTooltip={handleTooltip}
                    />
                )}
                {appState === 'preview' && workout && (
                    <PreviewScreen
                        workout={workout}
                        config={config}
                        onManualSwap={handleManualSwap}
                        onStart={() => setAppState('active')}
                        lang={lang}
                        onBack={() => setAppState('config')}
                    />
                )}
                {appState === 'active' && workout && (
                    <ActiveTimer
                        workout={workout}
                        onExit={() => setAppState('preview')}
                        onSave={saveToHistory}
                        lang={lang}
                    />
                )}
                {appState === 'history' && (
                    <HistoryScreen
                        history={history}
                        clearHistory={() => { setHistory([]); localStorage.removeItem(HISTORY_STORAGE_KEY); }}
                        onBack={() => setAppState('config')}
                        lang={lang}
                    />
                )}
            </main>
        </Shell>
    );
}
