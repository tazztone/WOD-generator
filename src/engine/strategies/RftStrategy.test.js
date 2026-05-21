import { describe, it, expect } from 'vitest';
import { RftStrategy } from './RftStrategy.js';

describe('RftStrategy', () => {
    describe('calculateParams', () => {
        it('should calculate 3 rounds for a 10 min duration (10 / 6.25 = 1.6 -> max(3, 1) = 3)', () => {
            const config = { duration: 10 };
            const params = RftStrategy.calculateParams(config);
            expect(params).toEqual({
                template: 'RFT',
                rounds: 3,
                timeCap: 10
            });
        });

        it('should calculate 4 rounds for a 25 min duration (25 / 6.25 = 4)', () => {
            const config = { duration: 25 };
            const params = RftStrategy.calculateParams(config);
            expect(params).toEqual({
                template: 'RFT',
                rounds: 4,
                timeCap: 25
            });
        });

        it('should calculate 6 rounds for a 30 min duration with 4 exercises (30 / 5 = 6)', () => {
            const config = { duration: 30, numExercises: 4 };
            const params = RftStrategy.calculateParams(config);
            expect(params).toEqual({
                template: 'RFT',
                rounds: 6,
                timeCap: 30
            });
        });
    });

    describe('scaleReps', () => {
        it('should return baseReps unmodified', () => {
            expect(RftStrategy.scaleReps(10, {}, 'Normal', 20)).toBe(10);
            expect(RftStrategy.scaleReps('10-15', {}, 'Normal', 20)).toBe('10-15');
        });
    });
});
