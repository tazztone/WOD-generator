import { describe, it, expect } from 'vitest';
import {
  getExerciseName,
  isExerciseValid,
  generateWarmupLogic,
  generateStrengthLogic,
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

  describe('generateWarmupLogic', () => {
    it('should always include cardio and handle patterns', () => {
      const exercises = [
        { exercise: { id: 'pushup', pattern: 'Push' } },
        { exercise: { id: 'squat', pattern: 'Squat' } },
      ];
      const warmup = generateWarmupLogic(exercises, 'en');
      expect(warmup).toContain('3 min Cardio (Easy)');
      expect(warmup).toContain('10 Scap Push-ups + 5 Inchworms');
      expect(warmup).toContain('10 Air Squats');
    });

    it('should add calf raises for specific IDs', () => {
      const exercises = [{ exercise: { id: 'run_400', pattern: 'Cardio' } }];
      const warmup = generateWarmupLogic(exercises, 'en');
      expect(warmup).toContain('20 Calf Raises');

      const warmupDe = generateWarmupLogic(exercises, 'de');
      expect(warmupDe).toContain('20 Wadenheben');
    });

    it('should handle all patterns', () => {
      const exercises = [
        { exercise: { id: 'dl', pattern: 'Hinge' } },
        { exercise: { id: 'pullup', pattern: 'Pull' } },
      ];
      const warmup = generateWarmupLogic(exercises, 'en');
      expect(warmup).toContain('10 Glute Bridges + 10 Good Mornings');
      expect(warmup).toContain('10 Ring Rows / Scap Pulls');
    });
  });

  describe('generateStrengthLogic', () => {
    it('should return null if includeStrength is false', () => {
      expect(generateStrengthLogic([], { includeStrength: false }, 'en')).toBeNull();
    });

    it('should pair Deadlift for Squat heavy metcons without Hinge', () => {
      const exercises = [{ exercise: { pattern: 'Squat' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Deadlift');
    });

    it('should pair Back Squat for Push heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Push' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Back Squat');
    });

    it('should pair Front Squat for Pull heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Pull' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Front Squat');
    });

    it('should pair Push Press for Hinge heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Hinge' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Push Press');
    });

    it('should pair Romanian Deadlift for Core heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Core' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Romanian Deadlift');
    });

    it('should fallback to Strict Press', () => {
      const exercises = [{ exercise: { pattern: 'Unknown' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'en');
      expect(strength.name).toBe('Strict Press');
    });

    it('should support German translations', () => {
      const exercises = [{ exercise: { pattern: 'Push' } }];
      const strength = generateStrengthLogic(exercises, { includeStrength: true }, 'de');
      expect(strength.name).toBe('Back Squat');
      expect(strength.notes).toBe('Aufbauend');
    });
  });
});
