import { describe, it, expect } from 'vitest';
import {
    CLASH_TAGS,
    FOCUS_PATTERNS,
    BUY_IN_CONFIG,
    SCALING_CONSTANTS,
    SUBSTITUTIONS
} from './workoutConfig.js';

describe('Workout Configuration Constants', () => {

    it('CLASH_TAGS should be an array of strings', () => {
        expect(Array.isArray(CLASH_TAGS)).toBe(true);
        expect(CLASH_TAGS.length).toBeGreaterThan(0);
        CLASH_TAGS.forEach(tag => {
            expect(typeof tag).toBe('string');
        });
    });

    it('FOCUS_PATTERNS should be an object mapping keys to arrays of strings', () => {
        expect(typeof FOCUS_PATTERNS).toBe('object');
        expect(FOCUS_PATTERNS).not.toBeNull();
        expect(Object.keys(FOCUS_PATTERNS).length).toBeGreaterThan(0);

        Object.keys(FOCUS_PATTERNS).forEach(key => {
            expect(Array.isArray(FOCUS_PATTERNS[key])).toBe(true);
            FOCUS_PATTERNS[key].forEach(pattern => {
                expect(typeof pattern).toBe('string');
            });
        });
    });

    it('BUY_IN_CONFIG should contain expected structure', () => {
        expect(typeof BUY_IN_CONFIG).toBe('object');
        expect(typeof BUY_IN_CONFIG.CHANCE).toBe('number');
        expect(typeof BUY_IN_CONFIG.MIN_DURATION).toBe('number');

        expect(typeof BUY_IN_CONFIG.PATTERNS).toBe('object');
        expect(Array.isArray(BUY_IN_CONFIG.PATTERNS.Default)).toBe(true);

        expect(typeof BUY_IN_CONFIG.REPS).toBe('object');
        expect(BUY_IN_CONFIG.REPS.Default).toBeDefined();
    });

    it('SCALING_CONSTANTS should contain the necessary multipliers and thresholds', () => {
        expect(typeof SCALING_CONSTANTS).toBe('object');
        expect(typeof SCALING_CONSTANTS.BEGINNER_MULTIPLIER).toBe('number');
        expect(typeof SCALING_CONSTANTS.DEFAULT_REPS).toBe('number');

        expect(typeof SCALING_CONSTANTS.INTENSITY_REPS).toBe('object');
        expect(typeof SCALING_CONSTANTS.INTENSITY_REPS.High).toBe('number');
        expect(typeof SCALING_CONSTANTS.INTENSITY_REPS.VeryHigh).toBe('number');

        expect(typeof SCALING_CONSTANTS.SPECIAL_REPS).toBe('object');
        expect(typeof SCALING_CONSTANTS.SPECIAL_REPS.Double).toBe('number');

        expect(typeof SCALING_CONSTANTS.DURATION_THRESHOLDS).toBe('object');
        expect(typeof SCALING_CONSTANTS.DURATION_THRESHOLDS.SHORT).toBe('number');
        expect(typeof SCALING_CONSTANTS.DURATION_THRESHOLDS.EXTRA_LONG).toBe('number');
        expect(typeof SCALING_CONSTANTS.DURATION_THRESHOLDS.EXTREME).toBe('number');

        expect(typeof SCALING_CONSTANTS.MACHINE_REPS).toBe('object');
        expect(typeof SCALING_CONSTANTS.MACHINE_REPS.DEFAULT).toBe('number');

        expect(typeof SCALING_CONSTANTS.RUN_DISTANCES).toBe('object');
        expect(typeof SCALING_CONSTANTS.RUN_DISTANCES.DEFAULT).toBe('string');
    });

    it('SUBSTITUTIONS should contain Beginner and Scaled mappings', () => {
        expect(typeof SUBSTITUTIONS).toBe('object');
        expect(typeof SUBSTITUTIONS.Beginner).toBe('object');
        expect(typeof SUBSTITUTIONS.Scaled).toBe('object');

        Object.keys(SUBSTITUTIONS.Beginner).forEach(key => {
            expect(typeof SUBSTITUTIONS.Beginner[key]).toBe('string');
        });

        Object.keys(SUBSTITUTIONS.Scaled).forEach(key => {
            expect(typeof SUBSTITUTIONS.Scaled[key]).toBe('string');
        });
    });

});
