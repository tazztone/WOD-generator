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

    if (currentConfig.forbiddenTagsSet && ex.tags) {
        if (ex.tags.some(tag => currentConfig.forbiddenTagsSet.has(tag))) return false;
    } else if (currentConfig.avoid && currentConfig.avoid.length > 0) {
        // Fallback if forbiddenTagsSet isn't precomputed (e.g. in tests or old calls)
        if (!currentConfig._forbiddenTagsSet) {
            currentConfig._forbiddenTagsSet = new Set();
            for (const area of currentConfig.avoid) {
                const forbiddenTags = INJURY_MAP[area];
                if (forbiddenTags) {
                    for (let i = 0; i < forbiddenTags.length; i++) {
                        currentConfig._forbiddenTagsSet.add(forbiddenTags[i]);
                    }
                }
            }
        }
        if (ex.tags && ex.tags.some(tag => currentConfig._forbiddenTagsSet.has(tag))) return false;
    }
    return true;
};

// TODO: Make warmup duration/intensity configurable via user settings
export const generateWarmupLogic = (exercises) => {
    let moves = new Set(['cardioEasy']);

    exercises.forEach(slot => {
        const { pattern, id } = slot.exercise;
        if (pattern === 'Squat') moves.add('airSquats');
        if (pattern === 'Hinge') moves.add('hingeWarmup');
        if (pattern === 'Push') moves.add('pushWarmup');
        if (pattern === 'Pull') moves.add('pullWarmup');
        if (id.includes('run') || id.includes('jump') || id === 'du') moves.add('calfRaises');
    });
    return Array.from(moves);
};

export const generateStrengthLogic = (exercises, config) => {
    if (!config.includeStrength) return null;
    const patterns = exercises.map(e => e.exercise.pattern);

    // Smart Pairing: Avoid pre-fatiguing the primary mover of the Metcon too much
    if (patterns.includes('Push') && patterns.includes('Pull')) {
        return { nameKey: config.equipment?.barbell ? 'benchPress' : 'floorPress', sets: '5 x 5', noteKey: 'building' };
    }
    if (patterns.includes('Squat') && patterns.includes('Core')) {
        return { nameKey: config.equipment?.barbell ? 'overheadSquat' : 'gobletSquat', sets: '5 x 3', noteKey: 'uprightTorso' };
    }
    if (patterns.includes('Hinge') && patterns.includes('Pull')) {
        return { nameKey: config.equipment?.barbell ? 'powerClean' : 'sumoDeadlift', sets: '5 x 3', noteKey: 'explosiveHips' };
    }

    if (patterns.includes('Squat') && !patterns.includes('Hinge')) {
        return { nameKey: 'deadlift', sets: '5 x 3', noteKey: 'heavyForm' };
    }
    if (patterns.includes('Push')) {
        return { nameKey: 'backSquat', sets: '5 x 5', noteKey: 'building' };
    }
    if (patterns.includes('Pull')) {
        return { nameKey: 'frontSquat', sets: '5 x 3', noteKey: 'uprightTorso' };
    }
    if (patterns.includes('Hinge')) {
        return { nameKey: 'pushPress', sets: '4 x 6', noteKey: 'explosiveHips' };
    }
    if (patterns.includes('Core')) {
        return { nameKey: 'romanianDeadlift', sets: '4 x 8', noteKey: 'controlledDescent' };
    }

    return {
        nameKey: 'strictPress',
        sets: '4 x 8',
        noteKey: 'tightCore'
    };
};

export const formatReps = (reps, exercise) => {
    if (typeof reps === 'string') return reps; // Already formatted: "400m", "45s", "40/30 cal"
    if (!exercise) return reps;
    if (exercise.equipment === 'Machine' && exercise.pattern === 'Cardio') return `${reps} Cal`;
    return reps; // Plain number = reps (standard CrossFit convention)
};
