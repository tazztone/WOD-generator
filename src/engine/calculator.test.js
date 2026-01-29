import { describe, it, expect } from 'vitest';
import { calculateOneRepMax, calculatePercentages } from './calculator';

describe('Calculator Engine', () => {
    describe('calculateOneRepMax', () => {
        it('should return 0 for invalid inputs', () => {
            expect(calculateOneRepMax(0, 5)).toBe(0);
            expect(calculateOneRepMax(100, 0)).toBe(0);
            expect(calculateOneRepMax(-10, 5)).toBe(0);
            expect(calculateOneRepMax(null, 5)).toBe(0);
        });

        it('should return the weight itself for 1 rep', () => {
            expect(calculateOneRepMax(100, 1)).toBe(100);
        });

        it('should correctly calculate 1RM using Epley formula', () => {
            // 100 * (1 + 30/30) = 200
            expect(calculateOneRepMax(100, 30)).toBe(200);

            // 100 * (1 + 15/30) = 150
            expect(calculateOneRepMax(100, 15)).toBe(150);

            // 60 * (1 + 10/30) = 60 * 1.333... = 80
            expect(calculateOneRepMax(60, 10)).toBe(80);
        });

        it('should round to nearest integer', () => {
             // 100 * (1 + 5/30) = 100 * 1.1666 = 116.666 -> 117
             expect(calculateOneRepMax(100, 5)).toBe(117);
        });
    });

    describe('calculatePercentages', () => {
        it('should return empty array for invalid input', () => {
             expect(calculatePercentages(0)).toEqual([]);
             expect(calculatePercentages(-5)).toEqual([]);
        });

        it('should return correct percentages', () => {
            const result = calculatePercentages(100);
            expect(result).toHaveLength(11); // 100 to 50 step 5

            const p100 = result.find(r => r.percentage === 100);
            expect(p100.value).toBe(100);

            const p50 = result.find(r => r.percentage === 50);
            expect(p50.value).toBe(50);

            const p75 = result.find(r => r.percentage === 75);
            expect(p75.value).toBe(75);
        });
    });
});
