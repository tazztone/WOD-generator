import { describe, it, expect } from 'vitest';
import { AmrapStrategy } from './AmrapStrategy.js';

describe('AmrapStrategy', () => {
    describe('calculateParams', () => {
        it('should return AMRAP template params with timeCap from config', () => {
            const config = { duration: 20 };
            const params = AmrapStrategy.calculateParams(config);

            expect(params).toEqual({
                template: 'AMRAP',
                rounds: null,
                timeCap: 20
            });
        });
    });

    describe('scaleReps', () => {
        it('should return baseReps as-is if it is not a number', () => {
            expect(AmrapStrategy.scaleReps('10-15', {}, 'Normal', 30)).toBe('10-15');
        });

        it('should not scale down reps for short duration (<= 25)', () => {
            expect(AmrapStrategy.scaleReps(15, {}, 'Normal', 20)).toBe(15);
            expect(AmrapStrategy.scaleReps(20, {}, 'Normal', 25)).toBe(20);
        });

        it('should cap reps at 10 for long duration (26-45)', () => {
            expect(AmrapStrategy.scaleReps(15, {}, 'Normal', 30)).toBe(10);
            expect(AmrapStrategy.scaleReps(10, {}, 'Normal', 45)).toBe(10);
            expect(AmrapStrategy.scaleReps(5, {}, 'Normal', 30)).toBe(5); // Below cap
        });

        it('should cap reps at 8 for extra long duration (46-80)', () => {
            expect(AmrapStrategy.scaleReps(15, {}, 'Normal', 60)).toBe(8);
            expect(AmrapStrategy.scaleReps(8, {}, 'Normal', 80)).toBe(8);
            expect(AmrapStrategy.scaleReps(5, {}, 'Normal', 60)).toBe(5); // Below cap
        });

        it('should cap reps at 6 for extreme duration (> 80)', () => {
            expect(AmrapStrategy.scaleReps(15, {}, 'Normal', 90)).toBe(6);
            expect(AmrapStrategy.scaleReps(6, {}, 'Normal', 100)).toBe(6);
            expect(AmrapStrategy.scaleReps(5, {}, 'Normal', 90)).toBe(5); // Below cap
        });
    });
});
