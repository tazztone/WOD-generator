import { overlapFilter } from './src/engine/pipeline.js';

const mockDirector = {
    selectedExercises: [
        { exercise: { id: 'ex1', pattern: 'Push', tags: ['push', 'chest', 'triceps', 'shoulders'] } }
    ]
};

const mockPool = Array.from({ length: 1000 }, (_, i) => ({
    id: `ex${i}`,
    pattern: i % 2 === 0 ? 'Pull' : 'Push',
    tags: i % 2 === 0 ? ['pull', 'back', 'biceps'] : ['push', 'chest', 'triceps']
}));

const start = performance.now();
for (let i = 0; i < 10000; i++) {
    overlapFilter(mockPool, mockDirector);
}
const end = performance.now();
console.log(`Baseline overlapFilter execution time: ${end - start} ms`);
