import React, { useState } from 'react';
import { ChevronLeft, Share2, CheckCircle, Clock, RefreshCw, Play, XCircle } from 'lucide-react';
import { getExerciseName, isExerciseValid } from '../engine/generator';
import { EXERCISE_DB } from '../data/exercises';
import { Button } from '../components/ui/Button';

// Temporary T
const T = {
    en: {
        back: "Back",
        partA: "Part A",
        partB: "Part B",
        strength: "Strength",
        conditioning: "Conditioning",
        share: "Share",
        copied: "Copied",
        min: "Mins",
        rounds: "Rounds",
        warmup: "Warmup Protocol",
        start: "Start Timer",
        selectSwap: "Select Replacement"
    },
    de: {
        back: "Zurück",
        partA: "Teil A",
        partB: "Teil B",
        strength: "Kraft",
        conditioning: "Ausdauer",
        share: "Teilen",
        copied: "Kopiert",
        min: "Min",
        rounds: "Runden",
        warmup: "Aufwärm-Protokoll",
        start: "Timer Starten",
        selectSwap: "Ersatz wählen"
    }
};

const APP_VERSION = "";

export const PreviewScreen = ({ workout, config, onManualSwap, onStart, lang, onBack }) => {
    const [copied, setCopied] = useState(false);
    const [swapModal, setSwapModal] = useState({ show: false, index: -1 });
    const t = T[lang];

    const copyToClipboard = () => {
        const text = `WOD GEN\n${workout.template} - ${config.duration} Mins\n\n${workout.exercises.map(e => `${e.reps} ${getExerciseName(e.exercise, lang)}`).join('\n')}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getSwapCandidates = (index) => {
        const current = workout.exercises[index];
        return EXERCISE_DB.filter(ex =>
            ex.pattern === current.exercise.pattern &&
            isExerciseValid(ex, config) &&
            !workout.exercises.find(existing => existing.exercise.id === ex.id)
        );
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300 relative">
            {swapModal.show && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur flex flex-col p-4 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black text-white italic">{t.selectSwap}</h3>
                        <button onClick={() => setSwapModal({ show: false, index: -1 })} className="p-2 bg-slate-800 rounded-full"><XCircle size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {getSwapCandidates(swapModal.index).map(ex => (
                            <button key={ex.id} onClick={() => { onManualSwap(swapModal.index, ex.id); setSwapModal({ show: false, index: -1 }); }}
                                className="w-full text-left p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-emerald-500 transition-all group">
                                <span className="font-bold text-slate-200 block group-hover:text-emerald-400">{getExerciseName(ex, lang)}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{ex.equipment}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1 p-5 overflow-y-auto pb-32">
                <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                    <ChevronLeft size={14} /> {t.back}
                </button>

                {workout.strength && (
                    <div className="mb-6 bg-slate-800/40 border-l-4 border-purple-500 p-4 rounded-r-xl">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{t.partA} • {t.strength}</span>
                        </div>
                        <h3 className="text-xl font-black text-white">{workout.strength.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{workout.strength.sets} — {workout.strength.notes}</p>
                    </div>
                )}

                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t.partB} • {t.conditioning}</span>
                    <button onClick={copyToClipboard} className="text-xs flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors">
                        {copied ? <CheckCircle size={12} /> : <Share2 size={12} />} {copied ? t.copied : t.share}
                    </button>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-5 mb-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">{workout.template}</h2>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-mono font-bold">
                            <span className="flex items-center gap-1"><Clock size={12} /> {config.duration} {t.min}</span>
                            {workout.rounds && <span>• {workout.rounds} {t.rounds}</span>}
                        </div>

                        <div className="mt-6 space-y-3">
                            {workout.exercises.map((item, idx) => (
                                <div key={idx} onClick={() => setSwapModal({ show: true, index: idx })} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-emerald-400 font-mono font-bold text-lg min-w-[30px] text-right">{item.reps}</span>
                                        <span className="text-slate-200 font-bold group-hover:text-emerald-300 transition-colors">{getExerciseName(item.exercise, lang)}</span>
                                    </div>
                                    <RefreshCw size={12} className="text-slate-700 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">{t.warmup}</span>
                    <ul className="space-y-1">
                        {workout.warmup.map((line, i) => (
                            <li key={i} className="text-xs text-slate-400 flex gap-2"><div className="w-1 h-1 bg-slate-600 rounded-full mt-1.5 shrink-0" /> {line}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                <Button onClick={onStart} size="lg" fullWidth>
                    <Play size={24} fill="currentColor" /> {t.start}
                </Button>
            </div>
        </div>
    );
};
