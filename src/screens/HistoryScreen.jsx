import { useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Star, History } from 'lucide-react';
import { LOCALES } from '../data/locales';
import { getExerciseName, formatReps } from '../engine/generator';

export const HistoryScreen = ({
  history,
  savedWorkouts,
  onDeleteEntry,
  onDeleteSaved,
  onStartWorkout,
  clearHistory,
  onBack,
  lang,
}) => {
  const t = LOCALES[lang].screens.history;
  const [activeTab, setActiveTab] = useState('history'); // history, saved
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const handleClearHistory = () => {
    if (window.confirm(t.confirmClear)) {
      clearHistory();
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e, id) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      setSwipedId(id);
    } else if (diff < -50) {
      setSwipedId(null);
    }
  };

  const formattedHistory = useMemo(() => {
    return history.map((entry) => ({
      ...entry,
      formattedDate: new Date(entry.date).toLocaleDateString(),
    }));
  }, [history]);

  return (
    <div className="flex flex-col h-full bg-slate-900 px-5 pt-3 pb-5 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-white italic">{t.logbook}</h2>
        <button onClick={handleClearHistory} className="text-red-400 hover:text-red-300">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
        <button
          onClick={() => {
            setActiveTab('history');
            setSwipedId(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-500'}`}
        >
          {t.history}
        </button>
        <button
          onClick={() => {
            setActiveTab('saved');
            setSwipedId(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'saved' ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-500'}`}
        >
          {t.saved}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {activeTab === 'history' ? (
          history.length === 0 ? (
            <div className="text-center text-slate-500 mt-20">
              <History size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t.noLogs}</p>
            </div>
          ) : (
            formattedHistory.map((entry) => (
              <div key={entry.id} className="relative">
                <div
                  className={`absolute inset-0 bg-red-500 rounded-xl flex items-center justify-end pr-6 transition-opacity ${swipedId === entry.id ? 'opacity-100' : 'opacity-0'}`}
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  <Trash2 size={20} className="text-white" />
                </div>

                <div
                  className={`bg-slate-800 p-4 rounded-xl border border-slate-700 relative z-10 transition-transform duration-300 ${swipedId === entry.id ? '-translate-x-16' : 'translate-x-0'}`}
                  onTouchStart={(e) => handleTouchStart(e)}
                  onTouchMove={(e) => handleTouchMove(e, entry.id)}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-black italic uppercase">
                        {entry.template}
                      </span>
                      {entry.timeTaken && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">
                          {formatDuration(entry.timeTaken)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{entry.formattedDate}</span>
                  </div>
                  <div className="text-white font-bold text-lg mb-2">{entry.score}</div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {entry.exercises
                      .map(
                        (e) =>
                          `${formatReps(e.reps, e.exercise)} ${getExerciseName(e.exercise, lang)}`
                      )
                      .join(', ')}
                  </p>
                </div>
              </div>
            ))
          )
        ) : savedWorkouts.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            <Star size={48} className="mx-auto mb-4 opacity-20" />
            <p>{t.noSaved}</p>
          </div>
        ) : (
          savedWorkouts.map((workout) => (
            <div key={workout.id} className="relative">
              <div
                className={`absolute inset-0 bg-red-500 rounded-xl flex items-center justify-end pr-6 transition-opacity ${swipedId === workout.id ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => onDeleteSaved(workout.id)}
              >
                <Trash2 size={20} className="text-white" />
              </div>

              <div
                className={`bg-slate-800 p-4 rounded-xl border border-slate-700 relative z-10 transition-transform duration-300 ${swipedId === workout.id ? '-translate-x-16' : 'translate-x-0'}`}
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchMove={(e) => handleTouchMove(e, workout.id)}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-emerald-400 font-black italic uppercase">
                    {workout.template}
                  </span>
                  <span className="text-xs text-slate-500">{workout.timeCap} min</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {workout.exercises
                    .map(
                      (e) =>
                        `${formatReps(e.reps, e.exercise)} ${getExerciseName(e.exercise, lang)}`
                    )
                    .join(', ')}
                </p>
                <button
                  onClick={() => onStartWorkout(workout)}
                  className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  {t.start}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
