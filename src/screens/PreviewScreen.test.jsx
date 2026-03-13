import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewScreen } from './PreviewScreen';
import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../engine/storage';

describe('PreviewScreen', () => {
    const mockWorkout = {
        template: 'AMRAP',
        timeCap: 20,
        rounds: null,
        exercises: [
            { exercise: { id: 'pushup', name: 'Push-Up', pattern: 'Push' }, reps: 15 },
            { exercise: { id: 'air_squat', name: 'Air Squat', pattern: 'Squat' }, reps: 20 }
        ],
        warmup: ['Line 1', 'Line 2'],
        strength: null,
        isPartner: false
    };

    const mockProps = {
        workout: mockWorkout,
        config: DEFAULT_CONFIG,
        onManualSwap: vi.fn(),
        onStart: vi.fn(),
        lang: 'en',
        onBack: vi.fn(),
        isSaved: false,
        onToggleSave: vi.fn(),
        modalOpen: false,
        setModalOpen: vi.fn(),
        onTooltip: vi.fn(),
        onReroll: vi.fn()
    };

    it('renders workout details correctly', () => {
        render(<PreviewScreen {...mockProps} />);
        expect(screen.getByText('AMRAP')).toBeInTheDocument();
        expect(screen.getByText(/20/)).toBeInTheDocument(); // Match 20 (as in 20m)
        expect(screen.getByText('Push-Up')).toBeInTheDocument();
        expect(screen.getByText('Air Squat')).toBeInTheDocument();
    });

    it('calls onReroll when reroll button is clicked', () => {
        render(<PreviewScreen {...mockProps} />);
        const rerollBtn = screen.getByText(/Reroll/i);
        fireEvent.click(rerollBtn);
        expect(mockProps.onReroll).toHaveBeenCalledTimes(1);
    });

    it('calls onStart when start button is clicked', () => {
        render(<PreviewScreen {...mockProps} />);
        const startBtn = screen.getByTestId('start-btn');
        fireEvent.click(startBtn);
        expect(mockProps.onStart).toHaveBeenCalledTimes(1);
    });

    it('renders strength part if present', () => {
        const workoutWithStrength = {
            ...mockWorkout,
            strength: { name: 'Back Squat', sets: '5x5', notes: 'Go heavy' }
        };
        render(<PreviewScreen {...mockProps} workout={workoutWithStrength} />);
        expect(screen.getByText('Back Squat')).toBeInTheDocument();
        expect(screen.getByText('5x5 — Go heavy')).toBeInTheDocument();
    });
});
