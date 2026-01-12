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

    it('should respect injury avoidance', () => {
        const config = {
            difficulty: 'Rx',
            avoid: ['Knees'],
            equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true }
        };

        const squatEx = EXERCISE_DB.find(e => e.pattern === 'Squat'); // Should have 'knees' tag
        expect(isExerciseValid(squatEx, config)).toBe(false);
    });

    it('should scale reps for beginners', () => {
        const ex = { name: 'Push-Up', intensity: 'Low', equipment: 'Bodyweight' };

        const rxReps = getReps(ex, 'Rx', 'AMRAP', 15);
        const scaledReps = getReps(ex, 'Beginner', 'AMRAP', 15);

        expect(scaledReps).toBeLessThan(rxReps);
    });
});
