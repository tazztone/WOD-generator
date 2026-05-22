import { describe, it, expect, vi, afterEach } from 'vitest';
import { LadderStrategy } from './LadderStrategy.js';

describe('LadderStrategy', () => {
    describe('calculateParams', () => {
        it('should return correct parameters based on config', () => {
            const config = { duration: 20 };
            const params = LadderStrategy.calculateParams(config);
            expect(params).toEqual({
                template: 'Ladder',
                rounds: 1,
                timeCap: 20
            });
        });
    });

    describe('scaleReps', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should return "1-2-3-4..." when random value is > 127', () => {
            vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
                arr[0] = 128;
                return arr;
            });
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("1-2-3-4...");
        });

        it('should return "10-9-8...1" when random value is <= 127', () => {
            vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
                arr[0] = 127;
                return arr;
            });
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("10-9-8...1");
        });

        it('should handle boundary exactly at 127', () => {
            vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
                arr[0] = 127;
                return arr;
            });
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("10-9-8...1");
        });
    });
});
