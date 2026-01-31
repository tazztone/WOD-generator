// src/engine/generator.js
import { EXERCISE_DB } from '../data/exercises.js';
import { calculateBaseReps, getSubstitution } from './scaling.js';
import { getExerciseName, isExerciseValid, generateWarmupLogic, generateStrengthLogic } from './utils.js';
import { getStrategy, getRandomTemplate } from './strategies/StrategyFactory.js';

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
        
        // 2. Skill Filter for Beginners
        if (this.config.difficulty === 'Beginner') {
            candidates = candidates.filter(ex => {
                if (!ex.tags || !ex.tags.includes('skill')) {
                    return true; // Not a skill move, always allowed
                }
                // It IS a skill move, only allow if a substitution exists
                return getSubstitution(ex.id, this.config.difficulty) !== null;
            });
        }

        // 3. Flow Control (Prevent Muscle Overlap)
        if (this.selectedExercises.length > 0) {
            const lastEx = this.selectedExercises[this.selectedExercises.length - 1].exercise;
            const clashTags = ['shoulders', 'legs', 'grip', 'core', 'overhead'];
            
            candidates = candidates.filter(ex => {
                if (ex.pattern !== lastEx.pattern) return true;
                if (lastEx.tags && ex.tags) {
                     const shared = lastEx.tags.filter(t => ex.tags.includes(t) && clashTags.includes(t));
                     if (shared.length > 0) return false;
                }
                return true;
            });

            // STRICT Pattern Filter
            candidates = candidates.filter(ex => ex.pattern !== lastEx.pattern);
        }

        // 3. Dynamic Balancing (Push vs Pull)
        if (this.balance.Push > this.balance.Pull) {
            const pullCandidates = candidates.filter(ex => ex.pattern === 'Pull');
            if (pullCandidates.length > 0) {
                candidates = [...candidates, ...pullCandidates, ...pullCandidates];
            }
        }

        // 4. Focus Bias
        if (this.config.focus !== 'Balanced') {
            const focusPatterns = {
                'Cardio': ['Cardio'],
                'Strength': ['Squat', 'Hinge', 'Push', 'Pull'],
                'Gymnastics': ['Pull', 'Core', 'Push'],
                'Core': ['Core']
            };
            const targetPatterns = focusPatterns[this.config.focus] || [];
            const priorityMoves = candidates.filter(ex => targetPatterns.includes(ex.pattern));
            if (priorityMoves.length > 0) {
                candidates = [...candidates, ...priorityMoves, ...priorityMoves];
            }
        }

        return candidates;
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
    if (config.duration > 10 && Math.random() < 0.20) {
        let buyInPatterns = ['Cardio', 'Core'];
        if (config.focus === 'Cardio') buyInPatterns = ['Core'];
        if (config.focus === 'Strength') buyInPatterns = ['Cardio'];
        
        const buyInPool = director.pool.filter(ex => buyInPatterns.includes(ex.pattern));
        
        if (buyInPool.length > 0) {
            const picked = buyInPool[Math.floor(Math.random() * buyInPool.length)];
            buyIn = {
                exercise: picked,
                reps: picked.pattern === 'Cardio' ? '500m / 40 cal' : 50
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