import { Globe, History as HistoryIcon, Calculator } from 'lucide-react';

export const Shell = ({ children }) => {
  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md mx-auto min-h-[100dvh] shadow-2xl overflow-hidden flex flex-col relative bg-slate-900/50">
        {children}
      </div>
    </div>
  );
};

export const Header = ({ onBack, onLangToggle, onHistory, onCalculator, lang, appState }) => {
  return (
    <header
      className="px-5 pb-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex justify-between items-center sticky top-0 z-30"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
    >
      <div onClick={onBack} className="cursor-pointer group">
        <h1 className="text-xl font-black italic tracking-tighter text-emerald-400">WOD GEN</h1>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onLangToggle}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700 flex items-center gap-1"
        >
          <Globe size={14} /> {lang.toUpperCase()}
        </button>
        <button
          onClick={onCalculator}
          className={`p-2 rounded-full transition-all ${appState === 'calculator' ? 'bg-slate-700 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Calculator size={18} />
        </button>
        <button
          onClick={onHistory}
          className={`p-2 rounded-full transition-all ${appState === 'history' ? 'bg-slate-700 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <HistoryIcon size={18} />
        </button>
      </div>
    </header>
  );
};
