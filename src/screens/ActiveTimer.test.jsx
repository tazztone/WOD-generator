import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ActiveTimer } from './ActiveTimer';

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

    it('should initialize voiceEnabled to true by default', () => {
        act(() => {
            root.render(<ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />);
        });

        // Find the toggle button. It's the 2nd button (index 1).
        const buttons = container.querySelectorAll('button');
        expect(buttons[1]).toBeDefined();

        // Assume default is voice on.
        // We can't easily check internal state, but we can verify subsequent actions.
    });

    it('should persist voice preference to localStorage', () => {
        act(() => {
            root.render(<ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />);
        });

        const buttons = container.querySelectorAll('button');
        const voiceButton = buttons[1];

        // Click to toggle off
        act(() => {
            voiceButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        // EXPECTED FAIL: Currently does not persist
        expect(localStorage.getItem('voiceEnabled')).toBe('false');

        // Click to toggle on
        act(() => {
            voiceButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(localStorage.getItem('voiceEnabled')).toBe('true');
    });

    it('should initialize voiceEnabled from localStorage', () => {
        localStorage.setItem('voiceEnabled', 'false');

        act(() => {
            root.render(<ActiveTimer workout={mockWorkout} onExit={() => { }} onSave={() => { }} lang="en" />);
        });

        // If it initialized to false, clicking it should turn it true and save 'true'
        const buttons = container.querySelectorAll('button');
        const voiceButton = buttons[1];

        act(() => {
            voiceButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(localStorage.getItem('voiceEnabled')).toBe('true');
    });
});
