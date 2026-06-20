// src/engine/scaling.js
import { getStrategy } from './strategies/StrategyFactory.js';
import { SCALING_CONSTANTS, SUBSTITUTIONS } from '../config/workoutConfig.js';
import { EXERCISE_DB } from '../data/exercises.js';

const RUN_IDS = new Set(['run', 'shuttle_run']);
const TIME_BASED_IDS = new Set([
  'plank',
  'side_plank',
  'plank_shoulder_tap',
  'plank_reach',
  'copenhagen_plank',
  'wall_sit',
]);

const EXERCISE_MAP = new Map(EXERCISE_DB.map((e) => [e.id, e]));

export const calculateBaseReps = (exercise, difficulty, duration) => {
  const { SHORT, EXTRA_LONG, EXTREME } = SCALING_CONSTANTS.DURATION_THRESHOLDS;
  const isExtraLong = duration > EXTRA_LONG;
  const isExtreme = duration > EXTREME;
  const isShort = duration < SHORT;

  if (RUN_IDS.has(exercise.id)) {
    if (isExtreme) return SCALING_CONSTANTS.RUN_DISTANCES.EXTREME;
    if (isExtraLong) return SCALING_CONSTANTS.RUN_DISTANCES.EXTRA_LONG;
    return isShort
      ? SCALING_CONSTANTS.RUN_DISTANCES.SHORT
      : SCALING_CONSTANTS.RUN_DISTANCES.DEFAULT;
  }

  if (TIME_BASED_IDS.has(exercise.id) || TIME_BASED_IDS.has(exercise.id_g)) return '45s';

  if (exercise.equipment === 'Machine') {
    if (isExtreme) return SCALING_CONSTANTS.MACHINE_REPS.EXTREME;
    if (isExtraLong) return SCALING_CONSTANTS.MACHINE_REPS.EXTRA_LONG;
    return isShort ? SCALING_CONSTANTS.MACHINE_REPS.SHORT : SCALING_CONSTANTS.MACHINE_REPS.DEFAULT;
  }

  let baseReps = SCALING_CONSTANTS.DEFAULT_REPS;
  if (exercise.intensity === 'High') baseReps = SCALING_CONSTANTS.INTENSITY_REPS.High;
  if (exercise.intensity === 'VeryHigh') baseReps = SCALING_CONSTANTS.INTENSITY_REPS.VeryHigh;

  if (exercise.id === 'rope_climb' || exercise.id === 'wall_walk') return 3;
  if (exercise.id === 'hswalk') return '50ft';
  if (exercise.id === 'l_sit') return '30s';

  if (exercise.id === 'du') baseReps = SCALING_CONSTANTS.SPECIAL_REPS.Double;
  if (exercise.id === 'su') baseReps = SCALING_CONSTANTS.SPECIAL_REPS['Single Unders'];

  if (difficulty === 'Beginner') {
    baseReps = Math.ceil(baseReps * SCALING_CONSTANTS.BEGINNER_MULTIPLIER);
    if (exercise.id === 'du' || exercise.id === 'su') {
      baseReps = SCALING_CONSTANTS.SPECIAL_REPS.Beginner_Jump;
    }
  }

  return baseReps;
};

export const getReps = (exercise, difficulty, format, duration) => {
  const strategy = getStrategy(format);
  const baseReps = calculateBaseReps(exercise, difficulty, duration);
  return strategy.scaleReps(baseReps, exercise, difficulty, duration);
};

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

// Unified ScalingEngine query methods

export const scale = (exercise, config, template) => {
  const reps = getReps(exercise, config.difficulty, template, config.duration);
  if (config.isPartner && typeof reps === 'number') {
    return reps * 2;
  }
  return reps;
};

export const resolveExercise = (exercise, difficulty) => {
  const subId = getSubstitution(exercise.id, difficulty);
  if (subId) {
    const subEx = EXERCISE_MAP.get(subId);
    if (subEx) return subEx;
  }
  return exercise;
};

export const formatReps = (reps, exercise) => {
  if (typeof reps === 'string') return reps;
  if (!exercise) return reps;
  if (exercise.equipment === 'Machine' && exercise.pattern === 'Cardio') return `${reps} Cal`;
  return reps;
};

// Bundle into an API object for clean usage/mocking if preferred
export const ScalingEngine = {
  scale,
  resolveExercise,
  formatReps,
  getReps,
  getSubstitution,
  calculateBaseReps,
};
