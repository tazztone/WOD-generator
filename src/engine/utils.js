// src/engine/utils.js
import { INJURY_MAP } from '../data/exercises.js';

export const getExerciseName = (ex, lang) => (lang === 'de' && ex.name_de) ? ex.name_de : ex.name;

// Cache for forbidden tags sets based on the "avoid" array content
// This prevents repeated Set instantiation even if config objects are recreated or frozen
const forbiddenTagsCache = new Map();

export const isExerciseValid = (ex, currentConfig) => {
    if (ex.equipment === 'Barbell' && !currentConfig.equipment.barbell) return false;
    if (ex.equipment === 'Dumbbell' && !currentConfig.equipment.dumbbell) return false;
    if (ex.equipment === 'Kettlebell' && !currentConfig.equipment.kettlebell) return false;
    if (ex.equipment === 'PullupBar' && !currentConfig.equipment.pullupBar) return false;
    if (ex.equipment === 'Rings' && !currentConfig.equipment.rings) return false;
    if (ex.equipment === 'Box' && !currentConfig.equipment.box) return false;
    if (ex.equipment === 'JumpRope' && !currentConfig.equipment.jumpRope) return false;
    if (ex.equipment === 'Machine' && !currentConfig.equipment.machine) return false;

    if (currentConfig.difficulty === 'Beginner') {
        if (ex.intensity === 'VeryHigh') return false;
    }

    if (currentConfig.forbiddenTagsSet && ex.tags) {
        if (ex.tags.some(tag => currentConfig.forbiddenTagsSet.has(tag))) return false;
    } else if (currentConfig.avoid && currentConfig.avoid.length > 0) {
        const cacheKey = [...currentConfig.avoid].sort().join(',');
        let forbiddenTagsSet = forbiddenTagsCache.get(cacheKey);

        if (!forbiddenTagsSet) {
            forbiddenTagsSet = new Set();
            for (const area of currentConfig.avoid) {
                const forbiddenTags = INJURY_MAP[area];
                if (forbiddenTags) {
                    for (let i = 0; i < forbiddenTags.length; i++) {
                        forbiddenTagsSet.add(forbiddenTags[i]);
                    }
                }
            }
            forbiddenTagsCache.set(cacheKey, forbiddenTagsSet);
        }

        if (ex.tags && ex.tags.some(tag => forbiddenTagsSet.has(tag))) return false;
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
    const hasBarbell = config.equipment?.barbell;

    // Multi-pattern combinations
    if (patterns.includes('Push') && patterns.includes('Pull')) {
        return hasBarbell
            ? { nameKey: 'benchPress', sets: '5 x 5', noteKey: 'heavyForm' }
            : { nameKey: 'floorPress', sets: '4 x 8', noteKey: 'building' };
    }
    if (patterns.includes('Squat') && patterns.includes('Core')) {
        return hasBarbell
            ? { nameKey: 'overheadSquat', sets: '5 x 3', noteKey: 'tightCore' }
            : { nameKey: 'gobletSquat', sets: '4 x 8', noteKey: 'uprightTorso' };
    }
    if (patterns.includes('Hinge') && patterns.includes('Pull')) {
        return hasBarbell
            ? { nameKey: 'powerClean', sets: '5 x 3', noteKey: 'explosiveHips' }
            : { nameKey: 'sumoDeadlift', sets: '4 x 8', noteKey: 'heavyForm' };
    }

    // Smart Pairing: Avoid pre-fatiguing the primary mover of the Metcon too much
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
