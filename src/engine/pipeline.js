import { FOCUS_PATTERNS, CLASH_TAGS } from '../config/workoutConfig.js';
import { getSubstitution } from './scaling.js';

const CLASH_SET = new Set(CLASH_TAGS);

const FOCUS_PATTERN_SETS = Object.keys(FOCUS_PATTERNS).reduce((acc, key) => {
  acc[key] = new Set(FOCUS_PATTERNS[key]);
  return acc;
}, {});

/**
 * FilterContext Definition:
 * Represents the read-only state slice required by the pipeline rule filters.
 * {
 *   config: Object,
 *   selectedExercises: Array,
 *   selectedExerciseIds: Set,
 *   balance: Object,
 *   buyInForContext: Object | null
 * }
 */

/**
 * Basic Filter: Remove already selected exercises
 */
export const alreadySelectedFilter = (pool, context) => {
  if (!context || !context.selectedExerciseIds) return pool;
  return pool.filter((ex) => !context.selectedExerciseIds.has(ex.id));
};

/**
 * Skill Filter: Filter out skill moves for beginners if no substitution exists
 */
export const skillFilter = (pool, context) => {
  if (!context || !context.config || context.config.difficulty !== 'Beginner') return pool;

  return pool.filter((ex) => {
    if (!ex.tags || !ex.tags.includes('skill')) {
      return true;
    }
    return getSubstitution(ex.id, context.config.difficulty) !== null;
  });
};

const GYMNASTICS_EQUIPMENT_EXCLUDES = new Set(['Barbell', 'Dumbbell', 'Kettlebell', 'Machine']);

/**
 * Focus Relevance Filter: Ensure exercises match the intended focus style
 */
export const focusRelevanceFilter = (pool, context) => {
  if (!context || !context.config) return pool;
  if (context.config.focus === 'Gymnastics') {
    // Gymnastics implies bodyweight mastery. Exclude heavy implements.
    return pool.filter((ex) => !GYMNASTICS_EQUIPMENT_EXCLUDES.has(ex.equipment));
  }
  return pool;
};

/**
 * Overlap Filter: Prevent muscle group overlap and strict pattern repetition
 */
export const overlapFilter = (pool, context) => {
  if (!context) return pool;
  let lastEx = null;

  if (context.selectedExercises && context.selectedExercises.length > 0) {
    lastEx = context.selectedExercises[context.selectedExercises.length - 1].exercise;
  } else if (context.buyInForContext) {
    lastEx = context.buyInForContext;
  }

  if (!lastEx) return pool;

  if (!lastEx._clashSet) {
    const lastExClashTags = lastEx.tags ? lastEx.tags.filter((t) => CLASH_SET.has(t)) : [];
    lastEx._clashSet = new Set(lastExClashTags);
  }
  const lastExClashSet = lastEx._clashSet;

  // If no clash tags, use a simplified filter
  if (lastExClashSet.size === 0) {
    return pool.filter((ex) => {
      if (ex.pattern === lastEx.pattern) return false;
      if (ex.id === lastEx.id) return false;
      return true;
    });
  }

  return pool.filter((ex) => {
    // STRICT Pattern Filter: Prevent consecutive same patterns
    if (ex.pattern === lastEx.pattern) return false;

    // Prevent same exercise ID
    if (ex.id === lastEx.id) return false;

    // Muscle Overlap via Tags
    if (ex.tags) {
      // If any tag is in the last exercise's clash set, avoid.
      if (ex.tags.some((t) => lastExClashSet.has(t))) return false;
    }
    return true;
  });
};

/**
 * Dynamic Balancing: Weight patterns to maintain Push/Pull balance
 */
export const balanceWeight = (pool, context) => {
  if (!context || !context.balance) return pool;
  const push = context.balance.Push || 0;
  const pull = context.balance.Pull || 0;

  if (push === pull) return pool;

  const targetPattern = push > pull ? 'Pull' : 'Push';
  const candidates = [];

  for (let i = 0; i < pool.length; i++) {
    if (pool[i].pattern === targetPattern) {
      candidates.push(pool[i]);
    }
  }

  if (candidates.length > 0) {
    return pool.concat(candidates, candidates);
  }
  return pool;
};

/**
 * Focus Bias: Weight patterns based on the selected workout focus
 */
export const focusWeight = (pool, context) => {
  if (!context || !context.config || context.config.focus === 'Balanced') return pool;

  const targetPatterns = FOCUS_PATTERN_SETS[context.config.focus];
  if (!targetPatterns) return pool;

  // Note: This matches based on "pattern" string (e.g. "Cardio", "Push")
  const priorityMoves = pool.filter((ex) => targetPatterns.has(ex.pattern));

  if (priorityMoves.length > 0) {
    // Significantly boost priority
    return pool.concat(priorityMoves, priorityMoves, priorityMoves);
  }
  return pool;
};

/**
 * Static rules: Applied once per generation
 */
export const STATIC_PIPELINE = [skillFilter, focusRelevanceFilter, focusWeight];

/**
 * Dynamic rules: Applied on every pickNext
 */
export const DYNAMIC_PIPELINE = [alreadySelectedFilter, overlapFilter, balanceWeight];

/**
 * Default Pipeline (Legacy compatibility if needed)
 */
export const DEFAULT_PIPELINE = [...STATIC_PIPELINE, ...DYNAMIC_PIPELINE];
