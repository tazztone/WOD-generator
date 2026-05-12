import { describe, it, expect, vi } from 'vitest';
import { calculateBaseReps, getReps, getSubstitution } from './scaling.js';
import { SCALING_CONSTANTS, SUBSTITUTIONS } from '../config/workoutConfig.js';
import { getStrategy } from './strategies/StrategyFactory.js';

// Mock getStrategy
vi.mock('./strategies/StrategyFactory.js', () => ({
    getStrategy: vi.fn()
}));

describe('Scaling Engine', () => {
    describe('calculateBaseReps', () => {
        it('should scale run distances based on duration', () => {
            const runEx = { id: 'run' };
            const { EXTREME, EXTRA_LONG, SHORT } = SCALING_CONSTANTS.DURATION_THRESHOLDS;

            expect(calculateBaseReps(runEx, 'Rx', EXTREME + 1)).toBe(SCALING_CONSTANTS.RUN_DISTANCES.EXTREME);
            expect(calculateBaseReps(runEx, 'Rx', EXTRA_LONG + 1)).toBe(SCALING_CONSTANTS.RUN_DISTANCES.EXTRA_LONG);
            expect(calculateBaseReps(runEx, 'Rx', SHORT - 1)).toBe(SCALING_CONSTANTS.RUN_DISTANCES.SHORT);
            expect(calculateBaseReps(runEx, 'Rx', SHORT + 5)).toBe(SCALING_CONSTANTS.RUN_DISTANCES.DEFAULT);
        });

        it('should return 45s for time-based exercises', () => {
            const plankEx = { id: 'plank' };
            const plankGEx = { id: 'some_other', id_g: 'wall_sit' };

            expect(calculateBaseReps(plankEx, 'Rx', 20)).toBe('45s');
            expect(calculateBaseReps(plankGEx, 'Rx', 20)).toBe('45s');
        });

        it('should scale Machine equipment based on duration', () => {
            const machineEx = { id: 'row', equipment: 'Machine' };
            const { EXTREME, EXTRA_LONG, SHORT } = SCALING_CONSTANTS.DURATION_THRESHOLDS;

            expect(calculateBaseReps(machineEx, 'Rx', EXTREME + 1)).toBe(SCALING_CONSTANTS.MACHINE_REPS.EXTREME);
            expect(calculateBaseReps(machineEx, 'Rx', EXTRA_LONG + 1)).toBe(SCALING_CONSTANTS.MACHINE_REPS.EXTRA_LONG);
            expect(calculateBaseReps(machineEx, 'Rx', SHORT - 1)).toBe(SCALING_CONSTANTS.MACHINE_REPS.SHORT);
            expect(calculateBaseReps(machineEx, 'Rx', SHORT + 5)).toBe(SCALING_CONSTANTS.MACHINE_REPS.DEFAULT);
        });

        it('should scale reps based on intensity', () => {
            const highIntEx = { id: 'box_jump', intensity: 'High' };
            const veryHighIntEx = { id: 'snatch', intensity: 'VeryHigh' };
            const normalEx = { id: 'pushup' };

            expect(calculateBaseReps(highIntEx, 'Rx', 20)).toBe(SCALING_CONSTANTS.INTENSITY_REPS.High);
            expect(calculateBaseReps(veryHighIntEx, 'Rx', 20)).toBe(SCALING_CONSTANTS.INTENSITY_REPS.VeryHigh);
            expect(calculateBaseReps(normalEx, 'Rx', 20)).toBe(SCALING_CONSTANTS.DEFAULT_REPS);
        });

        it('should handle special overrides for very slow/hard movements', () => {
            expect(calculateBaseReps({ id: 'rope_climb' }, 'Rx', 20)).toBe(3);
            expect(calculateBaseReps({ id: 'wall_walk' }, 'Rx', 20)).toBe(3);
            expect(calculateBaseReps({ id: 'hswalk' }, 'Rx', 20)).toBe('50ft');
            expect(calculateBaseReps({ id: 'l_sit' }, 'Rx', 20)).toBe('30s');
        });

        it('should scale jump rope exercises', () => {
            expect(calculateBaseReps({ id: 'du' }, 'Rx', 20)).toBe(SCALING_CONSTANTS.SPECIAL_REPS.Double);
            expect(calculateBaseReps({ id: 'su' }, 'Rx', 20)).toBe(SCALING_CONSTANTS.SPECIAL_REPS['Single Unders']);
        });

        it('should apply beginner multiplier and handle jump rope for beginners', () => {
            const normalEx = { id: 'pushup' };
            const duEx = { id: 'du' };

            const expectedBeginnerReps = Math.ceil(SCALING_CONSTANTS.DEFAULT_REPS * SCALING_CONSTANTS.BEGINNER_MULTIPLIER);
            expect(calculateBaseReps(normalEx, 'Beginner', 20)).toBe(expectedBeginnerReps);
            expect(calculateBaseReps(duEx, 'Beginner', 20)).toBe(SCALING_CONSTANTS.SPECIAL_REPS.Beginner_Jump);
        });
    });

    describe('getReps', () => {
        it('should retrieve strategy and calculate scaled reps', () => {
            const mockScaleReps = vi.fn().mockReturnValue(12);
            getStrategy.mockReturnValue({ scaleReps: mockScaleReps });

            const exercise = { id: 'pushup' };
            const reps = getReps(exercise, 'Rx', 'AMRAP', 20);

            expect(getStrategy).toHaveBeenCalledWith('AMRAP');
            expect(mockScaleReps).toHaveBeenCalledWith(SCALING_CONSTANTS.DEFAULT_REPS, exercise, 'Rx', 20);
            expect(reps).toBe(12);
        });
    });

    describe('getSubstitution', () => {
        it('should return null for Rx difficulty', () => {
            expect(getSubstitution('hspu', 'Rx')).toBeNull();
        });

        it('should return correct substitution for Beginner difficulty', () => {
            expect(getSubstitution('hspu', 'Beginner')).toBe(SUBSTITUTIONS.Beginner['hspu']);
            expect(getSubstitution('bmu', 'Beginner')).toBe(SUBSTITUTIONS.Beginner['bmu']);
            expect(getSubstitution('nonexistent_exercise', 'Beginner')).toBeNull();
        });

        it('should return correct substitution for Scaled difficulty', () => {
            expect(getSubstitution('hspu', 'Scaled')).toBe(SUBSTITUTIONS.Scaled['hspu']);
            expect(getSubstitution('bmu', 'Scaled')).toBe(SUBSTITUTIONS.Scaled['bmu']);
            expect(getSubstitution('nonexistent_exercise', 'Scaled')).toBeNull();
        });

        it('should return null for missing, unknown, or undefined exercise IDs', () => {
            expect(getSubstitution(undefined, 'Beginner')).toBeNull();
            expect(getSubstitution(null, 'Scaled')).toBeNull();
            expect(getSubstitution('', 'Beginner')).toBeNull();
        });

        it('should return null for unknown difficulty', () => {
            expect(getSubstitution('hspu', 'UnknownDifficulty')).toBeNull();
            expect(getSubstitution('hspu', undefined)).toBeNull();
            expect(getSubstitution('hspu', null)).toBeNull();
        });
    });
});
