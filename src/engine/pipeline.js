/**
 * Workout Generation Pipeline Rules
 */
import { CLASH_TAGS, FOCUS_PATTERNS } from '../config/workoutConfig.js';
import { getSubstitution } from './scaling.js';

const CLASH_SET = new Set(CLASH_TAGS);

/**
 * Basic Filter: Remove already selected exercises
 */
export const alreadySelectedFilter = (pool, director) => {
    return pool.filter(ex => !director.selectedExercises.some(s => s.exercise.id === ex.id));
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

/**
 * Focus Relevance Filter: Ensure exercises match the intended focus style
 */
export const focusRelevanceFilter = (pool, director) => {
    if (director.config.focus === 'Gymnastics') {
        // Gymnastics implies bodyweight mastery. Exclude heavy implements.
        return pool.filter(ex =>
            !['Barbell', 'Dumbbell', 'Kettlebell', 'Machine'].includes(ex.equipment)
        );
    }
    // Cardio focus usually means lighter loads or monostructural
    if (director.config.focus === 'Cardio') {
        // Allow everything, but maybe de-prioritize heavy lifts in weight step
        // For now, let's just avoid Heavy Barbell work in Cardio focus to prevent "Heavy 1RM" feel
        // But "Grace" (30 C&J) is cardio... so maybe leave it.
    }
    return pool;
};


/**
 * Overlap Filter: Prevent muscle group overlap and strict pattern repetition
 */
export const overlapFilter = (pool, director) => {
    if (director.selectedExercises.length === 0) return pool;

    const lastEx = director.selectedExercises[director.selectedExercises.length - 1].exercise;

    // Pre-calculate relevant clash tags for the last exercise to avoid redundant work in filter
    const lastTags = lastEx.tags || [];
    const relevantLastTags = new Set();
    for (const t of lastTags) {
        if (CLASH_SET.has(t)) relevantLastTags.add(t);
    }

    return pool.filter(ex => {
        // STRICT Pattern Filter: Prevent consecutive same patterns
        // e.g. Pull -> Pull
        if (ex.pattern === lastEx.pattern) return false;

        // Prevent same exercise ID (should be handled by alreadySelected, but good safety)
        if (ex.id === lastEx.id) return false;

        // Muscle Overlap via Tags
        if (relevantLastTags.size > 0 && ex.tags) {
            // If they share a clash tag, avoid.
            for (const t of ex.tags) {
                if (relevantLastTags.has(t)) return false;
            }
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
            return [...pool, ...pullCandidates, ...pullCandidates];
        }
    }
    if (director.balance.Pull > director.balance.Push) {
        const pushCandidates = pool.filter(ex => ex.pattern === 'Push');
        if (pushCandidates.length > 0) {
            return [...pool, ...pushCandidates, ...pushCandidates];
        }
    }
    return pool;
};

/**
 * Focus Bias: Weight patterns based on the selected workout focus
 */
export const focusWeight = (pool, director) => {
    if (director.config.focus === 'Balanced') return pool;

    const targetPatterns = FOCUS_PATTERNS[director.config.focus] || [];
    // Note: This matches based on "pattern" string (e.g. "Cardio", "Push")
    const priorityMoves = pool.filter(ex => targetPatterns.includes(ex.pattern));
    
    if (priorityMoves.length > 0) {
        // Significantly boost priority
        return [...pool, ...priorityMoves, ...priorityMoves, ...priorityMoves];
    }
    return pool;
};

/**
 * Default Pipeline
 */
export const DEFAULT_PIPELINE = [
    alreadySelectedFilter,
    skillFilter,
    focusRelevanceFilter, // Added this
    overlapFilter,
    balanceWeight,
    focusWeight
];
