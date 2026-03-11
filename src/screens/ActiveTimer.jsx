import { useState, useEffect, useMemo } from 'react';
import { Trophy, XCircle, Volume2, VolumeX, ChevronLeft, Zap, Pause, Play, Settings2 } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Button } from '../components/ui/Button';

import { LOCALES } from '../data/locales';
import { useSettings } from '../context/SettingsContext';

export const ActiveTimer = ({ workout, onExit, onSave, lang, setModalOpen }) => {
    const { config, setConfig } = useSettings();
    const t = LOCALES[lang];
    const st = t.screens.activeTimer;
    const [showAudioSettings, setShowAudioSettings] = useState(false);

    const audioSettings = config?.audioSettings || { countdowns: true, announcements: true, beeps: true };

    useWakeLock();
    const { status, setStatus, timeLeft, totalTime, currentRound, setCurrentRound, isPaused, setIsPaused } = useTimer(workout, lang, audioSettings);

    const exerciseList = useMemo(() => {
        return workout.exercises.map(e => `${e.reps} ${e.exercise.name}`).join(' + ');
    }, [workout.exercises]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    useEffect(() => {
        if (status === 'finished') {
            setModalOpen(true);
        } else {
            setModalOpen(false);
        }
        return () => setModalOpen(false);
    }, [status, setModalOpen]);

    const [score, setScore] = useState('');

    // FINISHED SCREEN
    if (status === 'finished') {
        return (
            <div className="flex flex-col h-full items-center justify-center p-6 bg-slate-900 animate-in zoom-in-95">
                <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
                <h1 className="text-4xl font-black text-white italic mb-2">{st.greatJob}</h1>
                <p className="text-slate-400 mb-8">{st.completeMsg}</p>

                <div className="w-full bg-slate-800 p-4 rounded-xl mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">{st.score}</label>
                    <input
                        type="text"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder={workout.template === 'AMRAP' ? 'e.g. 5 Rounds + 10' : 'e.g. 12:45'}
                        className="w-full bg-transparent border-b border-slate-600 text-white text-xl py-2 focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <Button onClick={() => {
                    onSave({ ...workout, score: score || 'Completed', timeTaken: totalTime });
                    onExit();
                }} variant="primary" fullWidth className="mb-3">
                    {st.save}
                </Button>
                <Button onClick={onExit} variant="ghost">
                    {st.cancel}
                </Button>
            </div>
        );
    }

    const toggleAudioSetting = (key) => {
        setConfig({
            ...config,
            audioSettings: {
                ...config.audioSettings,
                [key]: !config.audioSettings[key]
            }
        });
    };

    // TIMER SCREEN
    return (
        <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${status === 'rest' ? 'bg-blue-900' : 'bg-slate-900'}`}>
            {/* Audio Settings Popover */}
            {showAudioSettings && (
                <div className="absolute inset-x-0 top-0 z-50 p-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-4 overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Audio Settings</span>
                            <button onClick={() => setShowAudioSettings(false)} className="text-slate-500 hover:text-white"><XCircle size={20} /></button>
                        </div>
                        
                        <div className="space-y-3">
                            {Object.entries(t.audioSettings).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => toggleAudioSetting(key)}
                                    className="w-full flex justify-between items-center group"
                                >
                                    <span className={`text-sm font-bold transition-colors ${config.audioSettings[key] ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${config.audioSettings[key] ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${config.audioSettings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                </button>
                            ))}
                            
                            <div className="pt-3 border-t border-slate-700 flex items-center gap-3">
                                <VolumeX size={16} className="text-slate-500" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={config.volume}
                                    onChange={(e) => setConfig({ ...config, volume: parseFloat(e.target.value) })}
                                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <Volume2 size={16} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Pulse */}
            {status === 'work' && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />}

            {/* Header */}
            <div className="flex justify-between items-center p-5 z-10">
                <button onClick={() => setStatus('finished')} className="p-2 bg-slate-800/50 rounded-full text-slate-400" aria-label={st.cancel}><XCircle size={20} /></button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAudioSettings(!showAudioSettings)} 
                        className={`p-2 rounded-full backdrop-blur-sm border transition-all ${showAudioSettings ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}
                        aria-label="Audio Settings"
                    >
                        <Settings2 size={20} />
                    </button>
                </div>
            </div>

            {/* Main Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
                <span className={`text-[15vw] font-black font-mono leading-none tracking-tighter ${status === 'rest' ? 'text-blue-300' : (status === 'pre' ? 'text-yellow-400' : 'text-white')}`}>
                    {status === 'pre' ? timeLeft : (workout.template === 'EMOM' || workout.template === 'Tabata' ? timeLeft : formatTime(timeLeft))}
                </span>
                <span className="text-xl font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">
                    {status === 'pre' ? 'GET READY' : (status === 'rest' ? st.rest : st.workMode)}
                </span>

                {/* Round Counter */}
                {(workout.rounds || workout.template === 'AMRAP') && (
                    <div className="mt-8 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{st.rounds}</span>
                        <div className="flex items-center gap-6 mt-2">
                            <button onClick={() => setCurrentRound(Math.max(1, currentRound - 1))} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700" aria-label="Previous Round"><ChevronLeft size={20} /></button>
                            <span className="text-4xl font-mono font-bold text-emerald-400">{currentRound}</span>
                            <button onClick={() => setCurrentRound(currentRound + 1)} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700" aria-label="Next Round"><ChevronLeft size={20} className="rotate-180" /></button>
                        </div>
                    </div>
                )}

                {/* Pause/Resume Button */}
                {status !== 'pre' && (
                    <div className="mt-8">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-black uppercase tracking-widest transition-all ${isPaused ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg' : 'bg-slate-800 text-slate-400'}`}
                            aria-label={isPaused ? "Resume Timer" : "Pause Timer"}
                        >
                            {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                    </div>
                )}
            </div>

            {/* Next Up / Current Movements */}
            <div className="p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-10">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
                    <Zap size={12} /> {st.next}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed font-medium">
                    {exerciseList}
                </div>
            </div>
        </div>
    );
};
