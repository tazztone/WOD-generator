import { useState, useEffect, useMemo } from 'react';
import { Trophy, XCircle, Volume2, VolumeX, ChevronLeft, Zap, Pause, Play } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Button } from '../components/ui/Button';

import { LOCALES } from '../data/locales';

export const ActiveTimer = ({ workout, onExit, onSave, lang, setModalOpen }) => {
    const t = LOCALES[lang].screens.activeTimer;
    const [voiceEnabled, setVoiceEnabled] = useState(() => {
        try {
            const saved = localStorage.getItem('voiceEnabled');
            return saved !== null ? saved === 'true' : true;
        } catch (err) {
            console.warn('Failed to load voice preference', err);
            return true;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('voiceEnabled', voiceEnabled);
        } catch (err) {
            console.warn('Failed to save voice preference', err);
        }
    }, [voiceEnabled]);

    useWakeLock();
    const { status, setStatus, timeLeft, totalTime, currentRound, setCurrentRound, isPaused, setIsPaused } = useTimer(workout, lang, voiceEnabled);

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
                <h1 className="text-4xl font-black text-white italic mb-2">{t.greatJob}</h1>
                <p className="text-slate-400 mb-8">{t.completeMsg}</p>

                <div className="w-full bg-slate-800 p-4 rounded-xl mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">{t.score}</label>
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
                    {t.save}
                </Button>
                <Button onClick={onExit} variant="ghost">
                    {t.cancel}
                </Button>
            </div>
        );
    }

    // TIMER SCREEN
    return (
        <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${status === 'rest' ? 'bg-blue-900' : 'bg-slate-900'}`}>
            {/* Background Pulse */}
            {status === 'work' && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />}

            {/* Header */}
            <div className="flex justify-between items-center p-5 z-10">
                <button onClick={() => setStatus('finished')} className="p-2 bg-slate-800/50 rounded-full text-slate-400"><XCircle size={20} /></button>
                <div className="flex gap-4">
                    <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-full ${voiceEnabled ? 'text-white bg-slate-700' : 'text-slate-500'}`}>
                        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>
            </div>

            {/* Main Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
                <span className={`text-[15vw] font-black font-mono leading-none tracking-tighter ${status === 'rest' ? 'text-blue-300' : (status === 'pre' ? 'text-yellow-400' : 'text-white')}`}>
                    {status === 'pre' ? timeLeft : (workout.template === 'EMOM' || workout.template === 'Tabata' ? timeLeft : formatTime(timeLeft))}
                </span>
                <span className="text-xl font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">
                    {status === 'pre' ? 'GET READY' : (status === 'rest' ? t.rest : t.workMode)}
                </span>

                {/* Round Counter */}
                {(workout.rounds || workout.template === 'AMRAP') && (
                    <div className="mt-8 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.rounds}</span>
                        <div className="flex items-center gap-6 mt-2">
                            <button onClick={() => setCurrentRound(Math.max(1, currentRound - 1))} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700"><ChevronLeft size={20} /></button>
                            <span className="text-4xl font-mono font-bold text-emerald-400">{currentRound}</span>
                            <button onClick={() => setCurrentRound(currentRound + 1)} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700"><ChevronLeft size={20} className="rotate-180" /></button>
                        </div>
                    </div>
                )}

                {/* Pause/Resume Button */}
                {status !== 'pre' && (
                    <div className="mt-8">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-black uppercase tracking-widest transition-all ${isPaused ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg' : 'bg-slate-800 text-slate-400'}`}
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
                    <Zap size={12} /> {t.next}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed font-medium">
                    {exerciseList}
                </div>
            </div>
        </div>
    );
};
