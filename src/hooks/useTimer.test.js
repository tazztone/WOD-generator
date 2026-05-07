import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { useTimer } from './useTimer';
import { SOUNDS, speak } from '../engine/audio';

vi.mock('../engine/audio', () => ({
    SOUNDS: {
        countdown: vi.fn(),
        start: vi.fn(),
        end: vi.fn(),
        round: vi.fn(),
    },
    speak: vi.fn(),
}));


const mockWorkout = (template = 'AMRAP', timeCap = 1, rounds = 1) => ({
    template,
    timeCap,
    rounds,
    exercises: [{ exercise: { name: 'Test Exercise' } }],
});


describe('useTimer', () => {
    let container;
    let root;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
        vi.useFakeTimers();
        SOUNDS.countdown.mockClear();
        SOUNDS.start.mockClear();
        SOUNDS.end.mockClear();
        SOUNDS.round.mockClear();
        speak.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
        act(() => {
            root.unmount();
        });
        container.remove();
        container = null;
    });

    const renderHook = (hook) => {
        let result = {};
        const TestComponent = () => {
            Object.assign(result, hook());
            return null;
        };
        act(() => {
            root.render(<TestComponent />);
        });
        return { result };
    };

    it('should initialize with pre-start countdown', () => {
        const { result } = renderHook(() => useTimer(mockWorkout(), 'en', false));
        expect(result.status).toBe('pre');
        expect(result.timeLeft).toBe(10);
    });

    it('should transition from pre-start to work', () => {
        const { result } = renderHook(() => useTimer(mockWorkout('AMRAP', 5), 'en', true));
        expect(result.status).toBe('pre');
        expect(result.timeLeft).toBe(10);

        act(() => { vi.advanceTimersByTime(7000); }); // 7s
        expect(result.timeLeft).toBe(3);
        expect(SOUNDS.countdown).toHaveBeenCalledTimes(4);

        act(() => { vi.advanceTimersByTime(3000); }); // 10s
        expect(SOUNDS.start).toHaveBeenCalledTimes(1);
        expect(speak).toHaveBeenCalledWith('Up Next: Test Exercise', 'en');
        expect(result.status).toBe('work');
        expect(result.timeLeft).toBe(300); // 5 min * 60s
    });

    it('should finish the timer', () => {
        const { result } = renderHook(() => useTimer(mockWorkout('AMRAP', 1), 'en', false));
        // Pre-start
        act(() => { vi.advanceTimersByTime(10000); });
        expect(result.status).toBe('work');
        expect(result.timeLeft).toBe(60);

        // Work
        act(() => { vi.advanceTimersByTime(60000); });
        expect(result.status).toBe('finished');
        expect(SOUNDS.end).toHaveBeenCalledTimes(1);
    });
});
