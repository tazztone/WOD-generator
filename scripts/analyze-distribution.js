import { generateWorkout } from '../src/engine/generator.js';
import { DEFAULT_CONFIG } from '../src/engine/storage.js';
import { EXERCISE_DB } from '../src/data/exercises.js';

const iterations = 10000;
const results = {
    total: 0,
    difficulty: { Rx: 0, Beginner: 0 },
    templates: {},
    patterns: {},
    exercises: {},
    tags: {}, 
    pairs: {},
    strengthCount: 0,
    buyInCount: 0,
    patternVarietyScore: 0,
    focusStats: {},
    pushCount: 0,
    pullCount: 0,
    impossibleCount: 0,
    skillInBeginnerCount: 0, // Track if high-skill moves leak into beginner
    chipperTags: {} 
};
// Calculate Pool Stats
const poolStats = {};
EXERCISE_DB.forEach(ex => {
    poolStats[ex.pattern] = (poolStats[ex.pattern] || 0) + 1;
});

// Config variants
const foci = ['Balanced', 'Cardio', 'Strength', 'Gymnastics', 'Core'];
const difficulties = ['Rx', 'Beginner'];

console.log(`Generating ${iterations} workouts across various configurations...`);
const start = performance.now();

for (let i = 0; i < iterations; i++) {
    const focus = foci[Math.floor(Math.random() * foci.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Random equipment config to test constraints
    const useBarbell = Math.random() > 0.3;
    const usePullup = Math.random() > 0.3;
    
    const config = {
        ...DEFAULT_CONFIG,
        templateType: 'Random',
        numExercises: 3 + Math.floor(Math.random() * 3),
        includeStrength: Math.random() > 0.5,
        focus: focus,
        difficulty: difficulty,
        duration: 10 + Math.floor(Math.random() * 50),
        equipment: { 
            barbell: useBarbell, 
            dumbbell: true, 
            pullupBar: usePullup, 
            machine: true 
        }
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

        const workoutPatterns = new Set();
        const workoutExercises = workout.exercises.map(e => e.exercise.name);

        // Chipper Analysis
        const isChipper = workout.template === 'Chipper';

        workout.exercises.forEach(slot => {
            const ex = slot.exercise;
            
            // Global stats
            results.exercises[ex.name] = (results.exercises[ex.name] || 0) + 1;
            results.patterns[ex.pattern] = (results.patterns[ex.pattern] || 0) + 1;
            
            // Push/Pull Ratio
            if (ex.pattern === 'Push') results.pushCount++;
            if (ex.pattern === 'Pull') results.pullCount++;

            // Impossible Check
            if (ex.equipment === 'Barbell' && !config.equipment.barbell) results.impossibleCount++;
            if (ex.equipment === 'PullupBar' && !config.equipment.pullupBar) results.impossibleCount++;

            // Skill Leak Check
            if (difficulty === 'Beginner' && ex.tags && ex.tags.includes('skill')) {
                results.skillInBeginnerCount++;
            }

            // Per-Focus stats
            results.focusStats[focus].patterns[ex.pattern] = (results.focusStats[focus].patterns[ex.pattern] || 0) + 1;

            // Tag stats
            if (ex.tags) {
                ex.tags.forEach(tag => {
                    results.tags[tag] = (results.tags[tag] || 0) + 1;
                    if (isChipper) {
                        results.chipperTags[tag] = (results.chipperTags[tag] || 0) + 1;
                    }
                });
            }

            workoutPatterns.add(ex.pattern);
        });

        // Pair Analysis
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
console.log(`Push/Pull Ratio: ${(results.pushCount / results.pullCount).toFixed(2)} (Ideal: ~1.0)`);
console.log(`Impossible Exercises Generated: ${results.impossibleCount} (Should be 0)`);
console.log(`Skill Leakage (Beginner): ${((results.skillInBeginnerCount / results.difficulty.Beginner) * 100).toFixed(2)}% (Lower is better)`);

console.log("\n2. POOL UTILIZATION (Hits per Available Exercise)");
const sortedPatterns = Object.keys(results.patterns).sort((a, b) => results.patterns[b] - results.patterns[a]);
sortedPatterns.forEach(p => {
    const hits = results.patterns[p];
    const poolSize = poolStats[p] || 1;
    const rate = (hits / poolSize).toFixed(1);
    console.log(`- ${p}: ${rate} hits/ex (Pool: ${poolSize}, Hits: ${hits})`);
});

console.log("\n3. CHIPPER COMPOSITION (Top Tags)");
const sortedChipperTags = Object.entries(results.chipperTags).sort((a, b) => b[1] - a[1]).slice(0, 5);
sortedChipperTags.forEach(([k, v]) => console.log(`- ${k}: ${v}`));

console.log("\n4. TOP 10 EXERCISES");
const sortedEx = Object.entries(results.exercises).sort((a, b) => b[1] - a[1]).slice(0, 10);
sortedEx.forEach(([k, v]) => console.log(`- ${k}: ${v}`));

console.log("\n5. TOP 5 TAGS (Workout Feel)");
const sortedTags = Object.entries(results.tags).sort((a, b) => b[1] - a[1]).slice(0, 5);
sortedTags.forEach(([k, v]) => console.log(`- ${k}: ${v}`));

console.log("\n6. POTENTIAL ISSUES");
if (results.pushCount > results.pullCount * 1.5) console.log("WARN: Push dominates Pull significantly.");
if (results.impossibleCount > 0) console.log("CRITICAL: Generator ignoring equipment constraints!");
const coreRate = results.patterns['Core'] / (poolStats['Core'] || 1);
if (coreRate > 200) console.log("WARN: Core exercises are highly repetitive (Small Pool).");

console.log("\n--- END REPORT ---");
