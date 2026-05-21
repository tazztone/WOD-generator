import { describe, it, expect, vi } from 'vitest';
import * as pipeline from './pipeline.js';
import { FOCUS_PATTERNS } from '../config/workoutConfig.js';

vi.mock('./scaling.js', () => ({
    getSubstitution: (id, difficulty) => {
        if (difficulty === 'Beginner' && id === 'skill1') return 'sub1';
        return null;
    }
}));

describe('Pipeline Filters and Weights', () => {
    describe('alreadySelectedFilter', () => {
        it('should return the pool if director.selectedExerciseIds is not present', () => {
            const pool = [{ id: 'ex1' }];
            const director = {};
            expect(pipeline.alreadySelectedFilter(pool, director)).toEqual(pool);
        });

        it('should filter out already selected exercises', () => {
            const pool = [{ id: 'ex1' }, { id: 'ex2' }, { id: 'ex3' }];
            const director = { selectedExerciseIds: new Set(['ex2']) };
            const result = pipeline.alreadySelectedFilter(pool, director);
            expect(result).toEqual([{ id: 'ex1' }, { id: 'ex3' }]);
        });
    });

    describe('skillFilter', () => {
        it('should return the pool if difficulty is not Beginner', () => {
            const pool = [{ id: 'skill1', tags: ['skill'] }];
            const director = { config: { difficulty: 'Rx' } };
            expect(pipeline.skillFilter(pool, director)).toEqual(pool);
        });

        it('should return exercises without skill tag for Beginners', () => {
            const pool = [{ id: 'ex1', tags: ['core'] }];
            const director = { config: { difficulty: 'Beginner' } };
            expect(pipeline.skillFilter(pool, director)).toEqual(pool);
        });

        it('should return exercises with skill tag if they have a substitution', () => {
            const pool = [{ id: 'skill1', tags: ['skill'] }, { id: 'skill2', tags: ['skill'] }];
            const director = { config: { difficulty: 'Beginner' } };
            const result = pipeline.skillFilter(pool, director);
            expect(result).toEqual([{ id: 'skill1', tags: ['skill'] }]);
        });

        it('should return exercises without tags for Beginners', () => {
            const pool = [{ id: 'ex1' }];
            const director = { config: { difficulty: 'Beginner' } };
            expect(pipeline.skillFilter(pool, director)).toEqual(pool);
        });
    });

    describe('focusRelevanceFilter', () => {
        it('should return the pool if focus is not Gymnastics', () => {
            const pool = [{ id: 'ex1', equipment: 'Barbell' }];
            const director = { config: { focus: 'Cardio' } };
            expect(pipeline.focusRelevanceFilter(pool, director)).toEqual(pool);
        });

        it('should exclude heavy equipment if focus is Gymnastics', () => {
            const pool = [
                { id: 'ex1', equipment: 'Barbell' },
                { id: 'ex2', equipment: 'Dumbbell' },
                { id: 'ex3', equipment: 'Kettlebell' },
                { id: 'ex4', equipment: 'Machine' },
                { id: 'ex5', equipment: 'None' },
                { id: 'ex6', equipment: 'PullupBar' }
            ];
            const director = { config: { focus: 'Gymnastics' } };
            const result = pipeline.focusRelevanceFilter(pool, director);
            expect(result).toEqual([
                { id: 'ex5', equipment: 'None' },
                { id: 'ex6', equipment: 'PullupBar' }
            ]);
        });

        it('should handle an empty pool', () => {
            const pool = [];
            const director = { config: { focus: 'Gymnastics' } };
            const result = pipeline.focusRelevanceFilter(pool, director);
            expect(result).toEqual([]);
        });

        it('should not exclude exercises without an equipment property', () => {
            const pool = [{ id: 'ex1' }];
            const director = { config: { focus: 'Gymnastics' } };
            const result = pipeline.focusRelevanceFilter(pool, director);
            expect(result).toEqual(pool);
        });

        it('should handle missing focus property in config', () => {
            const pool = [{ id: 'ex1', equipment: 'Barbell' }];
            const director = { config: {} };
            const result = pipeline.focusRelevanceFilter(pool, director);
            expect(result).toEqual(pool);
        });
    });

    describe('overlapFilter', () => {
        it('should return the pool if there is no last exercise', () => {
            const pool = [{ id: 'ex1' }];
            const director = { selectedExercises: [], buyInForContext: null };
            expect(pipeline.overlapFilter(pool, director)).toEqual(pool);
        });

        it('should filter out exercises with the same strict pattern', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', pattern: 'Pull' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Push' }]);
        });

        it('should filter out exercises with the same id as the last exercise', () => {
            const pool = [{ id: 'ex1', pattern: 'Core' }, { id: 'lastEx', pattern: 'Push' }];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', pattern: 'Pull' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex1', pattern: 'Core' }]);
        });

        it('should filter out exercises with clash tags', () => {
            const pool = [
                { id: 'ex1', tags: ['shoulders', 'push'], pattern: 'Push' },
                { id: 'ex2', tags: ['legs'], pattern: 'Squat' }
            ];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['shoulders', 'core'], pattern: 'Core' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', tags: ['legs'], pattern: 'Squat' }]);
        });

        it('should check buyInForContext if selectedExercises is empty', () => {
            const pool = [{ id: 'ex1', pattern: 'Cardio' }, { id: 'ex2', pattern: 'Core' }];
            const director = { selectedExercises: [], buyInForContext: { id: 'buyin', pattern: 'Cardio' } };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Core' }]);
        });
    });

    describe('balanceWeight', () => {
        it('should add Pull candidates if Push > Pull', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            const director = { balance: { Push: 2, Pull: 1 } };
            const result = pipeline.balanceWeight(pool, director);
            // Expected length: 2 (original) + 1 (Pull) * 2 = 4
            expect(result.length).toBe(4);
            expect(result.filter(ex => ex.pattern === 'Pull').length).toBe(3);
        });

        it('should add Push candidates if Pull > Push', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            const director = { balance: { Push: 1, Pull: 2 } };
            const result = pipeline.balanceWeight(pool, director);
            // Expected length: 2 (original) + 1 (Push) * 2 = 4
            expect(result.length).toBe(4);
            expect(result.filter(ex => ex.pattern === 'Push').length).toBe(3);
        });

        it('should return the pool unmodified if Push == Pull', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            const director = { balance: { Push: 1, Pull: 1 } };
            expect(pipeline.balanceWeight(pool, director)).toEqual(pool);
        });

        it('should handle no candidates found', () => {
            const pool = [{ id: 'ex2', pattern: 'Push' }];
            const director = { balance: { Push: 2, Pull: 1 } }; // wants pull
            const result = pipeline.balanceWeight(pool, director);
            expect(result).toEqual(pool);
        });
    });

    describe('focusWeight', () => {
        it('should return the pool unmodified if focus is Balanced', () => {
            const pool = [{ id: 'ex1', pattern: 'Cardio' }];
            const director = { config: { focus: 'Balanced' } };
            expect(pipeline.focusWeight(pool, director)).toEqual(pool);
        });

        it('should boost priority moves by duplicating them based on FOCUS_PATTERNS', () => {
            const pool = [
                { id: 'ex1', pattern: 'Cardio' },
                { id: 'ex2', pattern: 'Squat' }
            ];

            // Using actual constant from workoutConfig.js
            // FOCUS_PATTERNS['Cardio'] = ['Cardio']
            const director = { config: { focus: 'Cardio' } };
            const result = pipeline.focusWeight(pool, director);

            // Expected length: 2 (original) + 1 (Cardio) * 3 = 5
            expect(result.length).toBe(5);
            expect(result.filter(ex => ex.pattern === 'Cardio').length).toBe(4);
            expect(result.filter(ex => ex.pattern === 'Squat').length).toBe(1);
        });

        it('should return pool unmodified if no priority moves match', () => {
            const pool = [
                { id: 'ex1', pattern: 'Weightlifting' }
            ];
            // Using actual constant
            const director = { config: { focus: 'Cardio' } };
            const result = pipeline.focusWeight(pool, director);
            expect(result).toEqual(pool);
        });
    });
});