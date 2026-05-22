import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveTimer } from './ActiveTimer';
import { SettingsProvider } from '../context/SettingsContext';

// Mock dependencies
vi.mock('../hooks/useWakeLock', () => ({
    useWakeLock: () => { }
}));

// Mock AudioContext and SpeechSynthesis
window.AudioContext = vi.fn().mockImplementation(() => ({
    createOscillator: () => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { setValueAtTime: vi.fn() },
        onended: null
    }),
    createGain: () => ({
        connect: vi.fn(),
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
    }),
    currentTime: 0,
    state: 'running',
    resume: vi.fn()
}));

window.speechSynthesis = {
    cancel: vi.fn(),
    speak: vi.fn(),
};

window.SpeechSynthesisUtterance = vi.fn();

const mockWorkout = {
    template: 'AMRAP',
    rounds: 0,
    timeCap: 10,
    exercises: [
        { reps: 10, exercise: { name: 'Burpees' } }
    ]
};

describe('ActiveTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should open audio settings popover when clicking settings button', () => {
        const { container } = render(
            <SettingsProvider>
                <ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />
            </SettingsProvider>
        );

        // The settings button is the second button in the header
        const buttons = container.querySelectorAll('button');
        const settingsBtn = buttons[1];

        fireEvent.click(settingsBtn);

        expect(screen.getByText('Audio Settings')).toBeInTheDocument();
    });

    it('should open and render audio settings popover', () => {
        const { container } = render(
            <SettingsProvider>
                <ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />
            </SettingsProvider>
        );

        // Open popover
        const buttons = container.querySelectorAll('button');
        fireEvent.click(buttons[1]);

        // Find a toggle button in the popover
        const toggles = container.querySelectorAll('.absolute button');
        fireEvent.click(toggles[1]);

        expect(screen.getByText('Audio Settings')).toBeInTheDocument();
    });

    it('should show confirmation dialog when clicking the cancel button', () => {
        const { container } = render(
            <SettingsProvider>
                <ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />
            </SettingsProvider>
        );

        // The cancel (X) button is the first button in the header
        const buttons = container.querySelectorAll('button');
        const cancelBtn = buttons[0];

        fireEvent.click(cancelBtn);

        expect(screen.getByText('Quit workout?')).toBeInTheDocument();
        expect(screen.getByText('Yes, Quit')).toBeInTheDocument();
        expect(screen.getByText('No, Stay')).toBeInTheDocument();
    });
});


