// Logic for scaling reps and substituting exercises based on difficulty
import { getStrategy } from './strategies/StrategyFactory.js';
import { SCALING_CONSTANTS, SUBSTITUTIONS } from '../config/workoutConfig.js';

export const calculateBaseReps = (exercise, difficulty, duration) => {
    // V7: Dynamic Scaling based on duration
    const { SHORT, EXTRA_LONG, EXTREME } = SCALING_CONSTANTS.DURATION_THRESHOLDS;
    const isExtraLong = duration > EXTRA_LONG;
    const isExtreme = duration > EXTREME;
    const isShort = duration < SHORT;

    if (exercise.name.includes('Run')) {
        if (isExtreme) return SCALING_CONSTANTS.RUN_DISTANCES.EXTREME;
        if (isExtraLong) return SCALING_CONSTANTS.RUN_DISTANCES.EXTRA_LONG;
        return isShort ? SCALING_CONSTANTS.RUN_DISTANCES.SHORT : SCALING_CONSTANTS.RUN_DISTANCES.DEFAULT;
    }
    if (exercise.name.includes('Plank') || exercise.name.includes('Wall Sit')) return '45s';
    
    // Machine is tricky because Chipper logic was embedded here.
    // We return a standard number for now, Strategy can override if needed.
    if (exercise.equipment === 'Machine') {
        if (isExtreme) return SCALING_CONSTANTS.MACHINE_REPS.EXTREME;
        if (isExtraLong) return SCALING_CONSTANTS.MACHINE_REPS.EXTRA_LONG;
        return isShort ? SCALING_CONSTANTS.MACHINE_REPS.SHORT : SCALING_CONSTANTS.MACHINE_REPS.DEFAULT;
    }

    let baseReps = SCALING_CONSTANTS.DEFAULT_REPS;
    if (exercise.intensity === 'High') baseReps = SCALING_CONSTANTS.INTENSITY_REPS.High;
    if (exercise.intensity === 'VeryHigh') baseReps = SCALING_CONSTANTS.INTENSITY_REPS.VeryHigh;
    if (exercise.name.includes('Double')) baseReps = SCALING_CONSTANTS.SPECIAL_REPS.Double;
    if (exercise.name.includes('Single Unders')) baseReps = SCALING_CONSTANTS.SPECIAL_REPS['Single Unders'];

    // Scale down for beginners
    if (difficulty === 'Beginner') {
        baseReps = Math.ceil(baseReps * SCALING_CONSTANTS.BEGINNER_MULTIPLIER);
        if (exercise.name.includes('Double') || exercise.name.includes('Single')) {
            baseReps = SCALING_CONSTANTS.SPECIAL_REPS.Beginner_Jump;
        }
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
