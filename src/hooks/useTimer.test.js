import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';
import { Haptics } from '@capacitor/haptics';

vi.mock('@capacitor/haptics', () => ({
    Haptics: {
        impact: vi.fn(),
        vibrate: vi.fn(),
    },
    ImpactStyle: {
        Light: 'LIGHT',
        Heavy: 'HEAVY',
        Medium: 'MEDIUM'
    }
}));

vi.mock('../engine/audio', () => ({
    SOUNDS: {
        countdown: vi.fn(),
        start: vi.fn(),
        halfway: vi.fn(),
        round: vi.fn(),
        end: vi.fn(),
    },
    speak: vi.fn()
}));

describe('useTimer haptic helper', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        Object.defineProperty(navigator, 'vibrate', {
            value: vi.fn(),
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('falls back to navigator.vibrate when Haptics throws', async () => {
        // Mock Haptics.impact to throw an error (simulating non-Capacitor environment)
        Haptics.impact.mockRejectedValue(new Error('Capacitor missing'));

        const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };

        const { result } = renderHook(() => useTimer(workout, 'en', { countdowns: true, announcements: true, beeps: true }));

        // Fast forward 8 seconds to reach countdown (timeLeft <= 3) where haptic(50) is called
        await act(async () => {
            vi.advanceTimersByTime(8000);
        });

        // Wait for rejected promise to settle
        await act(async () => {
            await Promise.resolve();
        });

        // Verify Haptics was called, threw, and navigator.vibrate was used as fallback
        expect(Haptics.impact).toHaveBeenCalled();
        expect(navigator.vibrate).toHaveBeenCalledWith(50);
    });

    it('covers other branches in the try block', async () => {
        const workout = { id: 'test-1', template: 'AMRAP', timeCap: 10, exercises: [] };

        const { result } = renderHook(() => useTimer(workout, 'en', { countdowns: true, announcements: true, beeps: true }));

        // Start timer properly
        await act(async () => {
            // Wait for 10 seconds of countdown to trigger start sound and haptic([200, 100, 200])
            vi.advanceTimersByTime(11000);
        });

        await act(async () => {
            await Promise.resolve();
        });

        // haptic([200, 100, 200]) has length > 2 so it should call Haptics.vibrate
        expect(Haptics.vibrate).toHaveBeenCalledWith({ duration: 500 });

        // Fast forward 10 minutes to end to trigger haptic([500, 200, 500])
        await act(async () => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });

        await act(async () => {
            await Promise.resolve();
        });

        // Also has length > 2, expect Haptics.vibrate again
        expect(Haptics.vibrate).toHaveBeenCalledWith({ duration: 500 });
    });
});
