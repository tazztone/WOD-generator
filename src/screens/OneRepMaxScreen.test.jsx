import { render, screen, fireEvent } from '@testing-library/react';
import { OneRepMaxScreen } from './OneRepMaxScreen';
import { describe, it, expect, vi } from 'vitest';

describe('OneRepMaxScreen', () => {
    const mockProps = {
        lang: 'en',
        unit: 'kg',
        onBack: vi.fn()
    };

    it('calculates 1RM when weight and reps are entered', () => {
        render(<OneRepMaxScreen {...mockProps} />);
        
        const weightInput = screen.getByLabelText(/weight/i);
        const repsInput = screen.getByLabelText(/reps/i);

        fireEvent.change(weightInput, { target: { value: '100' } });
        fireEvent.change(repsInput, { target: { value: '5' } });

        // Using Epley formula: 100 * (1 + 5/30) = 116.66 -> 117
        expect(screen.getByText(/estimated 1 rep max/i)).toBeInTheDocument();
        expect(screen.getAllByText('117').length).toBeGreaterThan(0);
    });

    it('renders percentages grid when 1RM is calculated', () => {
        render(<OneRepMaxScreen {...mockProps} />);
        fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText(/reps/i), { target: { value: '1' } });

        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText('90%')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
    });
});