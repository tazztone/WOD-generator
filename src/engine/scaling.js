// Logic for scaling reps and substituting exercises based on difficulty

// V8 Upgrade: Smart Substitutions
const SUBSTITUTIONS = {
    'hspu': 'push_press_db',      // Handstand Push-up -> DB Push Press
    'bmu': 'pullup',              // Bar Muscle-up -> Pull-up
    'rmu': 'c2b',                 // Ring Muscle-up -> Chest-to-Bar
    'pistol': 'lunge_weighted',    // Pistol -> Weighted Lunge
    'du': 'su',                    // Double Unders -> Single Unders
    'ttb': 'v_up',                 // Toes-to-Bar -> V-Up
    'hswalk': 'bear_crawl',        // Handstand Walk -> Bear Crawl
    'wall_walk': 'plank_shoulder_tap' // Wall Walk -> Shoulder Taps
};

import { getStrategy } from './strategies/StrategyFactory.js';

export const calculateBaseReps = (exercise, difficulty, duration) => {
    // V7: Dynamic Scaling based on duration
    const isExtraLong = duration > 45;
    const isExtreme = duration > 80;
    const isShort = duration < 12;

    if (exercise.name.includes('Run')) {
        if (isExtreme) return '1000m';
        if (isExtraLong) return '800m';
        return isShort ? '200m' : '400m';
    }
    if (exercise.name.includes('Plank') || exercise.name.includes('Wall Sit')) return '45s';
    
    // Machine is tricky because Chipper logic was embedded here.
    // We return a standard number for now, Strategy can override if needed.
    if (exercise.equipment === 'Machine') {
        if (isExtreme) return 25;
        if (isExtraLong) return 20;
        return isShort ? 10 : 15;
    }

    let baseReps = 15;
    if (exercise.intensity === 'High') baseReps = 10;
    if (exercise.intensity === 'VeryHigh') baseReps = 6;
    if (exercise.name.includes('Double')) baseReps = 40;
    if (exercise.name.includes('Single Unders')) baseReps = 60;

    // Scale down for beginners
    if (difficulty === 'Beginner') {
        baseReps = Math.ceil(baseReps * 0.6);
        if (exercise.name.includes('Double') || exercise.name.includes('Single')) baseReps = 30;
    }

    return baseReps;
};

/**
 * Compatibility wrapper for the new strategy pattern.
 */
export const getReps = (exercise, difficulty, format, duration) => {
    const strategy = getStrategy(format);
    const baseReps = calculateBaseReps(exercise, difficulty, duration);
    return strategy.scaleReps(baseReps, exercise, difficulty, duration);
};

// Keep old export for backward compatibility during refactor, but it throws now?
// No, let's just export the new one and update imports.
// But wait, the Strategy files I just wrote rely on `baseReps` being passed in. 
// They don't import `getReps`.

/**
 * Returns a substituted exercise ID if applicable for the difficulty
 */
export const getSubstitution = (exerciseId, difficulty) => {
    if (difficulty !== 'Beginner') return null;
    return SUBSTITUTIONS[exerciseId] || null;
};
