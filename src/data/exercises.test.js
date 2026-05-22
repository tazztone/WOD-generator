import { describe, it, expect } from 'vitest';
import { EXERCISE_DB, INJURY_MAP } from './exercises.js';

describe('Data Exports', () => {
    it('exports EXERCISE_DB correctly', () => {
        expect(EXERCISE_DB).toBeDefined();
        expect(Array.isArray(EXERCISE_DB)).toBe(true);
        expect(EXERCISE_DB.length).toBeGreaterThan(0);

        // Check basic structure of an element
        const firstExercise = EXERCISE_DB[0];
        expect(firstExercise).toHaveProperty('id');
        expect(firstExercise).toHaveProperty('name');
        expect(firstExercise).toHaveProperty('pattern');
        expect(firstExercise).toHaveProperty('equipment');
    });

    it('exports INJURY_MAP correctly', () => {
        expect(INJURY_MAP).toBeDefined();
        expect(typeof INJURY_MAP).toBe('object');
        expect(Object.keys(INJURY_MAP).length).toBeGreaterThan(0);
    });
});
