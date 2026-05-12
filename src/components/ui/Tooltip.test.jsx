import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';
import { describe, it, expect } from 'vitest';

describe('Tooltip Component', () => {
    it('renders text correctly', () => {
        render(<Tooltip x={100} y={100} text="Test Tooltip" />);
        expect(screen.getByText('Test Tooltip')).toBeInTheDocument();
    });

    it('has a unique id', () => {
        const { rerender } = render(<Tooltip x={100} y={100} text="Tooltip 1" />);
        const firstId = screen.getByRole('tooltip').id;
        expect(firstId).toMatch(/^tt-/);

        rerender(<Tooltip x={200} y={200} text="Tooltip 1 updated" />);
        const secondId = screen.getByRole('tooltip').id;

        // With current Math.random() implementation, it should stay the same due to empty dependency array in useMemo
        expect(firstId).toBe(secondId);
    });
});
