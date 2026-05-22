import { describe, it, expect } from 'vitest';
import { ChipperStrategy } from './ChipperStrategy.js';

describe('ChipperStrategy', () => {
    describe('calculateParams', () => {
        it('should return 1 round for duration < 30', () => {
            const result = ChipperStrategy.calculateParams({ duration: 25 });
            expect(result).toEqual({
                template: 'Chipper',
                rounds: 1,
                timeCap: 25
            });
        });

        it('should return 2 rounds for duration between 30 and 44', () => {
            const result = ChipperStrategy.calculateParams({ duration: 30 });
            expect(result).toEqual({
                template: 'Chipper',
                rounds: 2,
                timeCap: 30
            });

            const result2 = ChipperStrategy.calculateParams({ duration: 44 });
            expect(result2).toEqual({
                template: 'Chipper',
                rounds: 2,
                timeCap: 44
            });
        });

        it('should return 3 rounds for duration >= 45', () => {
            const result = ChipperStrategy.calculateParams({ duration: 45 });
            expect(result).toEqual({
                template: 'Chipper',
                rounds: 3,
                timeCap: 45
            });

            const result2 = ChipperStrategy.calculateParams({ duration: 60 });
            expect(result2).toEqual({
                template: 'Chipper',
                rounds: 3,
                timeCap: 60
            });
        });
    });

    describe('scaleReps', () => {
        it('should handle non-numeric base reps (meters)', () => {
            expect(ChipperStrategy.scaleReps('400m', {}, 'Normal', 20)).toBe('800m');
            expect(ChipperStrategy.scaleReps('200m', {}, 'Normal', 20)).toBe('400m');
        });

        it('should handle non-numeric base reps (feet)', () => {
            expect(ChipperStrategy.scaleReps('50ft', {}, 'Normal', 20)).toBe('100ft');
        });
        it('should return non-numeric reps unmodified if distance parsing fails', () => {
            expect(ChipperStrategy.scaleReps('m', {}, 'Normal', 20)).toBe('m');
            expect(ChipperStrategy.scaleReps('ft', {}, 'Normal', 20)).toBe('ft');
        });

        it('should return non-numeric reps unmodified if no match', () => {
            expect(ChipperStrategy.scaleReps('45s', {}, 'Normal', 20)).toBe('45s');
            expect(ChipperStrategy.scaleReps('100x', {}, 'Normal', 20)).toBe('100x');
        });

        it('should handle Machine calories scaling', () => {
            expect(ChipperStrategy.scaleReps(10, { equipment: 'Machine', id: 'row' }, 'Normal', 20)).toBe('40/30 cal');
        });

        it('should apply multiplier 2 for VeryHigh intensity or muscle_up', () => {
            expect(ChipperStrategy.scaleReps(3, { intensity: 'VeryHigh', id: 'something' }, 'Normal', 20)).toBe(6);
            expect(ChipperStrategy.scaleReps(3, { intensity: 'High', id: 'bar_muscle_up' }, 'Normal', 20)).toBe(6);
        });

        it('should apply multiplier 3 for High intensity or pullup/hspu', () => {
            expect(ChipperStrategy.scaleReps(5, { intensity: 'High', id: 'something' }, 'Normal', 20)).toBe(15);
            expect(ChipperStrategy.scaleReps(5, { intensity: 'Moderate', id: 'strict_pullup' }, 'Normal', 20)).toBe(15);
            expect(ChipperStrategy.scaleReps(5, { intensity: 'Moderate', id: 'strict_hspu' }, 'Normal', 20)).toBe(15);
        });

        it('should apply default multiplier 4 for normal exercises', () => {
            expect(ChipperStrategy.scaleReps(10, { intensity: 'Moderate', id: 'pushup' }, 'Normal', 20)).toBe(40);
        });

        it('should cap VeryHigh intensity reps at 8', () => {
            expect(ChipperStrategy.scaleReps(5, { intensity: 'VeryHigh', id: 'something' }, 'Normal', 20)).toBe(8); // 5 * 2 = 10 -> capped at 8
        });

        it('should cap standard exercise reps at 60', () => {
            expect(ChipperStrategy.scaleReps(20, { intensity: 'Moderate', id: 'pushup' }, 'Normal', 20)).toBe(60); // 20 * 4 = 80 -> capped at 60
        });

        it('should set double unders (du) to exactly 100', () => {
            expect(ChipperStrategy.scaleReps(20, { intensity: 'Moderate', id: 'du' }, 'Normal', 20)).toBe(100);
        });

        it('should set single unders (su) to exactly 150', () => {
            expect(ChipperStrategy.scaleReps(20, { intensity: 'Moderate', id: 'su' }, 'Normal', 20)).toBe(150);
        });
    });
});
