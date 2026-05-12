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

        it('should return "1-2-3-4..." when Math.random() is > 0.5', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.6);
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("1-2-3-4...");
        });

        it('should return "10-9-8...1" when Math.random() is <= 0.5', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.4);
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("10-9-8...1");
        });

        it('should handle boundary exactly at 0.5', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.5);
            const reps = LadderStrategy.scaleReps(10, {}, 'normal', 20);
            expect(reps).toBe("10-9-8...1");
        });
    });
});
