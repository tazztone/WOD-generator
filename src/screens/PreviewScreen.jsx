import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, Share2, CheckCircle, Clock, RefreshCw, Play, XCircle, Info, Dumbbell, Activity, Flame, Star, HelpCircle, Dice5 } from 'lucide-react';
import { getExerciseName, isExerciseValid, formatReps } from '../engine/generator';
import { EXERCISE_DB } from '../data/exercises';
import { Button } from '../components/ui/Button';

import { LOCALES } from '../data/locales';

export const PreviewScreen = ({
    workout,
    config,
    onManualSwap,
    onStart,
    lang,
    onBack,
    isSaved,
    onToggleSave,
    modalOpen,
    setModalOpen,
    onTooltip,
    onReroll
}) => {
    const [copied, setCopied] = useState(false);
    const [swapModal, setSwapModal] = useState({ show: false, index: -1 });
    const [isRerollConfirmed, setIsRerollConfirmed] = useState(false);
    const rerollTimerRef = useRef(null);
    const t = LOCALES[lang];
    const pt = t.screens.preview;
    const explanations = pt.explanations;

    const validExercises = useMemo(() => {
        return EXERCISE_DB.filter(ex => isExerciseValid(ex, config));
    }, [config]);

    // Sync internal modal state with global App state to support Android back button
    useEffect(() => {
        if (swapModal.show) {
            setModalOpen(true);
        } else {
            setModalOpen(false);
        }
    }, [swapModal.show, setModalOpen]);

    // If global modalOpen is closed (e.g. by back button), close local modals
    useEffect(() => {
        if (!modalOpen) {
            setSwapModal({ show: false, index: -1 });
        }
    }, [modalOpen]);

    const handleReroll = () => {
        if (isRerollConfirmed) {
            onReroll();
            setIsRerollConfirmed(false);
            if (rerollTimerRef.current) clearTimeout(rerollTimerRef.current);
        } else {
            setIsRerollConfirmed(true);
            if (rerollTimerRef.current) clearTimeout(rerollTimerRef.current);
            rerollTimerRef.current = setTimeout(() => {
                setIsRerollConfirmed(false);
            }, 2000);
        }
    };

    useEffect(() => {
        return () => {
            if (rerollTimerRef.current) clearTimeout(rerollTimerRef.current);
        };
    }, []);

    const handleShare = () => {
        let text = `*** WOD GENERATOR ***\n\n`;

        if (workout.strength) {
            const strengthName = workout.strength.nameKey ? (LOCALES.strength.names[workout.strength.nameKey][lang] || workout.strength.nameKey) : workout.strength.name;
            const strengthNote = workout.strength.noteKey ? (LOCALES.strength.notes[workout.strength.noteKey][lang] || workout.strength.noteKey) : workout.strength.notes;
            text += `PART A: STRENGTH\n`;
            text += `${strengthName}\n`;
            text += `${workout.strength.sets}\n`;
            text += `* ${strengthNote}\n\n`;
        }

        text += `PART B: METCON (${workout.template})\n`;
        if (workout.isPartner) text += `(PARTNER WORKOUT)\n`;
        if (workout.rounds) text += `${workout.rounds} Rounds / ${config.duration} Min Cap\n`;
        else text += `${config.duration} Minute Time Cap\n`;
        text += `\n`;

        if (workout.buyIn) {
            const buyInName = getExerciseName(workout.buyIn.exercise, lang);
            const buyInReps = formatReps(workout.buyIn.reps, workout.buyIn.exercise);
            text += `Buy-In: ${buyInReps} ${buyInName}\n\n`;
        }

        text += workout.exercises.map(e => `${formatReps(e.reps, e.exercise)} ${getExerciseName(e.exercise, lang)}`).join('\n');

        if (navigator.share) {
            navigator.share({
                title: 'Workout of the Day',
                text: text
            }).catch(() => {
                // Ignore errors or fallback to clipboard on cancel
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const getSwapCandidates = (index) => {
        const current = workout.exercises[index];
        const existingIds = new Set(workout.exercises.map(item => item.exercise.id));
        return validExercises.filter(ex =>
            ex.pattern === current.exercise.pattern &&
            !existingIds.has(ex.id)
        );
    };

    return (
        <div className="flex flex-col h-full animate-zoom-in duration-300 relative">
            {/* Swap Modal */}
            {swapModal.show && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur flex flex-col p-4 animate-fade-in duration-200">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-black text-white italic">{pt.selectSwap}</h3>
                        <button onClick={() => setSwapModal({ show: false, index: -1 })} className="p-2 bg-slate-800 rounded-full"><XCircle size={20} /></button>
                    </div>
                    <div className="mb-4 bg-slate-800/50 p-3 rounded-lg flex items-start gap-2 border border-slate-700/50">
                        <Info size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-400 leading-snug">{pt.whySwap}</p>
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

            <div className="flex-1 px-5 pt-3 overflow-y-auto pb-32">
                <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                    <ChevronLeft size={14} /> {pt.back}
                </button>

                {workout.strength && (
                    <div className="mb-6 bg-slate-800/40 border-l-4 border-purple-500 p-4 rounded-r-xl relative">
                        <button onClick={(e) => onTooltip(e, explanations.strengthText)} className="absolute top-2 right-2 text-slate-600 hover:text-purple-400 transition-colors p-2">
                            <Info size={16} />
                        </button>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                <Dumbbell size={10} /> {pt.partA} • {pt.strength}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white">
                            {workout.strength.nameKey ? (LOCALES.strength.names[workout.strength.nameKey][lang] || workout.strength.nameKey) : workout.strength.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {workout.strength.sets} — {workout.strength.noteKey ? (LOCALES.strength.notes[workout.strength.noteKey][lang] || workout.strength.noteKey) : workout.strength.notes}
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        <Activity size={10} /> {pt.partB} • {pt.conditioning}
                        <button onClick={(e) => onTooltip(e, explanations.metconText)} className="ml-1 text-slate-600 hover:text-emerald-500">
                            <Info size={12} />
                        </button>
                    </span>
                    <button onClick={handleShare} className="text-xs flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors mr-3">
                        {copied ? <CheckCircle size={12} /> : <Share2 size={12} />} {copied ? pt.copied : pt.share}
                    </button>
                    <button onClick={onToggleSave} className={`text-xs flex items-center gap-1 transition-colors ${isSaved ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'}`}>
                        <Star size={12} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? pt.saved : pt.save}
                    </button>
                    <button onClick={handleReroll} className={`text-xs flex items-center gap-1 transition-all duration-300 ${isRerollConfirmed ? 'text-rose-500 font-black animate-pulse' : 'text-slate-500 hover:text-emerald-400'}`}>
                        <Dice5 size={12} className={isRerollConfirmed ? 'rotate-180 transition-transform duration-500' : ''} /> {isRerollConfirmed ? pt.rerollConfirm : pt.reroll}
                    </button>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-5 mb-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">
                            {workout.isPartner && <span className="text-emerald-500 not-italic mr-2">Partner</span>}
                            {workout.template}
                        </h2>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-mono font-bold">
                            <span className="flex items-center gap-1"><Clock size={12} /> {config.duration} {pt.min}</span>
                            {workout.rounds && <span>• {workout.rounds} {pt.rounds}</span>}
                        </div>

                        {workout.buyIn && (
                            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Buy-In</span>
                                    <button onClick={(e) => onTooltip(e, t.tt.buyIn)} className="text-emerald-500/50 hover:text-emerald-500 transition-colors">
                                        <HelpCircle size={10} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-200">{getExerciseName(workout.buyIn.exercise, lang)}</span>
                                    <span className="text-sm font-mono font-bold text-emerald-400">
                                        {formatReps(workout.buyIn.reps, workout.buyIn.exercise)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 space-y-3">
                            {workout.exercises.map((item, idx) => (
                                <div key={idx} onClick={() => setSwapModal({ show: true, index: idx })} className="flex items-center justify-between group cursor-pointer bg-slate-800/30 p-2 -mx-2 rounded-lg hover:bg-slate-800 transition-colors">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-emerald-400 font-mono font-bold text-lg min-w-[40px] text-right">
                                            {formatReps(item.reps, item.exercise)}
                                        </span>
                                        <span className="text-slate-200 font-bold group-hover:text-emerald-300 transition-colors">{getExerciseName(item.exercise, lang)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider group-hover:text-slate-500">{item.exercise.pattern}</span>
                                        <RefreshCw size={12} className="text-slate-500 group-hover:text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {workout.warmup && workout.warmup.length > 0 && (
                    <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-4 relative">
                        <button onClick={(e) => onTooltip(e, explanations.warmupText)} className="absolute top-2 right-2 text-slate-700 hover:text-slate-400 transition-colors p-2">
                            <Info size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">{pt.warmup}</span>
                        <ul className="space-y-1">
                            {workout.warmup.map((keyStr, i) => {
                                // Support new dynamic cardio string: "dynamicCardio|duration|intensity"
                                const parts = keyStr.split('|');
                                const key = parts[0];
                                const duration = parts[1];
                                const intensity = parts[2];

                                let text = keyStr;
                                if (LOCALES.warmup[key]) {
                                    text = LOCALES.warmup[key][lang] || key;

                                    // Handle dynamic values if provided
                                    if (key === 'dynamicCardio' && duration && intensity) {
                                        // Simple translation for intensity if possible
                                        let localizedIntensity = intensity;
                                        if (lang === 'de') {
                                            if (intensity === 'Easy') localizedIntensity = 'Leicht';
                                            if (intensity === 'Moderate') localizedIntensity = 'Moderat';
                                            if (intensity === 'Hard') localizedIntensity = 'Hart';
                                        }
                                        text = `${duration} min Cardio (${localizedIntensity})`;
                                    }
                                }

                                return (
                                    <li key={i} className="text-xs text-slate-400 flex gap-2">
                                        <div className="w-1 h-1 bg-slate-600 rounded-full mt-1.5 shrink-0" />
                                        {text}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                <Button onClick={onStart} size="lg" fullWidth data-testid="start-btn">
                    <Play size={24} fill="currentColor" /> {pt.start}
                </Button>
            </div>
        </div >
    );
};
