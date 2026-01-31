import { generateWorkout } from '../src/engine/generator.js';
import { DEFAULT_CONFIG } from '../src/engine/storage.js';

const iterations = 2000;
const results = {
    total: 0,
    difficulty: { Rx: 0, Beginner: 0 },
    templates: {},
    patterns: {},
    exercises: {},
    pairs: {}, // Track frequency of pairs
    strengthCount: 0,
    buyInCount: 0,
    patternVarietyScore: 0, // Sum of unique patterns per workout
    focusStats: {}
};

// Config variants to test
const foci = ['Balanced', 'Cardio', 'Strength', 'Gymnastics', 'Core'];
const difficulties = ['Rx', 'Beginner'];

console.log(`Generating ${iterations} workouts across various configurations...`);
const start = performance.now();

for (let i = 0; i < iterations; i++) {
    // Randomize config for better coverage
    const focus = foci[Math.floor(Math.random() * foci.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    const config = {
        ...DEFAULT_CONFIG,
        templateType: 'Random',
        numExercises: 3 + Math.floor(Math.random() * 3), // 3-5 exercises
        includeStrength: Math.random() > 0.5,
        focus: focus,
        difficulty: difficulty,
        duration: 10 + Math.floor(Math.random() * 50) // 10-60 min
    };

    try {
        const workout = generateWorkout(config, 'en');
        results.total++;

        // Basic Stats
        results.difficulty[difficulty]++;
        results.templates[workout.template] = (results.templates[workout.template] || 0) + 1;
        if (workout.strength) results.strengthCount++;
        if (workout.buyIn) results.buyInCount++;

        // Focus Stats
        if (!results.focusStats[focus]) results.focusStats[focus] = { count: 0, patterns: {} };
        results.focusStats[focus].count++;

        // Exercise & Pattern Analysis
        const workoutPatterns = new Set();
        const workoutExercises = workout.exercises.map(e => e.exercise.name);

        workout.exercises.forEach(slot => {
            const ex = slot.exercise;
            
            // Global stats
            results.exercises[ex.name] = (results.exercises[ex.name] || 0) + 1;
            results.patterns[ex.pattern] = (results.patterns[ex.pattern] || 0) + 1;
            
            // Per-Focus stats
            results.focusStats[focus].patterns[ex.pattern] = (results.focusStats[focus].patterns[ex.pattern] || 0) + 1;

            workoutPatterns.add(ex.pattern);
        });

        // Pair Analysis (Simple N^2 loop)
        for (let a = 0; a < workoutExercises.length; a++) {
            for (let b = a + 1; b < workoutExercises.length; b++) {
                const pair = [workoutExercises[a], workoutExercises[b]].sort().join(' + ');
                results.pairs[pair] = (results.pairs[pair] || 0) + 1;
            }
        }

        results.patternVarietyScore += workoutPatterns.size;

    } catch (e) {
        console.error("Generation failed:", e);
    }
}

const end = performance.now();

// --- REPORTING ---

console.log("\n--- DEEP ANALYSIS REPORT ---");
console.log(`Generated ${results.total} workouts in ${(end - start).toFixed(2)}ms`);

console.log("\n1. GLOBAL DISTRIBUTION");
console.log(`Strength Part: ${((results.strengthCount / results.total) * 100).toFixed(1)}%`);
console.log(`Buy-In: ${((results.buyInCount / results.total) * 100).toFixed(1)}%`);
console.log(`Avg Unique Patterns per Workout: ${(results.patternVarietyScore / results.total).toFixed(2)}`);

console.log("\n2. TOP 5 TEMPLATES");
Object.entries(results.templates)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([k, v]) => console.log(`- ${k}: ${v} (${((v / results.total) * 100).toFixed(1)}%)`));

console.log("\n3. PATTERN BIAS PER FOCUS (Top 3)");
foci.forEach(f => {
    const stats = results.focusStats[f];
    const topPatterns = Object.entries(stats.patterns)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([p, c]) => `${p} (${((c / stats.count) * 100).toFixed(0)}%)`) // approx % based on workout count (heuristic)
        .join(', ');
    console.log(`- ${f}: ${topPatterns}`);
});

console.log("\n4. TOP 10 EXERCISES");
const sortedEx = Object.entries(results.exercises).sort((a, b) => b[1] - a[1]).slice(0, 10);
sortedEx.forEach(([k, v]) => console.log(`- ${k}: ${v}`));

console.log("\n5. TOP 5 COMMON PAIRS (Repetition Check)");
const sortedPairs = Object.entries(results.pairs).sort((a, b) => b[1] - a[1]).slice(0, 5);
sortedPairs.forEach(([k, v]) => console.log(`- ${k}: ${v}`));

console.log("\n6. POTENTIAL ISSUES");
if (results.templates['Chipper'] > results.templates['AMRAP'] * 2) console.log("WARN: Chippers seem over-represented.");
const zeroPattern = Object.keys(results.patterns).length < 6 ? "WARN: Some patterns not appearing!" : "OK: All patterns present.";
console.log(zeroPattern);

console.log("\n--- END REPORT ---");