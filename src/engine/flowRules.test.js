import { describe, it, expect } from 'vitest';
import { generateWarmupLogic, generateStrengthLogic } from './flowRules.js';

describe('Flow Rules Engine', () => {
  describe('generateWarmupLogic', () => {
    it('should always include cardio and handle patterns', () => {
      const exercises = [
        { exercise: { id: 'pushup', pattern: 'Push' } },
        { exercise: { id: 'squat', pattern: 'Squat' } },
      ];
      const warmup = generateWarmupLogic(exercises);
      expect(warmup).toContain('cardioEasy');
      expect(warmup).toContain('pushWarmup');
      expect(warmup).toContain('airSquats');
    });

    it('should respect config settings for warmup duration and intensity', () => {
      const exercises = [{ exercise: { id: 'pushup', pattern: 'Push' } }];
      const warmup = generateWarmupLogic(exercises, {
        warmupDuration: 5,
        warmupIntensity: 'Moderate',
      });
      expect(warmup).toContain('dynamicCardio|5|Moderate');
    });

    it('should return empty array if includeWarmup is false', () => {
      const exercises = [{ exercise: { id: 'pushup', pattern: 'Push' } }];
      const warmup = generateWarmupLogic(exercises, { includeWarmup: false });
      expect(warmup).toEqual([]);
    });

    it('should add calf raises for specific IDs', () => {
      const exercises = [{ exercise: { id: 'run_400', pattern: 'Cardio' } }];
      const warmup = generateWarmupLogic(exercises);
      expect(warmup).toContain('calfRaises');
    });

    it('should handle all patterns', () => {
      const exercises = [
        { exercise: { id: 'dl', pattern: 'Hinge' } },
        { exercise: { id: 'pullup', pattern: 'Pull' } },
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
        { exercise: { id: 'du', pattern: 'Cardio' } },
      ];
      const warmup = generateWarmupLogic(exercises);
      expect(warmup).toContain('calfRaises');
    });
  });

  describe('generateStrengthLogic', () => {
    it('should return null if includeStrength is false', () => {
      expect(generateStrengthLogic([], { includeStrength: false })).toBeNull();
    });

    it('should pair Bench/Floor Press for Push+Pull metcons', () => {
      const exercises = [{ exercise: { pattern: 'Push' } }, { exercise: { pattern: 'Pull' } }];

      const withBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(withBarbell.nameKey).toBe('benchPress');

      const withoutBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: false },
      });
      expect(withoutBarbell.nameKey).toBe('floorPress');
    });

    it('should pair Overhead/Goblet Squat for Squat+Core metcons', () => {
      const exercises = [{ exercise: { pattern: 'Squat' } }, { exercise: { pattern: 'Core' } }];

      const withBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(withBarbell.nameKey).toBe('overheadSquat');

      const withoutBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: false },
      });
      expect(withoutBarbell.nameKey).toBe('gobletSquat');
    });

    it('should pair Power Clean/Sumo Deadlift for Hinge+Pull metcons', () => {
      const exercises = [{ exercise: { pattern: 'Hinge' } }, { exercise: { pattern: 'Pull' } }];

      const withBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(withBarbell.nameKey).toBe('powerClean');

      const withoutBarbell = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: false },
      });
      expect(withoutBarbell.nameKey).toBe('sumoDeadlift');
    });

    it('should pair Deadlift for Squat heavy metcons without Hinge', () => {
      const exercises = [{ exercise: { pattern: 'Squat' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('deadlift');
    });

    it('should pair Back Squat for Push heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Push' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('backSquat');
    });

    it('should pair Front Squat for Pull heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Pull' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('frontSquat');
    });

    it('should pair Push Press for Hinge heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Hinge' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('pushPress');
    });

    it('should pair Romanian Deadlift for Core heavy metcons', () => {
      const exercises = [{ exercise: { pattern: 'Core' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('romanianDeadlift');
    });

    it('should fallback to Strict Press', () => {
      const exercises = [{ exercise: { pattern: 'Unknown' } }];
      const strength = generateStrengthLogic(exercises, {
        includeStrength: true,
        equipment: { barbell: true },
      });
      expect(strength.nameKey).toBe('strictPress');
    });
  });
});
