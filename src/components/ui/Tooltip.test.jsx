import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Tooltip Component', () => {
    beforeEach(() => {
        vi.stubGlobal('innerWidth', 1000);
        vi.stubGlobal('innerHeight', 1000);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders tooltip text', () => {
        render(<Tooltip x={100} y={100} text="Test Tooltip" />);
        expect(screen.getByText('Test Tooltip')).toBeInTheDocument();
    });

    it('has correct ARIA attributes', () => {
        render(<Tooltip x={100} y={100} text="Test Tooltip" />);
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveAttribute('aria-live', 'polite');
    });

    it('flips vertically when near top edge', () => {
        // Mock getBoundingClientRect
        const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
            width: 100,
            height: 50,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });

        const { container } = render(<Tooltip x={500} y={20} text="Top Tooltip" />);
        const tooltip = container.firstChild;

        // At y=20, with height=50, it should flip.
        // We can check the style or classes.
        // In our implementation, flipped state will use translateY(8px) instead of -100%
        expect(tooltip.style.transform).toContain('translateY(8px)');

        spy.mockRestore();
    });

    it('shifts horizontally when near left edge', () => {
        const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
            width: 200,
            height: 50,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });

        const { container } = render(<Tooltip x={50} y={500} text="Left Tooltip" />);
        const tooltip = container.firstChild;

        // x=50, width=200. Left edge would be 50 - 100 = -50.
        // It should shift by at least 60px to have a 10px padding.
        // So offsetX should be around 60.
        expect(tooltip.style.transform).toContain('translateX(calc(-50% +');

        spy.mockRestore();
    });
});
