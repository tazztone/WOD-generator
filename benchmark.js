import { performance } from 'perf_hooks';
import { calculateBaseReps } from './src/engine/scaling.js';

const iterations = 1000000;

const exerciseRun = { id: 'run', equipment: 'None', intensity: 'Low' };
const exercisePlank = { id: 'plank', id_g: 'plank', equipment: 'None', intensity: 'Low' };
const exerciseOther = { id: 'pushup', equipment: 'None', intensity: 'High' };

const start = performance.now();
for (let i = 0; i < iterations; i++) {
    calculateBaseReps(exerciseRun, 'Rx', 20);
    calculateBaseReps(exercisePlank, 'Rx', 20);
    calculateBaseReps(exerciseOther, 'Rx', 20);
}
const end = performance.now();

console.log(`Baseline performance: ${(end - start).toFixed(2)} ms`);
