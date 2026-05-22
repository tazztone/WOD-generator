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

        it('should prioritize selectedExercises over buyInForContext when both are present', () => {
            const pool = [
                { id: 'ex1', pattern: 'Cardio' }, // Matches buyInForContext
                { id: 'ex2', pattern: 'Core' },   // Matches selectedExercises
                { id: 'ex3', pattern: 'Push' }    // Matches neither
            ];
            const director = {
                selectedExercises: [{ exercise: { id: 'lastEx', pattern: 'Core' } }],
                buyInForContext: { id: 'buyin', pattern: 'Cardio' }
            };
            const result = pipeline.overlapFilter(pool, director);
            // It should filter out 'Core' (ex2) and keep 'Cardio' (ex1) and 'Push' (ex3)
            expect(result).toEqual([{ id: 'ex1', pattern: 'Cardio' }, { id: 'ex3', pattern: 'Push' }]);
        });

        it('should handle lastEx having no tags property', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            // lastEx has no tags property
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', pattern: 'Pull' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Push' }]);
        });

        it('should handle pool exercises having no tags property when lastEx has clash tags', () => {
            const pool = [
                { id: 'ex1', pattern: 'Push' }, // no tags
                { id: 'ex2', tags: ['shoulders'], pattern: 'Push' }
            ];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['shoulders'], pattern: 'Core' } }] };
            const result = pipeline.overlapFilter(pool, director);
            // ex1 has no tags, so it shouldn't be filtered by clash tag (but might be filtered by pattern if it matched).
            // ex2 has clash tag 'shoulders', so it gets filtered out.
            expect(result).toEqual([{ id: 'ex1', pattern: 'Push' }]);
        });

        it('should reuse a cached _clashSet if present on lastEx', () => {
            const pool = [{ id: 'ex1', tags: ['legs'], pattern: 'Squat' }];
            const cachedClashSet = new Set(['legs']);
            const director = {
                selectedExercises: [{
                    exercise: { id: 'lastEx', _clashSet: cachedClashSet, pattern: 'Core' }
                }]
            };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([]); // 'legs' is in the cached _clashSet, so ex1 gets filtered out
        });

        it('should handle lastEx having tags, but none that intersect with CLASH_SET', () => {
            const pool = [
                { id: 'ex1', pattern: 'Pull' },
                { id: 'ex2', pattern: 'Push' }
            ];
            // 'non-clashing' is not in CLASH_SET ('shoulders', 'legs', 'grip', 'core', 'overhead')
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['non-clashing'], pattern: 'Pull' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Push' }]);
        });

        it('should filter out same id and pattern even when lastEx has clash tags', () => {
            const pool = [
                { id: 'lastEx', tags: ['non-clashing'], pattern: 'Squat' }, // Same id
                { id: 'ex1', tags: ['non-clashing'], pattern: 'Push' }, // Same pattern
                { id: 'ex2', tags: ['non-clashing'], pattern: 'Pull' } // OK
            ];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['shoulders'], pattern: 'Push' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', tags: ['non-clashing'], pattern: 'Pull' }]);
        });

        it('should filter out exercises with the same pattern even if lastEx has clash tags', () => {
            const pool = [{ id: 'ex1', pattern: 'Push' }, { id: 'ex2', pattern: 'Squat' }];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['shoulders'], pattern: 'Push' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Squat' }]);
        });

        it('should filter out exercises with the same ID even if lastEx has clash tags', () => {
            const pool = [{ id: 'lastEx', pattern: 'Core' }, { id: 'ex2', pattern: 'Squat' }];
            const director = { selectedExercises: [{ exercise: { id: 'lastEx', tags: ['core'], pattern: 'Push' } }] };
            const result = pipeline.overlapFilter(pool, director);
            expect(result).toEqual([{ id: 'ex2', pattern: 'Squat' }]);
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

        it('should handle no Push candidates found when Pull > Push', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }];
            const director = { balance: { Push: 1, Pull: 2 } }; // wants push
            const result = pipeline.balanceWeight(pool, director);
            expect(result).toEqual(pool);
        });

        it('should handle missing properties in director.balance gracefully', () => {
            const pool = [{ id: 'ex1', pattern: 'Pull' }, { id: 'ex2', pattern: 'Push' }];
            const director = { balance: {} };
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

        it('should return the pool unmodified if the focus is unknown and has no target patterns', () => {
            const pool = [
                { id: 'ex1', pattern: 'Cardio' }
            ];
            const director = { config: { focus: 'UnknownFocus' } };
            const result = pipeline.focusWeight(pool, director);
            expect(result).toEqual(pool);
        });
    });

    describe('Pipelines Composition', () => {
        it('STATIC_PIPELINE should contain the correct filters in order', () => {
            expect(pipeline.STATIC_PIPELINE).toEqual([
                pipeline.skillFilter,
                pipeline.focusRelevanceFilter,
                pipeline.focusWeight
            ]);
        });

        it('DYNAMIC_PIPELINE should contain the correct filters in order', () => {
            expect(pipeline.DYNAMIC_PIPELINE).toEqual([
                pipeline.alreadySelectedFilter,
                pipeline.overlapFilter,
                pipeline.balanceWeight
            ]);
        });

        it('DEFAULT_PIPELINE should combine STATIC and DYNAMIC pipelines', () => {
            expect(pipeline.DEFAULT_PIPELINE).toEqual([
                ...pipeline.STATIC_PIPELINE,
                ...pipeline.DYNAMIC_PIPELINE
            ]);
        });
    });
});
