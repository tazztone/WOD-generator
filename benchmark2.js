import { FOCUS_PATTERNS, CLASH_TAGS } from './src/config/workoutConfig.js';

const CLASH_SET = new Set(CLASH_TAGS);

const FOCUS_PATTERN_SETS = Object.keys(FOCUS_PATTERNS).reduce((acc, key) => {
    acc[key] = new Set(FOCUS_PATTERNS[key]);
    return acc;
}, {});

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

    if (lastExClashSet.size === 0) {
        return pool.filter(ex => {
            if (ex.pattern === lastEx.pattern) return false;
            if (ex.id === lastEx.id) return false;
            return true;
        });
    }

    return pool.filter(ex => {
        if (ex.pattern === lastEx.pattern) return false;
        if (ex.id === lastEx.id) return false;
        if (ex.tags) {
            if (ex.tags.some(t => lastExClashSet.has(t))) return false;
        }
        return true;
    });
};

export const focusWeight = (pool, director) => {
    if (director.config.focus === 'Balanced') return pool;

    const targetPatterns = FOCUS_PATTERN_SETS[director.config.focus] || new Set();
    const priorityMoves = pool.filter(ex => targetPatterns.has(ex.pattern));

    if (priorityMoves.length > 0) {
        return [...pool, ...priorityMoves, ...priorityMoves, ...priorityMoves];
    }
    return pool;
};

const mockDirector = {
    selectedExercises: [
        { exercise: { id: 'ex1', pattern: 'Push', tags: ['push', 'chest', 'triceps', 'shoulders'] } }
    ],
    config: {
        focus: 'Strength'
    }
};

const mockPool = Array.from({ length: 1000 }, (_, i) => ({
    id: `ex${i}`,
    pattern: i % 2 === 0 ? 'Pull' : 'Push',
    tags: i % 2 === 0 ? ['pull', 'back', 'biceps'] : ['push', 'chest', 'triceps']
}));

const start1 = performance.now();
for (let i = 0; i < 10000; i++) {
    overlapFilter(mockPool, mockDirector);
}
const end1 = performance.now();
console.log(`Optimized overlapFilter execution time: ${end1 - start1} ms`);

// Test baseline focusWeight
const start2 = performance.now();
for (let i = 0; i < 10000; i++) {
    const targetPatternsArray = FOCUS_PATTERNS[mockDirector.config.focus] || [];
    const targetPatterns = new Set(targetPatternsArray);
    const priorityMoves = mockPool.filter(ex => targetPatterns.has(ex.pattern));
    if (priorityMoves.length > 0) {
        [...mockPool, ...priorityMoves, ...priorityMoves, ...priorityMoves];
    }
}
const end2 = performance.now();
console.log(`Baseline focusWeight execution time: ${end2 - start2} ms`);

const start3 = performance.now();
for (let i = 0; i < 10000; i++) {
    focusWeight(mockPool, mockDirector);
}
const end3 = performance.now();
console.log(`Optimized focusWeight execution time: ${end3 - start3} ms`);
