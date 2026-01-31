// src/engine/generator.js
import { EXERCISE_DB } from '../data/exercises.js';
import { getReps, getSubstitution } from './scaling.js';
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
        // Especially critical for Chippers, but good for all workouts to avoid local fatigue
        if (this.selectedExercises.length > 0) {
            const lastEx = this.selectedExercises[this.selectedExercises.length - 1].exercise;
            
            // Filter candidates that share significant muscle groups with the last exercise
            // We define "clash" if they share specific tags
            const clashTags = ['shoulders', 'legs', 'grip', 'core', 'overhead'];
            
            candidates = candidates.filter(ex => {
                // Always allow switching patterns
                if (ex.pattern !== lastEx.pattern) return true;
                
                // If same pattern (should be rare due to pattern filter), check tags strictly
                if (lastEx.tags && ex.tags) {
                     const shared = lastEx.tags.filter(t => ex.tags.includes(t) && clashTags.includes(t));
                     // If they share a major muscle group tag, de-prioritize or filter
                     if (shared.length > 0) return false;
                }
                return true;
            });

            // STRICT Pattern Filter: Don't repeat pattern immediately
            candidates = candidates.filter(ex => ex.pattern !== lastEx.pattern);
        }

        // 3. Dynamic Balancing (Push vs Pull)
        // If we have selected Push but no Pull, prioritize Pull
        if (this.balance.Push > this.balance.Pull) {
            const pullCandidates = candidates.filter(ex => ex.pattern === 'Pull');
            if (pullCandidates.length > 0) {
                // Boost Pull candidates by adding them again (increasing probability)
                candidates = [...candidates, ...pullCandidates, ...pullCandidates];
            }
        }

        // 4. Focus Bias
        if (this.config.focus !== 'Balanced') {
            const focusPatterns = {
                'Cardio': ['Cardio'],
                'Strength': ['Squat', 'Hinge', 'Push', 'Pull'], // Added Pull to Strength focus
                'Gymnastics': ['Pull', 'Core', 'Push'],
                'Core': ['Core']
            };
            const targetPatterns = focusPatterns[this.config.focus] || [];
            
            // Filter candidates to prefer focus patterns
            const priorityMoves = candidates.filter(ex => targetPatterns.includes(ex.pattern));
            
            // Heavy Weighting: Add priority moves multiple times to sway the RNG
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
        
        // Apply Smart Substitution for Beginners
        const subId = getSubstitution(picked.id, this.config.difficulty);
        if (subId) {
            const subEx = EXERCISE_DB.find(e => e.id === subId);
            if (subEx) picked = subEx;
        }

        // Update State
        this.usedPatterns.push(picked.pattern);
        this.balance[picked.pattern]++;
        
        return picked;
    }

    addSelection(exercise, reps) {
        this.selectedExercises.push({ exercise, reps });
        // Update balance manually if added externally (like buy-in hack)
        this.balance[exercise.pattern]++;
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

    // Smart Buy-In Logic
    // Only add buy-in if duration is decent
    if (config.duration > 10 && Math.random() < 0.20) { // Increased chance slightly
        // Complementary Logic:
        // If Focus is Cardio -> Buy-In should be Strength/Core
        // If Focus is Strength -> Buy-In should be Cardio/Core
        
        let buyInPatterns = ['Cardio', 'Core'];
        if (config.focus === 'Cardio') buyInPatterns = ['Core']; // Avoid more cardio
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
    let newEx = EXERCISE_DB.find(e => e.id === newExerciseId);
    if (!newEx) return workout;

    // Apply Smart Substitution for Beginners
    const subId = getSubstitution(newEx.id, config.difficulty);
    if (subId) {
        const subEx = EXERCISE_DB.find(e => e.id === subId);
        if (subEx) newEx = subEx;
    }

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