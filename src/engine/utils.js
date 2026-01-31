// src/engine/utils.js
import { INJURY_MAP } from '../data/exercises.js';

export const getExerciseName = (ex, lang) => (lang === 'de' && ex.name_de) ? ex.name_de : ex.name;

export const isExerciseValid = (ex, currentConfig) => {
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

// TODO: Make warmup duration/intensity configurable via user settings
export const generateWarmupLogic = (exercises, lang) => {
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

// TODO: Expand strength pairing options - currently limited to 3 exercises
export const generateStrengthLogic = (exercises, config, lang) => {
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
