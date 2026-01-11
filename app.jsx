import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, RotateCcw, Settings, Clock, Dumbbell, Activity, CheckCircle, 
  Pause, XCircle, RefreshCw, AlertTriangle, Zap, Volume2, VolumeX, 
  Save, History as HistoryIcon, Share2, Trophy, Trash2, Globe, 
  HelpCircle, ArrowLeft, ChevronLeft, Speaker 
} from 'lucide-react';

// --- CONFIG & CONSTANTS ---
const APP_VERSION = "V7.0 ULTIMATE";
const PRIMARY_COLOR = "text-emerald-400";
const BG_GRADIENT = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black";

// --- AUDIO ENGINE (Oscillators for Beeps) ---
const playBeep = (freq = 880, type = 'sine', duration = 0.1) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { console.error("Audio Error", e); }
};

const SOUNDS = {
  click: () => playBeep(1200, 'sine', 0.05),
  countdown: () => playBeep(600, 'square', 0.1),
  start: () => playBeep(1000, 'square', 0.6),
  round: () => playBeep(880, 'sine', 0.3),
  end: () => {
    playBeep(600, 'square', 0.1);
    setTimeout(() => playBeep(600, 'square', 0.1), 150);
    setTimeout(() => playBeep(1000, 'square', 0.8), 300);
  }
};

const speak = (text, lang = 'en') => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Stop previous
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
  utterance.rate = 1.1;
  window.speechSynthesis.speak(utterance);
};

// --- TRANSLATIONS ---
const T = {
  en: {
    duration: "Duration",
    movements: "Movements",
    includeStrength: "Include Strength (Part A)",
    strengthSub: "Heavy compound lift before WOD",
    level: "Level",
    style: "Workout Style",
    focus: "Focus",
    injuries: "Injuries",
    gear: "Gear",
    generate: "Generate WOD",
    partA: "Part A",
    partB: "Part B",
    strength: "Strength",
    conditioning: "Conditioning",
    warmup: "Warmup Protocol",
    regenerate: "Regenerate",
    start: "Start Timer",
    workMode: "WORK",
    paused: "PAUSED",
    finished: "FINISHED",
    rest: "REST",
    minute: "Minute",
    greatJob: "Great Job",
    completeMsg: "Workout Complete. Log it.",
    score: "Score / Notes",
    save: "Save to Logbook",
    logbook: "Logbook",
    noLogs: "No workouts logged yet.",
    back: "Back",
    backToConfig: "Edit Settings",
    share: "Share",
    copied: "Copied",
    rx: "Rx (Standard)",
    scaled: "Scaled",
    balanced: "Balanced",
    cardio: "Cardio Engine",
    heavy: "Heavy Lifting",
    gymnastics: "Gymnastics",
    reps: "reps",
    min: "Mins",
    rounds: "Rounds",
    maxRounds: "Max Rounds",
    interval: "Interval",
    chipper: "Chipper",
    tabata: "Tabata",
    random: "Surprise Me (Random)",
    selectSwap: "Select Replacement",
    cancel: "Cancel",
    next: "Up Next:",
    voice: "Voice Coach",
    wakelock: "Screen On",
    parts: { shoulders: "Shoulders", knees: "Knees", back: "Back" },
    equip: { barbell: "Barbell", dumbbell: "Dumbbells / KBs", pullup: "Pull-Up Bar", machine: "Cardio Machine" },
    tt: {
      duration: "Adjust total workout time.",
      movements: "Number of distinct exercises.",
      strength: "Adds a heavy lifting session (Part A).",
      level: "Rx = Standard weights. Scaled = Reduced load.",
      focus: "Bias the randomizer.",
      injuries: "Smart-Filter: Excludes aggravating movements.",
      gear: "Uncheck what you don't have.",
      swap: "Tap to replace movement.",
      warmup: "Dynamic drills based on movement patterns.",
      share: "Copy full workout to clipboard.",
      history: "Past workouts and scores.",
      lang: "Switch Language"
    }
  },
  de: {
    duration: "Dauer",
    movements: "Übungen",
    includeStrength: "Kraftteil (Teil A)",
    strengthSub: "Schwere Grundübung vor dem WOD",
    level: "Niveau",
    style: "Workout Stil",
    focus: "Fokus",
    injuries: "Verletzungen",
    gear: "Ausrüstung",
    generate: "Workout Generieren",
    partA: "Teil A",
    partB: "Teil B",
    strength: "Kraft",
    conditioning: "Ausdauer",
    warmup: "Aufwärm-Protokoll",
    regenerate: "Neu Generieren",
    start: "Timer Starten",
    workMode: "ARBEIT",
    paused: "PAUSIERT",
    finished: "FERTIG",
    rest: "PAUSE",
    minute: "Minute",
    greatJob: "Gut Gemacht",
    completeMsg: "Workout beendet. Ergebnis eintragen.",
    score: "Ergebnis / Notizen",
    save: "Speichern",
    logbook: "Logbuch",
    noLogs: "Noch keine Workouts gespeichert.",
    back: "Zurück",
    backToConfig: "Einstellungen",
    share: "Teilen",
    copied: "Kopiert",
    rx: "Rx (Standard)",
    scaled: "Skaliert",
    balanced: "Ausgeglichen",
    cardio: "Ausdauer-Fokus",
    heavy: "Kraft-Fokus",
    gymnastics: "Gymnastik",
    reps: "Wdh",
    min: "Min",
    rounds: "Runden",
    maxRounds: "Max Runden",
    interval: "Intervall",
    chipper: "Chipper",
    tabata: "Tabata",
    random: "Überraschung (Zufall)",
    selectSwap: "Ersatz wählen",
    cancel: "Abbrechen",
    next: "Als nächstes:",
    voice: "Sprach-Coach",
    wakelock: "Display An",
    parts: { shoulders: "Schultern", knees: "Knie", back: "Rücken" },
    equip: { barbell: "Langhantel", dumbbell: "Kurzhantel / KB", pullup: "Klimmzugstange", machine: "Cardio Gerät" },
    tt: {
      duration: "Gesamtzeit anpassen.",
      movements: "Anzahl der verschiedenen Übungen.",
      strength: "Fügt eine schwere Krafteinheit hinzu.",
      level: "Rx = Standardgewichte. Skaliert = Reduziert.",
      focus: "Beeinflusst den Generator.",
      injuries: "Smart-Filter: Entfernt belastende Übungen.",
      gear: "Nicht vorhandene Ausrüstung abwählen.",
      swap: "Tippen zum Ersetzen.",
      warmup: "Spezifische Aufwärmübungen.",
      share: "Kopiert Workout-Text.",
      history: "Vergangene Workouts.",
      lang: "Sprache wechseln"
    }
  }
};

// --- DATABASE (V7 UPGRADE: ADDED TAGS) ---
const EXERCISE_DB = [
  // HINGE
  { id: 'dl_bb', name: 'Deadlift', name_de: 'Kreuzheben', pattern: 'Hinge', equipment: 'Barbell', intensity: 'High', tags: ['back', 'heavy'] },
  { id: 'pwr_clean', name: 'Power Clean', name_de: 'Power Clean', pattern: 'Hinge', equipment: 'Barbell', intensity: 'High', tags: ['back', 'shoulders', 'impact'] },
  { id: 'kb_swing', name: 'KB Swing', name_de: 'Kettlebell Swing', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'Medium', tags: ['back', 'grip'] },
  { id: 'snatch_db', name: 'Alt. DB Snatch', name_de: 'Alt. KH Reißen', pattern: 'Hinge', equipment: 'Dumbbell', intensity: 'High', tags: ['back', 'shoulders', 'overhead'] },
  
  // SQUAT
  { id: 'bs_bb', name: 'Back Squat', name_de: 'Kniebeuge (hinten)', pattern: 'Squat', equipment: 'Barbell', intensity: 'High', tags: ['knees', 'heavy'] },
  { id: 'thruster_bb', name: 'Thruster', name_de: 'Thruster', pattern: 'Squat', equipment: 'Barbell', intensity: 'VeryHigh', tags: ['knees', 'shoulders', 'overhead'] },
  { id: 'fs_db', name: 'DB Front Squat', name_de: 'KH Frontkniebeuge', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees'] },
  { id: 'goblet', name: 'Goblet Squat', name_de: 'Goblet Squat', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'Low', tags: ['knees'] },
  { id: 'wall_ball', name: 'Wall Ball', name_de: 'Wall Ball', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees', 'shoulders', 'overhead'] }, 
  { id: 'air_squat', name: 'Air Squat', name_de: 'Air Squat', pattern: 'Squat', equipment: 'Bodyweight', intensity: 'Low', tags: ['knees'] },
  { id: 'lunge_weighted', name: 'Walking Lunge', name_de: 'Ausfallschritt', pattern: 'Squat', equipment: 'Dumbbell', intensity: 'High', tags: ['knees'] },

  // PUSH
  { id: 'push_press_bb', name: 'Push Press', name_de: 'Push Press (LH)', pattern: 'Push', equipment: 'Barbell', intensity: 'High', tags: ['shoulders', 'overhead'] },
  { id: 'push_press_db', name: 'DB Push Press', name_de: 'Push Press (KH)', pattern: 'Push', equipment: 'Dumbbell', intensity: 'High', tags: ['shoulders', 'overhead'] },
  { id: 'pushup', name: 'Push-Up', name_de: 'Liegestütz', pattern: 'Push', equipment: 'Bodyweight', intensity: 'Low', tags: ['shoulders'] },
  { id: 'hspu', name: 'HSPU', name_de: 'Handstand Liegestütz', pattern: 'Push', equipment: 'Bodyweight', intensity: 'VeryHigh', tags: ['shoulders', 'overhead', 'skill'] },
  { id: 'burpee', name: 'Burpee', name_de: 'Burpee', pattern: 'Push', equipment: 'Bodyweight', intensity: 'High', tags: ['shoulders', 'knees', 'cardio'] },

  // PULL
  { id: 'pullup', name: 'Pull-Up', name_de: 'Klimmzug', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip'] },
  { id: 'c2b', name: 'Chest-to-Bar', name_de: 'Chest-to-Bar', pattern: 'Pull', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'skill'] },
  { id: 'ring_row', name: 'Ring Row', name_de: 'Ring Rudern', pattern: 'Pull', equipment: 'PullupBar', intensity: 'Low', tags: ['shoulders', 'grip'] },
  { id: 'renegade', name: 'Renegade Row', name_de: 'Renegade Row', pattern: 'Pull', equipment: 'Dumbbell', intensity: 'High', tags: ['shoulders', 'core'] },

  // CARDIO
  { id: 'box_jump', name: 'Box Jump', name_de: 'Box Jump', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'impact'] },
  { id: 'du', name: 'Double Unders', name_de: 'Double Unders', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'High', tags: ['knees', 'impact', 'skill'] },
  { id: 'run', name: 'Run', name_de: 'Laufen', pattern: 'Cardio', equipment: 'Bodyweight', intensity: 'Low', tags: ['knees', 'impact'] },
  { id: 'row', name: 'Row', name_de: 'Rudern', pattern: 'Cardio', equipment: 'Machine', intensity: 'Low', tags: ['back', 'knees'] },
  { id: 'bike', name: 'Bike', name_de: 'Radfahren', pattern: 'Cardio', equipment: 'Machine', intensity: 'High', tags: ['knees'] },

  // CORE
  { id: 'ttb', name: 'Toes-to-Bar', name_de: 'Toes-to-Bar', pattern: 'Core', equipment: 'PullupBar', intensity: 'High', tags: ['shoulders', 'grip', 'core'] },
  { id: 'situp', name: 'AbMat Sit-Up', name_de: 'Sit-Up', pattern: 'Core', equipment: 'Bodyweight', intensity: 'Low', tags: ['core', 'back'] },
  { id: 'v_up', name: 'V-Up', name_de: 'Klappmesser', pattern: 'Core', equipment: 'Bodyweight', intensity: 'High', tags: ['core', 'back'] },
];

// --- LOGIC HELPERS ---

// V7: Tag-based exclusion instead of fragile strings
const INJURY_MAP = {
  'Shoulders': ['shoulders', 'overhead'],
  'Knees': ['knees', 'impact'],
  'Back': ['back', 'heavy']
};

const getReps = (exercise, difficulty, format, duration) => {
  // V7: Dynamic Scaling based on duration
  const isLong = duration > 25;
  const isShort = duration < 12;
  
  if (exercise.name.includes('Run')) return isShort ? '200m' : '400m';
  if (exercise.name.includes('Plank')) return '45s';
  if (exercise.equipment === 'Machine') return format === 'Chipper' ? '40/30 cal' : (isShort ? '10 cal' : '15 cal');

  let baseReps = 15;
  if (exercise.intensity === 'High') baseReps = 10;
  if (exercise.intensity === 'VeryHigh') baseReps = 6;
  if (exercise.name.includes('Double')) baseReps = 40;

  // Scale down for beginners
  if (difficulty === 'Beginner') {
    baseReps = Math.ceil(baseReps * 0.6);
    if (exercise.name.includes('Double')) baseReps = 30; // or Singles
  }

  // Format adjustments
  if (format === 'EMOM' || format === 'Tabata') {
    // EMOMs need to be sprintable
    if (baseReps > 12 && !exercise.name.includes('Double')) baseReps = 10;
  } else if (format === 'Chipper') {
    // Chippers are high volume
    baseReps = baseReps * 4; 
    if (exercise.name.includes('Double')) baseReps = 100;
  } else if (isLong && format === 'AMRAP') {
    // Pacing for long workouts
    if (baseReps > 10) baseReps = 10;
  }

  return baseReps;
};

const getExerciseName = (ex, lang) => (lang === 'de' && ex.name_de) ? ex.name_de : ex.name;

const generateWarmupLogic = (exercises, lang) => {
  const isDe = lang === 'de';
  let moves = new Set([isDe ? '3 min Cardio (Easy)' : '3 min Cardio (Easy)']);
  
  exercises.forEach(slot => {
    const { pattern, name } = slot.exercise;
    if (pattern === 'Squat') moves.add(isDe ? '10 Air Squats' : '10 Air Squats');
    if (pattern === 'Hinge') moves.add(isDe ? '10 Glute Bridges + 10 Good Mornings' : '10 Glute Bridges + 10 Good Mornings');
    if (pattern === 'Push') moves.add(isDe ? '10 Scap Push-ups + 5 Inchworms' : '10 Scap Push-ups + 5 Inchworms');
    if (pattern === 'Pull') moves.add(isDe ? '10 Ring Rows / Scap Pulls' : '10 Ring Rows / Scap Pulls');
    if (name.includes('Run') || name.includes('Jump')) moves.add(isDe ? '20 Wadenheben' : '20 Calf Raises');
  });
  return Array.from(moves);
};

const generateStrengthLogic = (exercises, config, lang) => {
  if (!config.includeStrength) return null;
  const patterns = exercises.map(e => e.exercise.pattern);
  const isDe = lang === 'de';
  
  // Smart Pairing: Avoid pre-fatiguing the primary mover of the Metcon too much
  // If Metcon is Squat heavy -> Do Hinge or Push Strength
  
  if (patterns.includes('Squat') && !patterns.includes('Hinge')) {
     return { name: isDe ? 'Deadlift' : 'Deadlift', sets: '5 x 3', notes: isDe ? 'Schwer, Fokus Technik' : 'Heavy, Perfect Form' };
  }
  if (patterns.includes('Push')) {
     return { name: isDe ? 'Back Squat' : 'Back Squat', sets: '5 x 5', notes: isDe ? 'Aufbauend' : 'Building weight' };
  }
  
  // Default fallback
  return { 
    name: isDe ? 'Strict Press' : 'Strict Press', 
    sets: '4 x 8', 
    notes: isDe ? 'Rumpf fest, kein Beineinsatz' : 'Tight core, no legs' 
  };
};

// --- APP ROOT ---

export default function CrossFitGenerator() {
  const [appState, setAppState] = useState('config'); 
  const [lang, setLang] = useState('en');
  const [config, setConfig] = useState({
    duration: 15,
    difficulty: 'Rx',
    focus: 'Balanced', 
    templateType: 'Random', 
    includeStrength: false,
    numExercises: 3,
    avoid: [], 
    equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true }
  });
  
  const [workout, setWorkout] = useState(null);
  const [history, setHistory] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('wod_history_v7');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (result) => {
    const newEntry = { ...result, id: Date.now(), date: new Date().toISOString() };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('wod_history_v7', JSON.stringify(updated));
  };

  const handleTooltip = (e, text) => {
    if (!text) return;
    e.stopPropagation(); // V7: Prevent ghost clicks
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text });
  };
  const clearTooltip = () => setTooltip(null);

  // --- ENGINE ---
  const isExerciseValid = (ex, currentConfig) => {
    if (ex.equipment === 'Barbell' && !currentConfig.equipment.barbell) return false;
    if (ex.equipment === 'Dumbbell' && !currentConfig.equipment.dumbbell) return false;
    if (ex.equipment === 'PullupBar' && !currentConfig.equipment.pullupBar) return false;
    if (ex.equipment === 'Machine' && !currentConfig.equipment.machine) return false;
    
    if (currentConfig.difficulty === 'Beginner') {
      if (ex.intensity === 'VeryHigh') return false; 
    }

    if (currentConfig.avoid.length > 0) {
      for (const area of currentConfig.avoid) {
        const forbiddenTags = INJURY_MAP[area];
        if (ex.tags && ex.tags.some(tag => forbiddenTags.includes(tag))) return false;
      }
    }
    return true;
  };

  const generateWorkout = () => {
    let availableExercises = EXERCISE_DB.filter(ex => isExerciseValid(ex, config));

    if (config.focus !== 'Balanced') {
      const focusPatterns = {
        'Cardio': ['Cardio'],
        'Strength': ['Squat', 'Hinge', 'Push'],
        'Gymnastics': ['Pull', 'Core', 'Push']
      };
      const targetPatterns = focusPatterns[config.focus] || [];
      const priorityMoves = availableExercises.filter(ex => targetPatterns.includes(ex.pattern));
      // Bias the pool by adding duplicates of focused items
      availableExercises = [...availableExercises, ...priorityMoves];
    }

    const templates = ['AMRAP', 'RFT', 'EMOM'];
    let template = config.templateType;
    if (template === 'Random') template = templates[Math.floor(Math.random() * templates.length)];
    
    let timeCap = config.duration;
    let rounds = 0;
    
    if (template === 'RFT') {
      // V7: Smarter Round Logic
      const avgRepTimeMin = 1.5; 
      rounds = Math.max(3, Math.floor(config.duration / avgRepTimeMin));
    } else if (template === 'EMOM') {
      rounds = config.duration; // EMOM usually 1 min per round
    } else if (template === 'Chipper') {
      rounds = 1;
    } else if (template === 'Tabata') {
      timeCap = 4; // Standard tabata
      rounds = 8;
    }

    const selectedExercises = [];
    const targetCount = config.numExercises;
    let usedPatterns = [];

    for (let i = 0; i < targetCount; i++) {
      // Filter out already used IDs and prevent same pattern back-to-back (unless mono-structural)
      const pool = availableExercises.filter(ex => {
        if (selectedExercises.find(s => s.exercise.id === ex.id)) return false;
        if (usedPatterns.length > 0) {
           const lastPattern = usedPatterns[usedPatterns.length - 1];
           if (ex.pattern === lastPattern) return false; 
        }
        return true;
      });

      if (pool.length === 0) break; 
      const picked = pool[Math.floor(Math.random() * pool.length)];
      
      selectedExercises.push({
        exercise: picked,
        reps: getReps(picked, config.difficulty, template, timeCap)
      });
      usedPatterns.push(picked.pattern);
    }

    setWorkout({
      template,
      timeCap,
      rounds: template === 'RFT' ? rounds : null,
      exercises: selectedExercises,
      generatedAt: new Date(),
      warmup: generateWarmupLogic(selectedExercises, lang),
      strength: generateStrengthLogic(selectedExercises, config, lang)
    });
    setAppState('preview');
  };

  const manualSwap = (index, newExerciseId) => {
     if (!workout) return;
     const newEx = EXERCISE_DB.find(e => e.id === newExerciseId);
     const newExercises = [...workout.exercises];
     newExercises[index] = {
       exercise: newEx,
       reps: getReps(newEx, config.difficulty, workout.template, workout.timeCap)
     };
     setWorkout({ 
      ...workout, 
      exercises: newExercises,
      warmup: generateWarmupLogic(newExercises, lang),
      strength: generateStrengthLogic(newExercises, config, lang)
    });
  };

  return (
    <div className={`min-h-screen ${BG_GRADIENT} text-slate-100 font-sans selection:bg-emerald-500 selection:text-white`}>
      <div className="max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden flex flex-col relative bg-slate-900/50">
        
        {tooltip && (
          <div className="fixed z-[100] px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl border border-slate-600 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 animate-in fade-in zoom-in-95 duration-200 max-w-[250px] text-center"
               style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </div>
        )}

        <header className="px-5 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex justify-between items-center sticky top-0 z-30">
          <div onClick={() => setAppState('config')} className="cursor-pointer group">
            <h1 className={`text-xl font-black italic tracking-tighter ${PRIMARY_COLOR}`}>WOD GEN</h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest">{APP_VERSION}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'de' : 'en')} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700 flex items-center gap-1">
                 <Globe size={14} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setAppState('history')} className={`p-2 rounded-full transition-all ${appState === 'history' ? "bg-slate-700 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}>
                <HistoryIcon size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {appState === 'config' && <ConfigScreen config={config} setConfig={setConfig} onGenerate={generateWorkout} lang={lang} onTooltip={handleTooltip} clearTooltip={clearTooltip} />}
          {appState === 'preview' && workout && <PreviewScreen workout={workout} config={config} onManualSwap={manualSwap} availableExercises={EXERCISE_DB} isExerciseValid={isExerciseValid} onStart={() => setAppState('active')} lang={lang} onTooltip={handleTooltip} clearTooltip={clearTooltip} onBack={() => setAppState('config')} />}
          {appState === 'active' && workout && <ActiveTimer workout={workout} onExit={() => setAppState('preview')} onSave={saveToHistory} lang={lang} />}
          {appState === 'history' && <HistoryScreen history={history} clearHistory={() => {setHistory([]); localStorage.removeItem('wod_history_v7');}} onBack={() => setAppState('config')} lang={lang} />}
        </main>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function ConfigScreen({ config, setConfig, onGenerate, lang, onTooltip, clearTooltip }) {
  const t = T[lang];
  
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
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">{t.duration}</span>
            <span className="text-emerald-400 font-mono font-bold">{config.duration}m</span>
          </div>
          <input type="range" min="5" max="60" step="5" value={config.duration} onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
        </div>
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">{t.movements}</span>
            <span className="text-emerald-400 font-mono font-bold">{config.numExercises}</span>
          </div>
          <input type="range" min="2" max="6" step="1" value={config.numExercises} onChange={(e) => setConfig({...config, numExercises: parseInt(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
        </div>
      </div>

      {/* Style & Level */}
      <div className="grid grid-cols-2 gap-4">
         <div>
             <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.style}</span>
             <select value={config.templateType} onChange={(e) => setConfig({...config, templateType: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white focus:ring-1 focus:ring-emerald-500">
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
             <select value={config.difficulty} onChange={(e) => setConfig({...config, difficulty: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white focus:ring-1 focus:ring-emerald-500">
                <option value="Rx">{t.rx}</option>
                <option value="Beginner">{t.scaled}</option>
             </select>
         </div>
      </div>

      {/* Strength Toggle */}
      <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
           <span className="text-sm font-bold text-white block">{t.includeStrength}</span>
           <span className="text-xs text-slate-500">{t.strengthSub}</span>
        </div>
        <button onClick={() => setConfig({...config, includeStrength: !config.includeStrength})} className={`w-12 h-7 rounded-full transition-colors relative ${config.includeStrength ? 'bg-emerald-500' : 'bg-slate-600'}`}>
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

      <button onClick={onGenerate} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <Activity size={20} /> {t.generate}
      </button>
    </div>
  );
}

function PreviewScreen({ workout, config, onManualSwap, availableExercises, isExerciseValid, onStart, lang, onTooltip, clearTooltip, onBack }) {
  const [copied, setCopied] = useState(false);
  const [swapModal, setSwapModal] = useState({ show: false, index: -1 });
  const t = T[lang];

  const copyToClipboard = () => {
    const text = `WOD GEN ${APP_VERSION}\n${workout.template} - ${config.duration} Mins\n\n${workout.exercises.map(e => `${e.reps} ${getExerciseName(e.exercise, lang)}`).join('\n')}`;
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSwapCandidates = (index) => {
      const current = workout.exercises[index];
      return availableExercises.filter(ex => 
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
                 <button onClick={() => setSwapModal({ show: false, index: -1 })} className="p-2 bg-slate-800 rounded-full"><XCircle size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-2">
                {getSwapCandidates(swapModal.index).map(ex => (
                    <button key={ex.id} onClick={() => { onManualSwap(swapModal.index, ex.id); setSwapModal({show:false, index:-1}); }}
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
                <div key={idx} onClick={() => setSwapModal({show:true, index: idx})} className="flex items-center justify-between group cursor-pointer">
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
               <li key={i} className="text-xs text-slate-400 flex gap-2"><div className="w-1 h-1 bg-slate-600 rounded-full mt-1.5 shrink-0"/> {line}</li>
             ))}
           </ul>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <button onClick={onStart} className="w-full py-4 bg-emerald-500 text-slate-950 font-black text-xl uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
           <Play size={24} fill="currentColor" /> {t.start}
        </button>
      </div>
    </div>
  );
}

// --- ACTIVE TIMER (V7 UPGRADE) ---
function ActiveTimer({ workout, onExit, onSave, lang }) {
  const t = T[lang];
  const [status, setStatus] = useState('pre'); // pre, work, rest, finished
  const [timeLeft, setTimeLeft] = useState(10); // Start with 10s countdown
  const [totalTime, setTotalTime] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTime, setRoundTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wakelock, setWakelock] = useState(null);
  
  // Timer Ref
  const timerRef = useRef(null);

  // Initialize WakeLock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen');
          setWakelock(lock);
        }
      } catch (err) { console.log('WakeLock error', err); }
    };
    requestWakeLock();
    return () => wakelock && wakelock.release();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speakMovements = useCallback(() => {
    if (!voiceEnabled || status === 'finished') return;
    const moveList = workout.exercises.map(e => e.exercise.name).join(', ');
    speak(`${t.next} ${moveList}`, lang);
  }, [workout, voiceEnabled, status, lang, t.next]);

  // Main Loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (status === 'finished') return;

      if (status === 'pre') {
        if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
        if (timeLeft === 0) {
           SOUNDS.start();
           setStatus('work');
           setTimeLeft(workout.timeCap * 60); // Set main timer
           if (workout.template === 'Tabata') setTimeLeft(20);
           if (workout.template === 'EMOM') setTimeLeft(60);
           speakMovements();
        } else {
          setTimeLeft(t => t - 1);
        }
        return;
      }

      // Main Timer Logic
      setTotalTime(tt => tt + 1);
      setRoundTime(rt => rt + 1);

      if (workout.template === 'EMOM') {
         if (timeLeft === 10) speak("10 seconds", lang);
         if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
         if (timeLeft === 0) {
            // New Minute
            SOUNDS.round();
            setCurrentRound(r => r + 1);
            setTimeLeft(60);
            setRoundTime(0);
            if (currentRound >= workout.rounds) {
               setStatus('finished');
               SOUNDS.end();
            }
         } else {
            setTimeLeft(t => t - 1);
         }
      } else if (workout.template === 'Tabata') {
        if (timeLeft <= 3 && timeLeft > 0) SOUNDS.countdown();
        if (timeLeft === 0) {
           if (status === 'work') {
              setStatus('rest');
              setTimeLeft(10);
              SOUNDS.start();
           } else {
              setStatus('work');
              setTimeLeft(20);
              setCurrentRound(r => r + 1);
              SOUNDS.start();
              if (currentRound >= 8) {
                 setStatus('finished');
                 SOUNDS.end();
              }
           }
        } else {
           setTimeLeft(t => t - 1);
        }
      } else {
        // AMRAP, RFT, Chipper (Count DOWN or UP)
        if (workout.template === 'AMRAP' || workout.template === 'RFT') {
           if (timeLeft === 0) {
              setStatus('finished');
              SOUNDS.end();
           } else {
              setTimeLeft(t => t - 1);
           }
        }
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [status, timeLeft, workout, currentRound, voiceEnabled, speakMovements, lang]);


  // FINISHED SCREEN
  if (status === 'finished') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-slate-900 animate-in zoom-in-95">
         <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
         <h1 className="text-4xl font-black text-white italic mb-2">{t.greatJob}</h1>
         <p className="text-slate-400 mb-8">{t.completeMsg}</p>
         
         <div className="w-full bg-slate-800 p-4 rounded-xl mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase">{t.score}</label>
            <input id="scoreInput" type="text" placeholder={workout.template === 'AMRAP' ? 'e.g. 5 Rounds + 10' : 'e.g. 12:45'} 
                   className="w-full bg-transparent border-b border-slate-600 text-white text-xl py-2 focus:outline-none focus:border-emerald-500" />
         </div>

         <button onClick={() => {
            const score = document.getElementById('scoreInput').value || 'Completed';
            onSave({ ...workout, score, duration: totalTime });
            onExit();
         }} className="w-full py-4 bg-emerald-500 text-slate-900 font-bold rounded-xl mb-3">{t.save}</button>
         <button onClick={onExit} className="text-slate-500 font-bold text-sm">{t.cancel}</button>
      </div>
    );
  }

  // TIMER SCREEN
  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${status === 'rest' ? 'bg-blue-900' : 'bg-slate-900'}`}>
       {/* Background Pulse */}
       {status === 'work' && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none"/>}

       {/* Header */}
       <div className="flex justify-between items-center p-5 z-10">
          <button onClick={() => setStatus('finished')} className="p-2 bg-slate-800/50 rounded-full text-slate-400"><XCircle size={20}/></button>
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
                  <button onClick={() => setCurrentRound(Math.max(1, currentRound-1))} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700"><ChevronLeft size={20} /></button>
                  <span className="text-4xl font-mono font-bold text-emerald-400">{currentRound}</span>
                  <button onClick={() => setCurrentRound(currentRound+1)} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700"><ChevronLeft size={20} className="rotate-180" /></button>
               </div>
            </div>
          )}
       </div>

       {/* Next Up / Current Movements */}
       <div className="p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-10">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
            <Zap size={12} /> {t.next}
          </div>
          <div className="text-sm text-slate-300 leading-relaxed font-medium">
             {workout.exercises.map(e => `${e.reps} ${e.exercise.name}`).join(' + ')}
          </div>
       </div>
    </div>
  );
}

function HistoryScreen({ history, clearHistory, onBack, lang }) {
  const t = T[lang];
  return (
    <div className="flex flex-col h-full bg-slate-900 p-5">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white"><ArrowLeft size={24} /></button>
        <h2 className="text-xl font-black text-white italic">{t.logbook}</h2>
        <button onClick={clearHistory} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
         {history.length === 0 ? (
           <div className="text-center text-slate-500 mt-20">
              <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t.noLogs}</p>
           </div>
         ) : history.map(entry => (
           <div key={entry.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between mb-2">
                 <span className="text-emerald-400 font-black italic uppercase">{entry.template}</span>
                 <span className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
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
}
