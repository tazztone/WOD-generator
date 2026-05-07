import { useState, useMemo } from 'react';
import { ChevronLeft, Share2, CheckCircle, Clock, RefreshCw, Play, XCircle, Info, Dumbbell, Activity, Flame } from 'lucide-react';
import { getExerciseName, isExerciseValid } from '../engine/generator';
import { EXERCISE_DB } from '../data/exercises';
import { LOCALES } from '../data/locales';
import { Button } from '../components/ui/Button';

export const PreviewScreen = ({ workout, config, onManualSwap, onStart, lang, onBack }) => {
    const [copied, setCopied] = useState(false);
    const [swapModal, setSwapModal] = useState({ show: false, index: -1 });
    const [infoModal, setInfoModal] = useState({ show: false, title: '', text: '' });
    const t = LOCALES[lang].previewScreen;

    const validExercises = useMemo(() => {
        return EXERCISE_DB.filter(ex => isExerciseValid(ex, config));
    }, [config]);

    // TODO: Add Web Share API support for native sharing on mobile devices
    // TODO: Add fallback sharing method for devices that don't support clipboard API
    const copyToClipboard = () => {
        const text = `WOD GEN\n${workout.template} - ${config.duration} Mins\n\n${workout.exercises.map(e => `${e.reps} ${getExerciseName(e.exercise, lang)}`).join('\n')}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getSwapCandidates = (index) => {
        const current = workout.exercises[index];
        return validExercises.filter(ex =>
            ex.pattern === current.exercise.pattern &&
            !workout.exercises.find(existing => existing.exercise.id === ex.id)
        );
    };

    const showInfo = (type) => {
        let title = "";
        let text = "";
        if (type === 'strength') { title = t.strengthTitle; text = t.strengthText; }
        if (type === 'metcon') { title = t.metconTitle; text = t.metconText; }
        if (type === 'warmup') { title = t.warmupTitle; text = t.warmupText; }
        if (type === 'swap') { title = t.swapTitle; text = t.swapText; }
        setInfoModal({ show: true, title, text });
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300 relative">
            {/* Info Modal */}
            {infoModal.show && (
                <div className="absolute inset-0 z-[60] bg-slate-900/95 backdrop-blur flex flex-col p-6 animate-in fade-in duration-200 justify-center items-center" onClick={() => setInfoModal({ show: false, title: '', text: '' })}>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-sm shadow-2xl relative w-full" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setInfoModal({ show: false, title: '', text: '' })} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle size={24} /></button>
                        <h3 className="text-xl font-black text-emerald-400 mb-4 flex items-center gap-2"><Info size={24} /> {infoModal.title}</h3>
                        <p className="text-slate-300 leading-relaxed text-sm">{infoModal.text}</p>
                    </div>
                </div>
            )}

            {/* Swap Modal */}
            {swapModal.show && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur flex flex-col p-4 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-black text-white italic">{t.selectSwap}</h3>
                        <button onClick={() => setSwapModal({ show: false, index: -1 })} className="p-2 bg-slate-800 rounded-full"><XCircle size={20} /></button>
                    </div>
                    <div className="mb-4 bg-slate-800/50 p-3 rounded-lg flex items-start gap-2 border border-slate-700/50">
                        <Info size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-400 leading-snug">{t.whySwap}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                        {getSwapCandidates(swapModal.index).map(ex => (
                            <button key={ex.id} onClick={() => { onManualSwap(swapModal.index, ex.id); setSwapModal({ show: false, index: -1 }); }}
                                className="w-full text-left p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-emerald-500 transition-all group relative overflow-hidden">
                                <div className="relative z-10 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-slate-200 block group-hover:text-emerald-400 text-lg mb-1">{getExerciseName(ex, lang)}</span>
                                        <div className="flex gap-2 items-center text-[10px] text-slate-500 uppercase tracking-widest">
                                            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{ex.equipment}</span>
                                            {ex.intensity === 'VeryHigh' && <span className="flex items-center gap-1 text-rose-500"><Flame size={10} /> Intense</span>}
                                        </div>
                                    </div>
                                    <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <RefreshCw size={20} />
                                    </div>
                                </div>
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
                    <div className="mb-6 bg-slate-800/40 border-l-4 border-purple-500 p-4 rounded-r-xl relative">
                        <button onClick={() => showInfo('strength')} className="absolute top-2 right-2 text-slate-600 hover:text-purple-400 transition-colors p-2">
                            <Info size={16} />
                        </button>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                <Dumbbell size={10} /> {t.partA} • {t.strength}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white">{workout.strength.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{workout.strength.sets} — {workout.strength.notes}</p>
                    </div>
                )}

                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        <Activity size={10} /> {t.partB} • {t.conditioning}
                        <button onClick={() => showInfo('metcon')} className="ml-1 text-slate-600 hover:text-emerald-500">
                            <Info size={12} />
                        </button>
                    </span>
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
                                <div key={idx} onClick={() => setSwapModal({ show: true, index: idx })} className="flex items-center justify-between group cursor-pointer bg-slate-800/30 p-2 -mx-2 rounded-lg hover:bg-slate-800 transition-colors">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-emerald-400 font-mono font-bold text-lg min-w-[40px] text-right">{item.reps}</span>
                                        <span className="text-slate-200 font-bold group-hover:text-emerald-300 transition-colors">{getExerciseName(item.exercise, lang)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider group-hover:text-slate-500">{item.exercise.pattern}</span>
                                        <RefreshCw size={12} className="text-slate-700 group-hover:text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-4 relative">
                    <button onClick={() => showInfo('warmup')} className="absolute top-2 right-2 text-slate-700 hover:text-slate-400 transition-colors p-2">
                        <Info size={14} />
                    </button>
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
