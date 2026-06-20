import { describe, it, expect } from 'vitest';
import { TabataStrategy } from './TabataStrategy.js';

describe('TabataStrategy', () => {
  describe('calculateParams', () => {
    it('should correctly calculate params based on duration', () => {
      const config = { duration: 10 };
      const params = TabataStrategy.calculateParams(config);

      expect(params).toEqual({
        template: 'Tabata',
        rounds: 20, // 10 * 2
        timeCap: 10,
      });
    });

    it('should handle odd or very short durations', () => {
      const config = { duration: 1 };
      const params = TabataStrategy.calculateParams(config);

      expect(params).toEqual({
        template: 'Tabata',
        rounds: 2, // 1 * 2
        timeCap: 1,
      });
    });
  });

  describe('scaleReps', () => {
    it('should return baseReps if it is not a number', () => {
      const result = TabataStrategy.scaleReps('Max', { id: 'pushup' }, 'intermediate', 10);
      expect(result).toBe('Max');
    });

    it('should return baseReps if <= 12', () => {
      const result = TabataStrategy.scaleReps(12, { id: 'pushup' }, 'intermediate', 10);
      expect(result).toBe(12);

      const result2 = TabataStrategy.scaleReps(5, { id: 'pushup' }, 'intermediate', 10);
      expect(result2).toBe(5);
    });

    it('should clamp reps to 10 if baseReps > 12 and exercise is not "du"', () => {
      const result = TabataStrategy.scaleReps(15, { id: 'pushup' }, 'intermediate', 10);
      expect(result).toBe(10);

      const result2 = TabataStrategy.scaleReps(20, { id: 'squat' }, 'intermediate', 10);
      expect(result2).toBe(10);
    });

    it('should not clamp reps if baseReps > 12 and exercise is "du"', () => {
      const result = TabataStrategy.scaleReps(30, { id: 'du' }, 'intermediate', 10);
      expect(result).toBe(30);

      const result2 = TabataStrategy.scaleReps(15, { id: 'du' }, 'intermediate', 10);
      expect(result2).toBe(15);
    });
  });
});
