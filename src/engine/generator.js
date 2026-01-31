// src/engine/generator.js
import { EXERCISE_DB } from '../data/exercises.js';
import { getReps } from './scaling.js';
import { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic } from './utils.js';

export { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic };

// --- The "Director" (Internal Logic) ---

class WorkoutDirector {
    constructor(config) {
        this.config = config;
        this.pool = EXERCISE_DB.filter(ex => isExerciseValid(ex, config));
        this.selectedExercises = [];
        this.usedPatterns = [];
        this.balance = { Push: 0, Pull: 0, Squat: 0, Hinge: 0, Core: 0, Cardio: 0 };
    }

    // Weight the pool based on Focus and Current Balance
    getWeightedPool() {
        // 1. Basic Filter: Remove already selected
        let candidates = this.pool.filter(ex => !this.selectedExercises.some(s => s.exercise.id === ex.id));
        
        // 2. Pattern Filter: Don't repeat the exact same pattern immediately (unless focused)
        if (this.usedPatterns.length > 0) {
            const lastPattern = this.usedPatterns[this.usedPatterns.length - 1];
            candidates = candidates.filter(ex => ex.pattern !== lastPattern);
        }

        // 3. Focus Bias (Existing Logic preserved for now, to be enhanced)
        if (this.config.focus !== 'Balanced') {
            const focusPatterns = {
                'Cardio': ['Cardio'],
                'Strength': ['Squat', 'Hinge', 'Push'],
                'Gymnastics': ['Pull', 'Core', 'Push'],
                'Core': ['Core']
            };
            const targetPatterns = focusPatterns[this.config.focus] || [];
            // We don't filter out others, but we might pick from a "favored" subset
             const priorityMoves = candidates.filter(ex => targetPatterns.includes(ex.pattern));
             candidates = [...candidates, ...priorityMoves];
        }

        return candidates;
    }

    pickNext() {
        const candidates = this.getWeightedPool();
        if (candidates.length === 0) return null;
        
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        
        // Update State
        this.usedPatterns.push(picked.pattern);
        this.balance[picked.pattern]++;
        
        return picked;
    }

    addSelection(exercise, reps) {
        this.selectedExercises.push({ exercise, reps });
    }
}


export const generateWorkout = (config, lang = 'en') => {
    const director = new WorkoutDirector(config);
    
    // Templates pool
    const templates = ['AMRAP', 'RFT', 'EMOM', 'Ladder', 'Death By'];
    let template = config.templateType;
    if (template === 'Random') template = templates[Math.floor(Math.random() * templates.length)];

    let timeCap = config.duration;
    let rounds = 0;
    let buyIn = null;

    // Template Config
    if (template === 'RFT') {
        const avgRepTimeMin = 1.5;
        rounds = Math.max(3, Math.floor(config.duration / avgRepTimeMin));
    } else if (template === 'EMOM') {
        rounds = config.duration;
    } else if (template === 'Chipper') {
        rounds = 1;
    } else if (template === 'Tabata') {
        timeCap = 4;
        rounds = 8;
    } else if (template === 'Death By') {
        rounds = config.duration;
    } else if (template === 'Ladder') {
        rounds = 1;
    }

    // Buy-In Logic
    if (config.duration > 10 && Math.random() < 0.15) {
        const buyInPool = director.pool.filter(ex => ex.pattern === 'Cardio' || ex.pattern === 'Core');
        if (buyInPool.length > 0) {
            const picked = buyInPool[Math.floor(Math.random() * buyInPool.length)];
            buyIn = {
                exercise: picked,
                reps: picked.pattern === 'Cardio' ? '500m / 40 cal' : 50
            };
            // Tell director to avoid this ID (Hack: temporary add/remove handled in loop below)
        }
    }

    // Main Selection Loop
    const targetCount = config.numExercises;

    for (let i = 0; i < targetCount; i++) {
        // Manually filter buy-in if it exists to avoid duplicate
        if (buyIn) {
             director.selectedExercises.push({ exercise: buyIn.exercise, reps: 0 }); 
        }

        const picked = director.pickNext();
        
        if (buyIn) {
             director.selectedExercises.pop();
        }

        if (!picked) break;

        let reps = getReps(picked, config.difficulty, template, timeCap);

        if (config.isPartner && typeof reps === 'number') {
            reps = reps * 2;
        }

        if (template === 'Ladder') {
            const isAsc = Math.random() > 0.5;
            reps = isAsc ? "1-2-3-4..." : "10-9-8...1";
        } else if (template === 'Death By') {
            reps = "1 + 1 every min";
        }

        director.addSelection(picked, reps);
    }

    return {
        template,
        timeCap,
        rounds: (template === 'RFT' || template === 'EMOM' || template === 'Tabata' || template === 'Death By') ? rounds : null,
        exercises: director.selectedExercises,
        buyIn,
        isPartner: config.isPartner || false,
        generatedAt: new Date(),
        warmup: generateWarmupLogic(director.selectedExercises, lang),
        strength: generateStrengthLogic(director.selectedExercises, config, lang)
    };
};

export const swapExercise = (workout, index, newExerciseId, config, lang = 'en') => {
    const newEx = EXERCISE_DB.find(e => e.id === newExerciseId);
    if (!newEx) return workout;

    const newExercises = [...workout.exercises];
    let reps = getReps(newEx, config.difficulty, workout.template, workout.timeCap);

    if (config.isPartner && typeof reps === 'number') reps = reps * 2;

    if (workout.template === 'Ladder') {
        const isAsc = Math.random() > 0.5;
        reps = isAsc ? "1-2-3-4..." : "10-9-8...1";
    } else if (workout.template === 'Death By') {
        reps = "1 + 1 every min";
    }

    newExercises[index] = {
        exercise: newEx,
        reps: reps
    };

    return {
        ...workout,
        exercises: newExercises,
        warmup: generateWarmupLogic(newExercises, lang),
        strength: generateStrengthLogic(newExercises, config, lang)
    };
};
