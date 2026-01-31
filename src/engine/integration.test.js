import { describe, it, expect } from 'vitest';
import { generateWorkout, swapExercise } from './generator';
import { getReps } from './scaling';
import { EXERCISE_DB } from '../data/exercises';

describe('Workout Generation Integration', () => {
    const mockConfig = {
        duration: 20,
        numExercises: 4,
        difficulty: 'Rx',
        focus: 'Balanced',
        templateType: 'AMRAP',
        equipment: {
            barbell: true,
            dumbbell: true,
            pullupBar: true,
            machine: true
        },
        avoid: [],
        includeStrength: true,
        isPartner: false,
        volume: 0.5
    };

    it('should generate a valid workout and allow exercise swapping', () => {
        const workout = generateWorkout(mockConfig, 'en');

        // 1. Verify structure
        expect(workout).toHaveProperty('template');
        expect(workout).toHaveProperty('exercises');
        expect(workout.exercises.length).toBeLessThanOrEqual(mockConfig.numExercises);
        expect(workout).toHaveProperty('warmup');
        expect(workout).toHaveProperty('strength');

        // 2. Verify warmup logic responds to exercises
        expect(workout.warmup.length).toBeGreaterThan(0);

        // 3. Simulate Swap
        const indexToSwap = 0;
        const originalExercise = workout.exercises[indexToSwap].exercise;

        // Find a candidate for swap (different ID but same pattern if possible)
        const newEx = EXERCISE_DB.find(ex => ex.id !== originalExercise.id && ex.pattern === originalExercise.pattern);

        if (newEx) {
            const updatedWorkout = swapExercise(workout, indexToSwap, newEx.id, mockConfig, 'en');

            expect(updatedWorkout.exercises[indexToSwap].exercise.id).toBe(newEx.id);
            expect(updatedWorkout.exercises[indexToSwap].exercise.id).not.toBe(originalExercise.id);

            // Warmup should be updated
            expect(updatedWorkout.warmup).toBeDefined();
        }
    });

    it('should handle extreme duration scaling correctly', () => {
        const longDuration = 90; // Extreme
        const shortExercise = EXERCISE_DB.find(e => e.pattern === 'Push' && e.intensity === 'High');

        const repsExtreme = getReps(shortExercise, 'Rx', 'AMRAP', longDuration);
        const repsNormal = getReps(shortExercise, 'Rx', 'AMRAP', 20);

        // Extreme duration should have lower reps per round in AMRAP to maintain pacing
        expect(repsExtreme).toBeLessThanOrEqual(repsNormal);
        expect(typeof repsExtreme).toBe('number');
        expect(isNaN(repsExtreme)).toBe(false);
    });

    it('should handle empty exercise pools gracefully', () => {
        const restrictiveConfig = {
            ...mockConfig,
            equipment: {
                barbell: false,
                dumbbell: false,
                pullupBar: false,
                machine: false
            }
        };

        // When gear is disabled, only bodyweight exercises should be present
        const workout = generateWorkout(restrictiveConfig, 'en');
        workout.exercises.forEach(slot => {
            expect(['Bodyweight', 'None']).toContain(slot.exercise.equipment);
        });
    });

    it('should respect injury filters', () => {
        const injuryConfig = {
            ...mockConfig,
            avoid: ['Knees']
        };

        const workout = generateWorkout(injuryConfig, 'en');

        // Check if any exercise contains tags forbidden by Knee injury (e.g., 'Lower')
        // In exercises.js, INJURY_MAP['Knees'] = ['Lower', 'Impact']
        workout.exercises.forEach(slot => {
            const tags = slot.exercise.tags || [];
            expect(tags).not.toContain('Lower');
            expect(tags).not.toContain('Impact');
        });
    });
});
