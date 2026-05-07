import { describe, it, expect } from 'vitest';
import { overlapFilter } from './pipeline';

describe('overlapFilter', () => {
    it('should filter out exercises with the same pattern', () => {
        const lastEx = { id: 'ex1', pattern: 'Push', tags: [] };
        const director = {
            selectedExercises: [{ exercise: lastEx }]
        };
        const pool = [
            { id: 'ex2', pattern: 'Push', tags: [] },
            { id: 'ex3', pattern: 'Pull', tags: [] }
        ];
        const result = overlapFilter(pool, director);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('ex3');
    });

    it('should filter out exercises with the same ID', () => {
        const lastEx = { id: 'ex1', pattern: 'Push', tags: [] };
        const director = {
            selectedExercises: [{ exercise: lastEx }]
        };
        const pool = [
            { id: 'ex1', pattern: 'Pull', tags: [] },
            { id: 'ex3', pattern: 'Pull', tags: [] }
        ];
        const result = overlapFilter(pool, director);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('ex3');
    });

    it('should filter out exercises with clash tags', () => {
        // Note: This relies on 'shoulders' being in CLASH_TAGS in workoutConfig.js
        const lastEx = { id: 'ex1', pattern: 'Push', tags: ['shoulders', 'chest'] };
        const director = {
            selectedExercises: [{ exercise: lastEx }]
        };
        const pool = [
            { id: 'ex2', pattern: 'Pull', tags: ['shoulders', 'grip'] },
            { id: 'ex3', pattern: 'Pull', tags: ['back', 'grip'] }
        ];
        const result = overlapFilter(pool, director);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('ex3');
    });

    it('should NOT filter out exercises with shared tags that are NOT in CLASH_TAGS', () => {
        const lastEx = { id: 'ex1', pattern: 'Push', tags: ['chest', 'triceps'] };
        const director = {
            selectedExercises: [{ exercise: lastEx }]
        };
        const pool = [
            { id: 'ex2', pattern: 'Pull', tags: ['chest', 'back'] }
        ];
        const result = overlapFilter(pool, director);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('ex2');
    });

    it('should handle empty tags gracefully', () => {
        const lastEx = { id: 'ex1', pattern: 'Push' };
        const director = {
            selectedExercises: [{ exercise: lastEx }]
        };
        const pool = [
            { id: 'ex2', pattern: 'Pull', tags: ['shoulders'] },
            { id: 'ex3', pattern: 'Pull' }
        ];
        const result = overlapFilter(pool, director);
        expect(result).toHaveLength(2);
    });
});
