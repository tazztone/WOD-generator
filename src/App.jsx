import React, { useState, useEffect } from 'react';
import { Shell, Header } from './components/layout/Layout';
import { ConfigScreen } from './screens/ConfigScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { ActiveTimer } from './screens/ActiveTimer';
import { HistoryScreen } from './screens/HistoryScreen';
import { generateWorkout, swapExercise, isExerciseValid } from './engine/generator';
import { loadConfig, saveConfig } from './engine/storage';

export default function CrossFitGenerator() {
    const [appState, setAppState] = useState('config'); // config, preview, active, history
    const [lang, setLang] = useState('en');
    const [config, setConfig] = useState(loadConfig());

    const [workout, setWorkout] = useState(null);
    const [history, setHistory] = useState([]);
    const [tooltip, setTooltip] = useState(null);

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem('wod_history_v7');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Save Config on Change
    useEffect(() => {
        saveConfig(config);
    }, [config]);

    const saveToHistory = (result) => {
        const newEntry = { ...result, id: Date.now(), date: new Date().toISOString() };
        const updated = [newEntry, ...history];
        setHistory(updated);
        localStorage.setItem('wod_history_v7', JSON.stringify(updated));
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
            {tooltip && (
                <div className="fixed z-[100] px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl border border-slate-600 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 animate-in fade-in zoom-in-95 duration-200 max-w-[250px] text-center"
                    style={{ left: tooltip.x, top: tooltip.y }}>
                    {tooltip.text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
            )}

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
                        clearHistory={() => { setHistory([]); localStorage.removeItem('wod_history_v7'); }}
                        onBack={() => setAppState('config')}
                        lang={lang}
                    />
                )}
            </main>
        </Shell>
    );
}
