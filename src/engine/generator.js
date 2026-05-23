// src/engine/generator.js
import { EXERCISE_DB, INJURY_MAP } from '../data/exercises.js';
import { calculateBaseReps, getSubstitution } from './scaling.js';
import { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic, formatReps } from './utils.js';
import { getStrategy, getRandomTemplate } from './strategies/StrategyFactory.js';
import { BUY_IN_CONFIG } from '../config/workoutConfig.js';
import { STATIC_PIPELINE, DYNAMIC_PIPELINE } from './pipeline.js';
import { getSecureRandom } from './secureRandom.js';


export { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic, formatReps };


// Fast lookup index
const EXERCISE_MAP = new Map(EXERCISE_DB.map(e => [e.id, e]));

// --- The "Director" (Internal Logic) ---

class WorkoutDirector {
    constructor(config) {
        this.config = config;
        
        // Pre-compute forbidden tags Set for isExerciseValid (O(1) lookup inside loop)
        this.config.forbiddenTagsSet = new Set();
        if (config.avoid && config.avoid.length > 0) {
            config.avoid.forEach(area => {
                const tags = INJURY_MAP[area];
                if (tags) tags.forEach(t => this.config.forbiddenTagsSet.add(t));
            });
        }

        // Apply Static Pipeline ONCE to create the filtered base pool
        const basePool = EXERCISE_DB.filter(ex => isExerciseValid(ex, this.config));
        this.pool = STATIC_PIPELINE.reduce((currentPool, rule) => rule(currentPool, this), basePool);
        
        this.selectedExercises = [];
        this.selectedExerciseIds = new Set();
        this.usedPatterns = [];
        this.balance = { Push: 0, Pull: 0, Squat: 0, Hinge: 0, Core: 0, Cardio: 0 };
    }

    // Weight the pool based on Dynamic Pipeline Rules (O(N) instead of O(N*Pipeline_Count))
    getWeightedPool() {
        return DYNAMIC_PIPELINE.reduce((currentPool, rule) => rule(currentPool, this), this.pool);
    }

    pickNext(buyInContext = null) {
        this.buyInForContext = buyInContext;
        const candidates = this.getWeightedPool();
        this.buyInForContext = null;
        if (candidates.length === 0) return null;
        
        let picked = candidates[Math.floor(getSecureRandom() * candidates.length)];
        
        const subId = getSubstitution(picked.id, this.config.difficulty);
        if (subId) {
            const subEx = EXERCISE_MAP.get(subId);
            if (subEx) picked = subEx;
        }

        this.usedPatterns.push(picked.pattern);
        
        return picked;
    }

    addSelection(exercise, reps) {
        this.selectedExercises.push({ exercise, reps });
        this.selectedExerciseIds.add(exercise.id);
        this.balance[exercise.pattern]++;
    }
}


export const generateWorkout = (config) => {
    const director = new WorkoutDirector(config);
    
    let template = config.templateType;
    if (template === 'Random') template = getRandomTemplate();

    const strategy = getStrategy(template);
    const { rounds, timeCap } = strategy.calculateParams(config);
    let buyIn = null;

    // Smart Buy-In Logic
    if (config.duration > BUY_IN_CONFIG.MIN_DURATION && getSecureRandom() < BUY_IN_CONFIG.CHANCE) {
        let buyInPatterns = BUY_IN_CONFIG.PATTERNS[config.focus] || BUY_IN_CONFIG.PATTERNS.Default;
        
        const buyInPool = director.pool.filter(ex => buyInPatterns.includes(ex.pattern));
        
        if (buyInPool.length > 0) {
            const picked = buyInPool[Math.floor(getSecureRandom() * buyInPool.length)];
            buyIn = {
                exercise: picked,
                reps: picked.pattern === 'Cardio' ? BUY_IN_CONFIG.REPS.Cardio : BUY_IN_CONFIG.REPS.Default
            };
        }
    }

    // Main Selection Loop
    const targetCount = config.numExercises;

    for (let i = 0; i < targetCount; i++) {
        const picked = director.pickNext(i === 0 && buyIn ? buyIn.exercise : null);

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
        id: `wod-${crypto.randomUUID()}`,
        template,
        timeCap,
        rounds,
        exercises: director.selectedExercises,
        buyIn,
        isPartner: config.isPartner || false,
        generatedAt: new Date(),
        warmup: generateWarmupLogic(director.selectedExercises, config),
        strength: generateStrengthLogic(director.selectedExercises, config)
    };
};

export const swapExercise = (workout, index, newExerciseId, config) => {
    let newEx = EXERCISE_MAP.get(newExerciseId);
    if (!newEx) return workout;

    const subId = getSubstitution(newEx.id, config.difficulty);
    if (subId) {
        const subEx = EXERCISE_MAP.get(subId);
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
        warmup: generateWarmupLogic(newExercises, config),
        strength: generateStrengthLogic(newExercises, config)
    };
};
