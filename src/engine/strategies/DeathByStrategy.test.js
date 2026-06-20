import { describe, it, expect } from 'vitest';
import { DeathByStrategy } from './DeathByStrategy.js';

describe('DeathByStrategy', () => {
  describe('calculateParams', () => {
    it('should return correct template and map duration to rounds and timeCap', () => {
      const config = { duration: 15 };
      const params = DeathByStrategy.calculateParams(config);

      expect(params).toEqual({
        template: 'Death By',
        rounds: 15,
        timeCap: 15,
      });
    });

    it('should handle zero duration', () => {
      const config = { duration: 0 };
      const params = DeathByStrategy.calculateParams(config);

      expect(params).toEqual({
        template: 'Death By',
        rounds: 0,
        timeCap: 0,
      });
    });

    it('should handle missing duration config gracefully (returning undefined for rounds and timeCap)', () => {
      const config = {};
      const params = DeathByStrategy.calculateParams(config);

      expect(params).toEqual({
        template: 'Death By',
        rounds: undefined,
        timeCap: undefined,
      });
    });
  });

  describe('scaleReps', () => {
    it('should return the fixed string "1 + 1 every min" regardless of inputs', () => {
      expect(DeathByStrategy.scaleReps(10, 'Push-up', 'Hard', 15)).toBe('1 + 1 every min');
      expect(DeathByStrategy.scaleReps(null, null, null, null)).toBe('1 + 1 every min');
      expect(DeathByStrategy.scaleReps(undefined, undefined, undefined, undefined)).toBe(
        '1 + 1 every min'
      );
    });
  });
});
