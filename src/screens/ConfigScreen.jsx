
import { Activity, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

import { LOCALES } from '../data/locales';
import { DEFAULT_CONFIG } from '../engine/storage';

// TODO: Add form validation - ensure at least one equipment type is selected
export const ConfigScreen = ({ config, setConfig, onGenerate, lang, onTooltip }) => {
    const t = LOCALES[lang];

    const toggleAvoid = (key) => {
        setConfig(prev => ({
            ...prev,
            avoid: prev.avoid.includes(key) ? prev.avoid.filter(k => k !== key) : [...prev.avoid, key]
        }));
    };

    const toggleEquipment = (key) => {
        setConfig(prev => ({
            ...prev,
            equipment: { ...prev.equipment, [key]: !prev.equipment[key] }
        }));
    };

    return (
        <div className="p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pb-24">
            {/* Time & Movements */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-400">{t.duration}</span>
                        <span className="text-emerald-400 font-mono font-bold">{config.duration}m</span>
                    </div>
                    <input type="range" min="5" max="60" step="5" value={config.duration} onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </Card>
                <Card className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-400">{t.movements}</span>
                        <span className="text-emerald-400 font-mono font-bold">{config.numExercises}</span>
                    </div>
                    <input type="range" min="2" max="6" step="1" value={config.numExercises} onChange={(e) => setConfig({ ...config, numExercises: parseInt(e.target.value) })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </Card>
            </div>

            {/* Style & Level */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.style}</span>
                    <select value={config.templateType} onChange={(e) => setConfig({ ...config, templateType: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white focus:ring-1 focus:ring-emerald-500">
                        <option value="Random">{t.random}</option>
                        <option value="AMRAP">AMRAP</option>
                        <option value="RFT">RFT (Time)</option>
                        <option value="EMOM">EMOM</option>
                        <option value="Chipper">{t.chipper}</option>
                        <option value="Tabata">{t.tabata}</option>
                    </select>
                </div>
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.level}</span>
                    <select value={config.difficulty} onChange={(e) => setConfig({ ...config, difficulty: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white focus:ring-1 focus:ring-emerald-500">
                        <option value="Rx">{t.rx}</option>
                        <option value="Beginner">{t.scaled}</option>
                    </select>
                </div>
            </div>

            {/* TODO: Add Focus selector (Cardio, Strength, Gymnastics, Balanced) - currently not exposed in UI */}

            {/* Strength Toggle */}
            <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <div>
                    <span className="text-sm font-bold text-white block">{t.includeStrength}</span>
                    <span className="text-xs text-slate-500">{t.strengthSub}</span>
                </div>
                <button onClick={() => setConfig({ ...config, includeStrength: !config.includeStrength })} className={`w-12 h-7 rounded-full transition-colors relative ${config.includeStrength ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${config.includeStrength ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {/* Filters */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{t.injuries}</span>
                    <HelpCircle size={14} className="text-slate-600 cursor-help" onClick={(e) => onTooltip(e, t.tt.injuries)} />
                </div>
                <div className="flex gap-2">
                    {['Shoulders', 'Knees', 'Back'].map(part => (
                        <button key={part} onClick={() => toggleAvoid(part)} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${config.avoid.includes(part) ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {t.parts[part.toLowerCase()] || part}
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment */}
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.gear}</span>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(t.equip).map(key => (
                        <button key={key} onClick={() => toggleEquipment(key)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${config.equipment[key === 'pullup' ? 'pullupBar' : key] ? 'bg-slate-800 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                            {t.equip[key]}
                        </button>
                    ))}
                </div>
            </div>

            {/* TODO: Add accessibility attributes (aria-labels) to toggle buttons */}
            <div className="flex gap-2">
                <Button onClick={onGenerate} size="lg" fullWidth>
                    <Activity size={20} /> {t.generate}
                </Button>
                <Button onClick={() => setConfig(DEFAULT_CONFIG)} size="lg" variant="ghost">
                    <RotateCcw size={20} />
                </Button>
            </div>
        </div>
    );
};
