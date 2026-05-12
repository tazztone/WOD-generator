import { describe, it, expect } from 'vitest';
import { EmomStrategy } from './EmomStrategy.js';

describe('EmomStrategy', () => {
    describe('calculateParams', () => {
        it('should return correct template parameters based on config duration', () => {
            const config = { duration: 15 };
            const params = EmomStrategy.calculateParams(config);

            expect(params).toEqual({
                template: 'EMOM',
                rounds: 15,
                timeCap: 15
            });
        });
    });

    describe('scaleReps', () => {
        it('should return baseReps as-is if it is not a number', () => {
            expect(EmomStrategy.scaleReps('Max', {}, 'rx', 15)).toBe('Max');
            expect(EmomStrategy.scaleReps('AMRAP', {}, 'scaled', 10)).toBe('AMRAP');
        });

        it('should keep high rep counts >= 15 as they are', () => {
            expect(EmomStrategy.scaleReps(15, { id: 'pushups', pattern: 'Push' }, 'rx', 10)).toBe(15);
            expect(EmomStrategy.scaleReps(20, { id: 'squats', pattern: 'Squat' }, 'rx', 10)).toBe(20);
            expect(EmomStrategy.scaleReps(50, { id: 'situps', pattern: 'Core' }, 'rx', 10)).toBe(50);
        });

        it('should keep rep counts as they are for "du" and "su" exercises even if < 15', () => {
            expect(EmomStrategy.scaleReps(10, { id: 'du', pattern: 'Cardio' }, 'rx', 10)).toBe(10);
            expect(EmomStrategy.scaleReps(14, { id: 'su', pattern: 'Cardio' }, 'rx', 10)).toBe(14);
        });

        it('should keep rep counts as they are for Cardio pattern exercises even if < 15', () => {
            expect(EmomStrategy.scaleReps(8, { id: 'run', pattern: 'Cardio' }, 'rx', 10)).toBe(8);
            expect(EmomStrategy.scaleReps(12, { id: 'row', pattern: 'Cardio' }, 'rx', 10)).toBe(12);
        });

        it('should cap standard movements at 10 reps if baseReps > 12', () => {
            expect(EmomStrategy.scaleReps(13, { id: 'thrusters', pattern: 'Squat' }, 'rx', 10)).toBe(10);
            expect(EmomStrategy.scaleReps(15, { id: 'pullups', pattern: 'Pull' }, 'rx', 10)).toBe(15); // Note: 15 hits the baseReps >= 15 condition first!
            expect(EmomStrategy.scaleReps(14, { id: 'clean', pattern: 'Weightlifting' }, 'rx', 10)).toBe(10);
        });

        it('should keep rep counts as they are for standard movements if <= 12', () => {
            expect(EmomStrategy.scaleReps(10, { id: 'thrusters', pattern: 'Squat' }, 'rx', 10)).toBe(10);
            expect(EmomStrategy.scaleReps(12, { id: 'pullups', pattern: 'Pull' }, 'rx', 10)).toBe(12);
            expect(EmomStrategy.scaleReps(5, { id: 'clean', pattern: 'Weightlifting' }, 'rx', 10)).toBe(5);
        });
    });
});
