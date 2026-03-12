import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryScreen } from './HistoryScreen';
import { describe, it, expect, vi } from 'vitest';

describe('HistoryScreen', () => {
    const mockHistory = [
        {
            id: 1,
            template: 'AMRAP',
            score: '10 Rounds',
            date: new Date().toISOString(),
            exercises: [{ reps: 10, exercise: { name: 'Push-Up' } }]
        }
    ];

    const mockSaved = [
        {
            id: 101,
            template: 'RFT',
            timeCap: 20,
            exercises: [{ reps: 10, exercise: { name: 'Air Squat' } }]
        }
    ];

    const mockProps = {
        history: mockHistory,
        savedWorkouts: mockSaved,
        onDeleteEntry: vi.fn(),
        onDeleteSaved: vi.fn(),
        onStartWorkout: vi.fn(),
        clearHistory: vi.fn(),
        onBack: vi.fn(),
        lang: 'en'
    };

    it('renders history entries by default', () => {
        render(<HistoryScreen {...mockProps} />);
        expect(screen.getByText('AMRAP')).toBeInTheDocument();
        expect(screen.getByText('10 Rounds')).toBeInTheDocument();
        expect(screen.getByText(/Push-Up/)).toBeInTheDocument();
    });

    it('switches to saved workouts tab', () => {
        render(<HistoryScreen {...mockProps} />);
        const savedTab = screen.getByText(/saved/i);
        fireEvent.click(savedTab);
        expect(screen.getByText('RFT')).toBeInTheDocument();
        expect(screen.getByText(/Air Squat/)).toBeInTheDocument();
    });

    it('calls onStartWorkout when start button is clicked in saved tab', () => {
        render(<HistoryScreen {...mockProps} />);
        fireEvent.click(screen.getByText(/saved/i));
        const startBtn = screen.getByRole('button', { name: /start/i });
        fireEvent.click(startBtn);
        expect(mockProps.onStartWorkout).toHaveBeenCalledWith(mockSaved[0]);
    });
});
