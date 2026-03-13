// Logic for scaling reps and substituting exercises based on difficulty
import { getStrategy } from './strategies/StrategyFactory.js';
import { SCALING_CONSTANTS, SUBSTITUTIONS } from '../config/workoutConfig.js';

export const calculateBaseReps = (exercise, difficulty, duration) => {
    // V7: Dynamic Scaling based on duration
    const { SHORT, EXTRA_LONG, EXTREME } = SCALING_CONSTANTS.DURATION_THRESHOLDS;
    const isExtraLong = duration > EXTRA_LONG;
    const isExtreme = duration > EXTREME;
    const isShort = duration < SHORT;

    const runIds = ['run', 'shuttle_run'];
    if (runIds.includes(exercise.id)) {
        if (isExtreme) return SCALING_CONSTANTS.RUN_DISTANCES.EXTREME;
        if (isExtraLong) return SCALING_CONSTANTS.RUN_DISTANCES.EXTRA_LONG;
        return isShort ? SCALING_CONSTANTS.RUN_DISTANCES.SHORT : SCALING_CONSTANTS.RUN_DISTANCES.DEFAULT;
    }

    const timeBasedIds = ['plank', 'side_plank', 'plank_shoulder_tap', 'plank_reach', 'copenhagen_plank', 'wall_sit'];
    if (timeBasedIds.includes(exercise.id) || timeBasedIds.includes(exercise.id_g)) return '45s';
    
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

    // V7.1 Special Overrides for very slow/hard movements
    if (exercise.id === 'rope_climb' || exercise.id === 'wall_walk') return 3;
    if (exercise.id === 'hswalk') return '50ft';
    if (exercise.id === 'l_sit') return '30s';

    if (exercise.id === 'du') baseReps = SCALING_CONSTANTS.SPECIAL_REPS.Double;
    if (exercise.id === 'su') baseReps = SCALING_CONSTANTS.SPECIAL_REPS['Single Unders'];

    // Scale down for beginners
    if (difficulty === 'Beginner') {
        baseReps = Math.ceil(baseReps * SCALING_CONSTANTS.BEGINNER_MULTIPLIER);
        if (exercise.id === 'du' || exercise.id === 'su') {
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

/**
 * Returns a substituted exercise ID if applicable for the difficulty
 */
export const getSubstitution = (exerciseId, difficulty) => {
    if (difficulty === 'Rx') return null;

    if (difficulty === 'Beginner' && SUBSTITUTIONS.Beginner && SUBSTITUTIONS.Beginner[exerciseId]) {
        return SUBSTITUTIONS.Beginner[exerciseId];
    }

    if (difficulty === 'Scaled' && SUBSTITUTIONS.Scaled && SUBSTITUTIONS.Scaled[exerciseId]) {
        return SUBSTITUTIONS.Scaled[exerciseId];
    }

    return null;
};
