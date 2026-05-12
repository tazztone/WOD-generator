import { describe, it, expect } from 'vitest';
import {
    getExerciseName,
    isExerciseValid,
    generateWarmupLogic,
    generateStrengthLogic,
    formatReps
} from './utils';

describe('Utils Engine', () => {
    describe('getExerciseName', () => {
        const ex = { name: 'Push-up', name_de: 'Liegestütz' };

        it('should return English name when lang is en', () => {
            expect(getExerciseName(ex, 'en')).toBe('Push-up');
        });

        it('should return German name when lang is de', () => {
            expect(getExerciseName(ex, 'de')).toBe('Liegestütz');
        });

        it('should fallback to English if name_de is missing', () => {
            const exNoDe = { name: 'Pull-up' };
            expect(getExerciseName(exNoDe, 'de')).toBe('Pull-up');
        });
    });

    describe('isExerciseValid', () => {
        const baseConfig = {
            equipment: { barbell: true, dumbbell: true, pullupBar: true, machine: true },
            difficulty: 'Intermediate',
            avoid: []
        };

        it('should return false if required equipment is missing', () => {
            const barbellEx = { equipment: 'Barbell' };
            const noBarbellConfig = { ...baseConfig, equipment: { ...baseConfig.equipment, barbell: false } };
            expect(isExerciseValid(barbellEx, noBarbellConfig)).toBe(false);

            const dumbbellEx = { equipment: 'Dumbbell' };
            const noDumbbellConfig = { ...baseConfig, equipment: { ...baseConfig.equipment, dumbbell: false } };
            expect(isExerciseValid(dumbbellEx, noDumbbellConfig)).toBe(false);

            const pullupEx = { equipment: 'PullupBar' };
            const noPullupConfig = { ...baseConfig, equipment: { ...baseConfig.equipment, pullupBar: false } };
            expect(isExerciseValid(pullupEx, noPullupConfig)).toBe(false);

            const machineEx = { equipment: 'Machine' };
            const noMachineConfig = { ...baseConfig, equipment: { ...baseConfig.equipment, machine: false } };
            expect(isExerciseValid(machineEx, noMachineConfig)).toBe(false);
        });

        it('should return false if Beginner tries VeryHigh intensity', () => {
            const highIntensityEx = { intensity: 'VeryHigh' };
            const beginnerConfig = { ...baseConfig, difficulty: 'Beginner' };
            expect(isExerciseValid(highIntensityEx, beginnerConfig)).toBe(false);

            // Should be valid for non-Beginner
            expect(isExerciseValid(highIntensityEx, baseConfig)).toBe(true);
        });

        it('should filter by forbiddenTagsSet', () => {
            const taggedEx = { tags: ['overhead', 'heavy'] };
            const configWithSet = {
                ...baseConfig,
                forbiddenTagsSet: new Set(['overhead'])
            };
            expect(isExerciseValid(taggedEx, configWithSet)).toBe(false);
        });

        it('should filter by avoid array using INJURY_MAP fallback', () => {
            // INJURY_MAP["Shoulders"] includes "shoulders" and "overhead"
            const overheadEx = { tags: ['overhead'] };
            const configWithAvoid = { ...baseConfig, avoid: ['Shoulders'] };
            expect(isExerciseValid(overheadEx, configWithAvoid)).toBe(false);
        });
    });

    describe('generateWarmupLogic', () => {
        it('should always include cardio and handle patterns', () => {
            const exercises = [
                { exercise: { id: 'pushup', pattern: 'Push' } },
                { exercise: { id: 'squat', pattern: 'Squat' } }
            ];
            const warmup = generateWarmupLogic(exercises);
            expect(warmup).toContain('cardioEasy');
            expect(warmup).toContain('pushWarmup');
            expect(warmup).toContain('airSquats');
        });

        it('should add calf raises for specific IDs', () => {
            const exercises = [{ exercise: { id: 'run_400', pattern: 'Cardio' } }];
            const warmup = generateWarmupLogic(exercises);
            expect(warmup).toContain('calfRaises');
        });

        it('should handle all patterns', () => {
             const exercises = [
                { exercise: { id: 'dl', pattern: 'Hinge' } },
                { exercise: { id: 'pullup', pattern: 'Pull' } }
            ];
            const warmup = generateWarmupLogic(exercises);
            expect(warmup).toContain('hingeWarmup');
            expect(warmup).toContain('pullWarmup');
        });

        it('should handle empty exercises array', () => {
            const warmup = generateWarmupLogic([]);
            expect(warmup).toEqual(['cardioEasy']);
        });

        it('should add calf raises for jump and du IDs', () => {
            const exercises = [
                { exercise: { id: 'box_jump', pattern: 'Plyo' } },
                { exercise: { id: 'du', pattern: 'Cardio' } }
            ];
            const warmup = generateWarmupLogic(exercises);
            expect(warmup).toContain('calfRaises');
        });
    });

    describe('formatReps', () => {
        it('should return string reps as is', () => {
            expect(formatReps('400m')).toBe('400m');
        });

        it('should return number reps if no exercise is provided', () => {
            expect(formatReps(10)).toBe(10);
        });

        it('should append Cal for Machine Cardio exercises', () => {
            expect(formatReps(15, { equipment: 'Machine', pattern: 'Cardio' })).toBe('15 Cal');
        });

        it('should return plain number for other exercises', () => {
            expect(formatReps(10, { equipment: 'Barbell', pattern: 'Squat' })).toBe(10);
        });
    });

    describe('generateStrengthLogic', () => {
        it('should return null if includeStrength is false', () => {
            expect(generateStrengthLogic([], { includeStrength: false })).toBeNull();
        });

        it('should pair Bench/Floor Press for Push+Pull metcons', () => {
            const exercises = [{ exercise: { pattern: 'Push' } }, { exercise: { pattern: 'Pull' } }];

            const withBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(withBarbell.nameKey).toBe('benchPress');

            const withoutBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: false } });
            expect(withoutBarbell.nameKey).toBe('floorPress');
        });

        it('should pair Overhead/Goblet Squat for Squat+Core metcons', () => {
            const exercises = [{ exercise: { pattern: 'Squat' } }, { exercise: { pattern: 'Core' } }];

            const withBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(withBarbell.nameKey).toBe('overheadSquat');

            const withoutBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: false } });
            expect(withoutBarbell.nameKey).toBe('gobletSquat');
        });

        it('should pair Power Clean/Sumo Deadlift for Hinge+Pull metcons', () => {
            const exercises = [{ exercise: { pattern: 'Hinge' } }, { exercise: { pattern: 'Pull' } }];

            const withBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(withBarbell.nameKey).toBe('powerClean');

            const withoutBarbell = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: false } });
            expect(withoutBarbell.nameKey).toBe('sumoDeadlift');
        });

        it('should pair Deadlift for Squat heavy metcons without Hinge', () => {
            const exercises = [{ exercise: { pattern: 'Squat' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('deadlift');
        });

        it('should pair Back Squat for Push heavy metcons', () => {
            const exercises = [{ exercise: { pattern: 'Push' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('backSquat');
        });

        it('should pair Front Squat for Pull heavy metcons', () => {
            const exercises = [{ exercise: { pattern: 'Pull' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('frontSquat');
        });

        it('should pair Push Press for Hinge heavy metcons', () => {
            const exercises = [{ exercise: { pattern: 'Hinge' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('pushPress');
        });

        it('should pair Romanian Deadlift for Core heavy metcons', () => {
            const exercises = [{ exercise: { pattern: 'Core' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('romanianDeadlift');
        });

        it('should fallback to Strict Press', () => {
            const exercises = [{ exercise: { pattern: 'Unknown' } }];
            const strength = generateStrengthLogic(exercises, { includeStrength: true, equipment: { barbell: true } });
            expect(strength.nameKey).toBe('strictPress');
        });
    });

    describe('formatReps', () => {
        it('should return the same string if reps is already a string', () => {
            expect(formatReps('400m', {})).toBe('400m');
            expect(formatReps('45s', {})).toBe('45s');
            expect(formatReps('40/30 cal', {})).toBe('40/30 cal');
        });

        it('should return reps as is if exercise is missing', () => {
            expect(formatReps(10, null)).toBe(10);
            expect(formatReps(10, undefined)).toBe(10);
        });

        it('should append " Cal" for Machine Cardio exercises', () => {
            const exercise = { equipment: 'Machine', pattern: 'Cardio' };
            expect(formatReps(15, exercise)).toBe('15 Cal');
        });

        it('should return reps as a number for non-Machine Cardio exercises', () => {
            const barbellEx = { equipment: 'Barbell', pattern: 'Squat' };
            expect(formatReps(10, barbellEx)).toBe(10);

            const machineNonCardio = { equipment: 'Machine', pattern: 'Push' };
            expect(formatReps(12, machineNonCardio)).toBe(12);
        });
    });
});
