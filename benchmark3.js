import { FOCUS_PATTERNS } from './src/config/workoutConfig.js';

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


const FOCUS_PATTERN_SETS = Object.keys(FOCUS_PATTERNS || {}).reduce((acc, key) => {
    acc[key] = new Set(FOCUS_PATTERNS[key]);
    return acc;
}, {});

const start3 = performance.now();
for (let i = 0; i < 10000; i++) {
    const targetPatterns = FOCUS_PATTERN_SETS[mockDirector.config.focus];
    if (targetPatterns) {
        const priorityMoves = mockPool.filter(ex => targetPatterns.has(ex.pattern));
        if (priorityMoves.length > 0) {
            [...mockPool, ...priorityMoves, ...priorityMoves, ...priorityMoves];
        }
    }
}
const end3 = performance.now();
console.log(`Optimized focusWeight execution time: ${end3 - start3} ms`);
