
import { useMemo } from 'react';
import { ArrowLeft, Trash2, History as HistoryIcon } from 'lucide-react';

// TODO: Add swipe-to-delete for individual history entries
// TODO: Add ability to repeat/re-run a past workout
const T = {
    en: {
        logbook: "Logbook",
        noLogs: "No workouts logged yet.",
        confirmClear: "Are you sure you want to delete all entries?"
    },
    de: {
        logbook: "Logbuch",
        noLogs: "Noch keine Workouts gespeichert.",
        confirmClear: "Möchten Sie wirklich alle Einträge löschen?"
    }
};

export const HistoryScreen = ({ history, clearHistory, onBack, lang }) => {
    const t = T[lang];

    const handleClearHistory = () => {
        if (window.confirm(t.confirmClear)) {
            clearHistory();
        }
    };

    const formattedHistory = useMemo(() => {
        return history.map(entry => ({
            ...entry,
            formattedDate: new Date(entry.date).toLocaleDateString()
        }));
    }, [history]);

    return (
        <div className="flex flex-col h-full bg-slate-900 p-5">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-slate-400 hover:text-white"><ArrowLeft size={24} /></button>
                <h2 className="text-xl font-black text-white italic">{t.logbook}</h2>
                <button onClick={handleClearHistory} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {/* TODO: Add tap to expand and see full workout details */}
                {history.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">
                        <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>{t.noLogs}</p>
                    </div>
                ) : formattedHistory.map(entry => (
                    <div key={entry.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-emerald-400 font-black italic uppercase">{entry.template}</span>
                            <span className="text-xs text-slate-500">{entry.formattedDate}</span>
                        </div>
                        <div className="text-white font-bold text-lg mb-2">{entry.score}</div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                            {entry.exercises.map(e => e.exercise.name).join(', ')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
