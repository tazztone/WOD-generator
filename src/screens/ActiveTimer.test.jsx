import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
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

const mockConfig = {
    volume: 0.7,
    audioSettings: { countdowns: true, announcements: true, beeps: true }
};

describe('ActiveTimer', () => {
    let container = null;
    let root = null;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });
        container.remove();
        container = null;
    });

    // Helper to wrap state updates
    function act(callback) {
        flushSync(callback);
    }

    it('should open audio settings popover when clicking settings button', () => {
        act(() => {
            root.render(
                <SettingsProvider>
                    <ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" setModalOpen={() => { }} />
                </SettingsProvider>
            );
        });

        // The settings button is the second button in the header
        const buttons = container.querySelectorAll('button');
        const settingsBtn = buttons[1];

        act(() => {
            settingsBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(container.textContent).toContain('Audio Settings');
    });

    it('should open and render audio settings popover', () => {
        act(() => {
            root.render(
                <SettingsProvider>
                    <ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" setModalOpen={() => { }} />
                </SettingsProvider>
            );
        });

        // Open popover
        const buttons = container.querySelectorAll('button');
        act(() => {
            buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        // Find a toggle button in the popover
        const toggles = container.querySelectorAll('.absolute button');
        // Check if settings appear
        act(() => {
            toggles[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(container.textContent).toContain('Audio Settings');
    });
});
