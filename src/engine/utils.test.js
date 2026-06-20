import { describe, it, expect } from 'vitest';
import { getExerciseName, isExerciseValid } from './utils';
import { formatReps } from './scaling';

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
      avoid: [],
    };

    it('should return false if required equipment is missing', () => {
      const barbellEx = { equipment: 'Barbell' };
      const noBarbellConfig = {
        ...baseConfig,
        equipment: { ...baseConfig.equipment, barbell: false },
      };
      expect(isExerciseValid(barbellEx, noBarbellConfig)).toBe(false);

      const dumbbellEx = { equipment: 'Dumbbell' };
      const noDumbbellConfig = {
        ...baseConfig,
        equipment: { ...baseConfig.equipment, dumbbell: false },
      };
      expect(isExerciseValid(dumbbellEx, noDumbbellConfig)).toBe(false);

      const pullupEx = { equipment: 'PullupBar' };
      const noPullupConfig = {
        ...baseConfig,
        equipment: { ...baseConfig.equipment, pullupBar: false },
      };
      expect(isExerciseValid(pullupEx, noPullupConfig)).toBe(false);

      const machineEx = { equipment: 'Machine' };
      const noMachineConfig = {
        ...baseConfig,
        equipment: { ...baseConfig.equipment, machine: false },
      };
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
        forbiddenTagsSet: new Set(['overhead']),
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
