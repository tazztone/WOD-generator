import { describe, it, expect } from 'vitest';
import { RftStrategy } from './RftStrategy.js';

describe('RftStrategy', () => {
    describe('calculateParams', () => {
        it('should calculate 5 rounds for duration < 30', () => {
            const config = { duration: 20 };
            const params = RftStrategy.calculateParams(config);

            expect(params).toEqual({
                template: 'RFT',
                rounds: 5,
                timeCap: 20
            });
        });

        it('should calculate 6 rounds for 30 <= duration < 45', () => {
            const config = { duration: 30 };
            const params = RftStrategy.calculateParams(config);

            expect(params).toEqual({
                template: 'RFT',
                rounds: 6,
                timeCap: 30
            });

            const config2 = { duration: 40 };
            const params2 = RftStrategy.calculateParams(config2);
            expect(params2.rounds).toBe(6);
        });

        it('should calculate 8 rounds for duration >= 45', () => {
            const config = { duration: 45 };
            const params = RftStrategy.calculateParams(config);

            expect(params).toEqual({
                template: 'RFT',
                rounds: 8,
                timeCap: 45
            });

            const config2 = { duration: 60 };
            const params2 = RftStrategy.calculateParams(config2);
            expect(params2.rounds).toBe(8);
        });
    });

    describe('scaleReps', () => {
        it('should return baseReps unmodified', () => {
            expect(RftStrategy.scaleReps(10)).toBe(10);
            expect(RftStrategy.scaleReps('10-15')).toBe('10-15');
            expect(RftStrategy.scaleReps(15, {}, 'Normal', 30)).toBe(15);
        });
    });
});
