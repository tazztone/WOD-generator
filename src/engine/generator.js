// src/engine/generator.js
import { EXERCISE_DB } from '../data/exercises.js';
import { calculateBaseReps, getSubstitution } from './scaling.js';
import { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic } from './utils.js';
import { getStrategy, getRandomTemplate } from './strategies/StrategyFactory.js';
import { BUY_IN_CONFIG } from '../config/workoutConfig.js';
import { DEFAULT_PIPELINE } from './pipeline.js';

export { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic };

// --- The "Director" (Internal Logic) ---

class WorkoutDirector {
    constructor(config, pipeline = DEFAULT_PIPELINE) {
        this.config = config;
        this.pipeline = pipeline;
        this.pool = EXERCISE_DB.filter(ex => isExerciseValid(ex, config));
        this.selectedExercises = [];
        this.usedPatterns = [];
        this.balance = { Push: 0, Pull: 0, Squat: 0, Hinge: 0, Core: 0, Cardio: 0 };
    }

    // Weight the pool based on Pipeline Rules
    getWeightedPool() {
        return this.pipeline.reduce((currentPool, rule) => rule(currentPool, this), this.pool);
    }

    pickNext() {
        const candidates = this.getWeightedPool();
        if (candidates.length === 0) return null;
        
        let picked = candidates[Math.floor(Math.random() * candidates.length)];
        
        const subId = getSubstitution(picked.id, this.config.difficulty);
        if (subId) {
            const subEx = EXERCISE_DB.find(e => e.id === subId);
            if (subEx) picked = subEx;
        }

        this.usedPatterns.push(picked.pattern);
        this.balance[picked.pattern]++;
        
        return picked;
    }

    addSelection(exercise, reps) {
        this.selectedExercises.push({ exercise, reps });
        this.balance[exercise.pattern]++;
    }
}


export const generateWorkout = (config, lang = 'en') => {
    const director = new WorkoutDirector(config);
    
    let template = config.templateType;
    if (template === 'Random') template = getRandomTemplate();

    const strategy = getStrategy(template);
    const { rounds, timeCap } = strategy.calculateParams(config);
    let buyIn = null;

    // Smart Buy-In Logic
    if (config.duration > BUY_IN_CONFIG.MIN_DURATION && Math.random() < BUY_IN_CONFIG.CHANCE) {
        let buyInPatterns = BUY_IN_CONFIG.PATTERNS[config.focus] || BUY_IN_CONFIG.PATTERNS.Default;
        
        const buyInPool = director.pool.filter(ex => buyInPatterns.includes(ex.pattern));
        
        if (buyInPool.length > 0) {
            const picked = buyInPool[Math.floor(Math.random() * buyInPool.length)];
            buyIn = {
                exercise: picked,
                reps: picked.pattern === 'Cardio' ? BUY_IN_CONFIG.REPS.Cardio : BUY_IN_CONFIG.REPS.Default
            };
        }
    }

    // Main Selection Loop
    const targetCount = config.numExercises;

    for (let i = 0; i < targetCount; i++) {
        if (buyIn) {
             director.selectedExercises.push({ exercise: buyIn.exercise, reps: 0 }); 
        }

        const picked = director.pickNext();
        
        if (buyIn) {
             director.selectedExercises.pop();
        }

        if (!picked) break;

        // --- NEW STRATEGY SCALING ---
        const baseReps = calculateBaseReps(picked, config.difficulty, config.duration);
        let reps = strategy.scaleReps(baseReps, picked, config.difficulty, config.duration);

        if (config.isPartner && typeof reps === 'number') {
            reps = reps * 2;
        }

        director.addSelection(picked, reps);
    }

    return {
        template,
        timeCap,
        rounds,
        exercises: director.selectedExercises,
        buyIn,
        isPartner: config.isPartner || false,
        generatedAt: new Date(),
        warmup: generateWarmupLogic(director.selectedExercises, lang),
        strength: generateStrengthLogic(director.selectedExercises, config, lang)
    };
};

export const swapExercise = (workout, index, newExerciseId, config, lang = 'en') => {
    let newEx = EXERCISE_DB.find(e => e.id === newExerciseId);
    if (!newEx) return workout;

    const subId = getSubstitution(newEx.id, config.difficulty);
    if (subId) {
        const subEx = EXERCISE_DB.find(e => e.id === subId);
        if (subEx) newEx = subEx;
    }

    const newExercises = [...workout.exercises];
    
    // --- NEW STRATEGY SCALING ---
    const strategy = getStrategy(workout.template);
    const baseReps = calculateBaseReps(newEx, config.difficulty, config.duration);
    let reps = strategy.scaleReps(baseReps, newEx, config.difficulty, config.duration);

    if (config.isPartner && typeof reps === 'number') reps = reps * 2;

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