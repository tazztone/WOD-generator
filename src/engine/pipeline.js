/**
 * Workout Generation Pipeline Rules
 */
import { CLASH_TAGS, FOCUS_PATTERNS } from '../config/workoutConfig.js';
import { getSubstitution } from './scaling.js';

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
 * Overlap Filter: Prevent muscle group overlap and strict pattern repetition
 */
export const overlapFilter = (pool, director) => {
    if (director.selectedExercises.length === 0) return pool;

    const lastEx = director.selectedExercises[director.selectedExercises.length - 1].exercise;
    
    return pool.filter(ex => {
        // STRICT Pattern Filter: Prevent consecutive same patterns
        if (ex.pattern === lastEx.pattern) return false;

        // Muscle Overlap via Tags
        if (lastEx.tags && ex.tags) {
            const shared = lastEx.tags.filter(t => ex.tags.includes(t) && CLASH_TAGS.includes(t));
            if (shared.length > 0) return false;
        }
        return true;
    });
};

/**
 * Dynamic Balancing: Weight patterns to maintain Push/Pull balance
 */
export const balanceWeight = (pool, director) => {
    if (director.balance.Push > director.balance.Pull) {
        const pullCandidates = pool.filter(ex => ex.pattern === 'Pull');
        if (pullCandidates.length > 0) {
            return [...pool, ...pullCandidates, ...pullCandidates];
        }
    }
    // TODO: Add more balancing rules (Squat vs Hinge etc)
    return pool;
};

/**
 * Focus Bias: Weight patterns based on the selected workout focus
 */
export const focusWeight = (pool, director) => {
    if (director.config.focus === 'Balanced') return pool;

    const targetPatterns = FOCUS_PATTERNS[director.config.focus] || [];
    const priorityMoves = pool.filter(ex => targetPatterns.includes(ex.pattern));
    
    if (priorityMoves.length > 0) {
        return [...pool, ...priorityMoves, ...priorityMoves];
    }
    return pool;
};

/**
 * Default Pipeline
 */
export const DEFAULT_PIPELINE = [
    alreadySelectedFilter,
    skillFilter,
    overlapFilter,
    balanceWeight,
    focusWeight
];
