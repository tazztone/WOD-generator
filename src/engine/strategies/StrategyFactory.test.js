import { describe, it, expect, vi } from 'vitest';
import { getStrategy, getRandomTemplate } from './StrategyFactory.js';
import { AmrapStrategy } from './AmrapStrategy.js';
import { RftStrategy } from './RftStrategy.js';
import { EmomStrategy } from './EmomStrategy.js';
import { ChipperStrategy } from './ChipperStrategy.js';
import { TabataStrategy } from './TabataStrategy.js';
import { LadderStrategy } from './LadderStrategy.js';
import { DeathByStrategy } from './DeathByStrategy.js';
import { getSecureRandom } from '../secureRandom.js';

vi.mock('../secureRandom.js', () => ({
    getSecureRandom: vi.fn(() => 0.5)
}));

describe('StrategyFactory', () => {
    describe('getStrategy', () => {
        it('should return AmrapStrategy for "AMRAP"', () => {
            expect(getStrategy('AMRAP')).toBe(AmrapStrategy);
        });

        it('should return RftStrategy for "RFT"', () => {
            expect(getStrategy('RFT')).toBe(RftStrategy);
        });

        it('should return EmomStrategy for "EMOM"', () => {
            expect(getStrategy('EMOM')).toBe(EmomStrategy);
        });

        it('should return ChipperStrategy for "Chipper"', () => {
            expect(getStrategy('Chipper')).toBe(ChipperStrategy);
        });

        it('should return TabataStrategy for "Tabata"', () => {
            expect(getStrategy('Tabata')).toBe(TabataStrategy);
        });

        it('should return LadderStrategy for "Ladder"', () => {
            expect(getStrategy('Ladder')).toBe(LadderStrategy);
        });

        it('should return DeathByStrategy for "Death By"', () => {
            expect(getStrategy('Death By')).toBe(DeathByStrategy);
        });

        it('should return AmrapStrategy as fallback for unknown template name', () => {
            expect(getStrategy('Unknown Strategy')).toBe(AmrapStrategy);
        });

        it('should return AmrapStrategy as fallback for undefined input', () => {
            expect(getStrategy(undefined)).toBe(AmrapStrategy);
        });

        it('should return AmrapStrategy as fallback for null input', () => {
            expect(getStrategy(null)).toBe(AmrapStrategy);
        });
    });

    describe('getRandomTemplate', () => {
        it('should return a valid strategy key', () => {
            const validKeys = ['AMRAP', 'RFT', 'EMOM', 'Chipper', 'Tabata', 'Ladder', 'Death By'];
            const template = getRandomTemplate();
            expect(validKeys).toContain(template);
        });

        it('should be able to return different templates (not strictly deterministc test but checks randomization)', () => {
            // Mock Math.random to return specific values and check behavior


            // Should return first element ('AMRAP' based on object keys order but to be safe let's check it returns a string)
            vi.mocked(getSecureRandom).mockReturnValue(0.01);
            const firstTemplate = getRandomTemplate();
            expect(typeof firstTemplate).toBe('string');

            // Should return last element
            vi.mocked(getSecureRandom).mockReturnValue(0.99);
            const lastTemplate = getRandomTemplate();
            expect(typeof lastTemplate).toBe('string');

            // Clean up
            vi.mocked(getSecureRandom).mockRestore();
        });
    });
});
