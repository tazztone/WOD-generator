import { performance } from 'perf_hooks';
import { balanceWeight, focusWeight } from './src/engine/pipeline.js';

const pool = Array.from({ length: 50 }, (_, i) => ({ id: i, pattern: i % 2 === 0 ? 'Push' : 'Pull' }));
const directorPush = { balance: { Push: 10, Pull: 5 } };
const directorPull = { balance: { Push: 5, Pull: 10 } };

function benchBalanceWeight() {
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
        balanceWeight(pool, directorPush);
        balanceWeight(pool, directorPull);
    }
    const end = performance.now();
    return end - start;
}

const res1 = benchBalanceWeight();
console.log(`balanceWeight baseline: ${res1} ms`);
