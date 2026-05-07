import { useState, useMemo } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';
import { LOCALES } from '../data/locales';
import { calculateOneRepMax, calculatePercentages } from '../engine/calculator';
import { Card } from '../components/ui/Card';

export const OneRepMaxScreen = ({ lang, onBack }) => {
  const t = LOCALES[lang];
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const oneRepMax = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (isNaN(w) || isNaN(r)) return 0;
    return calculateOneRepMax(w, r);
  }, [weight, reps]);

  const percentages = useMemo(() => calculatePercentages(oneRepMax), [oneRepMax]);

  return (
    <div className="flex flex-col h-full bg-slate-900 px-5 pt-3 pb-5 overflow-y-auto animate-fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-white italic flex items-center gap-2">
          <Calculator size={24} className="text-emerald-400" />
          {t.calculator}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.weight}</span>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-transparent text-2xl font-black text-emerald-400 focus:outline-none w-full placeholder-slate-700"
              placeholder="0"
              aria-label={t.weight}
            />
          </Card>
          <Card className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.reps}</span>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="bg-transparent text-2xl font-black text-emerald-400 focus:outline-none w-full placeholder-slate-700"
              placeholder="0"
              aria-label={t.reps}
            />
          </Card>
        </div>

        {oneRepMax > 0 && (
          <div className="space-y-6 animate-zoom-in duration-300 pb-10">
            <Card className="bg-emerald-500/10 border-emerald-500/30 text-center py-6">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                {t.estimated1RM}
              </span>
              <span className="text-5xl font-black text-white">{oneRepMax}</span>
            </Card>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">{t.percentages}</h3>
              <div className="grid grid-cols-3 gap-2">
                {percentages.map(({ percentage, value }) => (
                  <div
                    key={percentage}
                    className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center"
                  >
                    <div className="text-xs text-slate-500 font-bold">{percentage}%</div>
                    <div className="text-lg font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
