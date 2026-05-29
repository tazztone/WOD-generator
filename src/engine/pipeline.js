import { FOCUS_PATTERNS, CLASH_TAGS } from '../config/workoutConfig.js';
import { getSubstitution } from './scaling.js';

const CLASH_SET = new Set(CLASH_TAGS);

const FOCUS_PATTERN_SETS = Object.keys(FOCUS_PATTERNS).reduce((acc, key) => {
    acc[key] = new Set(FOCUS_PATTERNS[key]);
    return acc;
}, {});

/**
 * Basic Filter: Remove already selected exercises
 */
export const alreadySelectedFilter = (pool, director) => {
    if (!director.selectedExerciseIds) return pool;
    return pool.filter(ex => !director.selectedExerciseIds.has(ex.id));
};

/**
 * Skill Filter: Filter out skill moves for beginners if no substitution exists
 */
export const skillFilter = (pool, director) => {
    if (director.config.difficulty !== 'Beginner') return pool;

    return pool.filter(ex => {
        if (!ex.tags || !ex.tags.includes('skill')) {
            return true;
        }
        return getSubstitution(ex.id, director.config.difficulty) !== null;
    });
};

const GYMNASTICS_EQUIPMENT_EXCLUDES = new Set(['Barbell', 'Dumbbell', 'Kettlebell', 'Machine']);

/**
 * Focus Relevance Filter: Ensure exercises match the intended focus style
 */
export const focusRelevanceFilter = (pool, director) => {
    if (director.config.focus === 'Gymnastics') {
        // Gymnastics implies bodyweight mastery. Exclude heavy implements.
        return pool.filter(ex => !GYMNASTICS_EQUIPMENT_EXCLUDES.has(ex.equipment));
    }
    return pool;
};

/**
 * Overlap Filter: Prevent muscle group overlap and strict pattern repetition
 */
export const overlapFilter = (pool, director) => {
    let lastEx = null;

    if (director.selectedExercises.length > 0) {
        lastEx = director.selectedExercises[director.selectedExercises.length - 1].exercise;
    } else if (director.buyInForContext) {
        lastEx = director.buyInForContext;
    }

    if (!lastEx) return pool;

    if (!lastEx._clashSet) {
        const lastExClashTags = lastEx.tags ? lastEx.tags.filter(t => CLASH_SET.has(t)) : [];
        lastEx._clashSet = new Set(lastExClashTags);
    }
    const lastExClashSet = lastEx._clashSet;

    // If no clash tags, use a simplified filter
    if (lastExClashSet.size === 0) {
        return pool.filter(ex => {
            if (ex.pattern === lastEx.pattern) return false;
            if (ex.id === lastEx.id) return false;
            return true;
        });
    }
    
    return pool.filter(ex => {
        // STRICT Pattern Filter: Prevent consecutive same patterns
        if (ex.pattern === lastEx.pattern) return false;

        // Prevent same exercise ID
        if (ex.id === lastEx.id) return false;

        // Muscle Overlap via Tags
        if (ex.tags) {
            // If any tag is in the last exercise's clash set, avoid.
            if (ex.tags.some(t => lastExClashSet.has(t))) return false;
        }
        return true;
    });
};

/**
 * Dynamic Balancing: Weight patterns to maintain Push/Pull balance
 */
export const balanceWeight = (pool, director) => {
    // If we have more Push than Pull, add more Pull candidates
    if (director.balance.Push > director.balance.Pull) {
        const pullCandidates = pool.filter(ex => ex.pattern === 'Pull');
        if (pullCandidates.length > 0) {
            // Duplicate them to increase probability
            return pool.concat(pullCandidates, pullCandidates);
        }
    }
    if (director.balance.Pull > director.balance.Push) {
        const pushCandidates = pool.filter(ex => ex.pattern === 'Push');
        if (pushCandidates.length > 0) {
            return pool.concat(pushCandidates, pushCandidates);
        }
    }
    return pool;
};

/**
 * Focus Bias: Weight patterns based on the selected workout focus
 */
export const focusWeight = (pool, director) => {
    if (director.config.focus === 'Balanced') return pool;

    const targetPatterns = FOCUS_PATTERN_SETS[director.config.focus];
    if (!targetPatterns) return pool;

    // Note: This matches based on "pattern" string (e.g. "Cardio", "Push")
    const priorityMoves = pool.filter(ex => targetPatterns.has(ex.pattern));
    
    if (priorityMoves.length > 0) {
        // Significantly boost priority
        return pool.concat(priorityMoves, priorityMoves, priorityMoves);
    }
    return pool;
};

/**
 * Static rules: Applied once per generation
 */
export const STATIC_PIPELINE = [
    skillFilter,
    focusRelevanceFilter,
    focusWeight
];

/**
 * Dynamic rules: Applied on every pickNext
 */
export const DYNAMIC_PIPELINE = [
    alreadySelectedFilter,
    overlapFilter,
    balanceWeight
];

/**
 * Default Pipeline (Legacy compatibility if needed)
 */
export const DEFAULT_PIPELINE = [
    ...STATIC_PIPELINE,
    ...DYNAMIC_PIPELINE
];
