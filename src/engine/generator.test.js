import { describe, it, expect } from 'vitest';
import { generateWorkout, getReps, isExerciseValid } from './generator';
import { EXERCISE_DB } from '../data/exercises';

describe('Generator Engine', () => {

    it('should generate a workout structure', () => {
        const config = {
            duration: 15,
            difficulty: 'Rx',
            focus: 'Balanced',
            templateType: 'Random',
            includeStrength: false,
            numExercises: 3,
            avoid: [],
            equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true }
        };

        const workout = generateWorkout(config);
        expect(workout).toHaveProperty('template');
        expect(workout).toHaveProperty('timeCap');
        expect(workout).toHaveProperty('exercises');
        expect(workout.exercises).toHaveLength(3);
    });

    it('should respect equipment filters', () => {
        const config = {
            difficulty: 'Rx',
            avoid: [],
            equipment: { barbell: false, dumbbell: false, pullupBar: false, machine: false } // Bodyweight only
        };

        // Test specific exercises
        const barbellEx = EXERCISE_DB.find(e => e.equipment === 'Barbell');
        expect(isExerciseValid(barbellEx, config)).toBe(false);

        const bodyweightEx = EXERCISE_DB.find(e => e.equipment === 'Bodyweight');
        expect(isExerciseValid(bodyweightEx, config)).toBe(true);
    });

    it('should respect injury avoidance (Shoulders)', () => {
        const config = {
            difficulty: 'Rx',
            avoid: ['Shoulders'],
            equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true, bodyweight: true }
        };

        const shoulderEx = EXERCISE_DB.find(e => e.tags.includes('shoulders'));
        expect(isExerciseValid(shoulderEx, config)).toBe(false);

        const legEx = EXERCISE_DB.find(e => !e.tags.includes('shoulders') && !e.tags.includes('overhead'));
        if (legEx) expect(isExerciseValid(legEx, config)).toBe(true);
    });

    it('should respect injury avoidance (Knees)', () => {
        const config = {
            difficulty: 'Rx',
            avoid: ['Knees'],
            equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true, bodyweight: true }
        };

        const kneeEx = EXERCISE_DB.find(e => e.tags.includes('knees'));
        expect(isExerciseValid(kneeEx, config)).toBe(false);
    });

    it('should scale reps for beginners', () => {
        const ex = { name: 'Push-Up', intensity: 'Low', equipment: 'Bodyweight' };

        const rxReps = getReps(ex, 'Rx', 'AMRAP', 15);
        const scaledReps = getReps(ex, 'Beginner', 'AMRAP', 15);

        expect(scaledReps).toBeLessThan(rxReps);
    });

    it('should handle specialized exercise logic (SU, Wall Sit)', () => {
        const su = { name: 'Single Unders', intensity: 'Low', equipment: 'Bodyweight' };
        const du = { name: 'Double Unders', intensity: 'High', equipment: 'Bodyweight' };
        const wallSit = { name: 'Wall Sit', intensity: 'Low', equipment: 'Bodyweight' };

        expect(getReps(su, 'Rx', 'AMRAP', 15)).toBe(60);
        expect(getReps(du, 'Rx', 'AMRAP', 15)).toBe(40);
        expect(getReps(wallSit, 'Rx', 'AMRAP', 15)).toBe('45s');
    });
});
