import { performance } from 'perf_hooks';
import { balanceWeight, focusWeight } from './src/engine/pipeline.js';

const pool = Array.from({ length: 500 }, (_, i) => ({ id: i, pattern: i % 2 === 0 ? 'Push' : 'Pull' }));
const directorPush = { balance: { Push: 10, Pull: 5 } };
const directorPull = { balance: { Push: 5, Pull: 10 } };
const directorFocus = { config: { focus: 'Cardio' } };

// We need FOCUS_PATTERN_SETS to match Cardio for testing focusWeight
import { FOCUS_PATTERNS } from './src/config/workoutConfig.js';
const cardioPool = Array.from({ length: 500 }, (_, i) => ({ id: i, pattern: i % 2 === 0 ? 'Cardio' : 'Squat' }));

function bench() {
    const start = performance.now();
    for (let i = 0; i < 50000; i++) {
        balanceWeight(pool, directorPush);
        balanceWeight(pool, directorPull);
        focusWeight(cardioPool, directorFocus);
    }
    const end = performance.now();
    return end - start;
}

const res = bench();
console.log(`Pipeline weighting baseline: ${res} ms`);
