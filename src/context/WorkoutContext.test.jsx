import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from './WorkoutContext';
import { SettingsProvider } from './SettingsContext';
import { HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from '../engine/storage';

const wrapper = ({ children }) => (
    <SettingsProvider>
        <WorkoutProvider>
            {children}
        </WorkoutProvider>
    </SettingsProvider>
);

describe('WorkoutContext error path', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('handles invalid JSON in localStorage gracefully on mount', () => {
        localStorage.setItem(HISTORY_STORAGE_KEY, '{invalid json');
        const { result } = renderHook(() => useWorkout(), { wrapper });
        expect(result.current.history).toEqual([]);

        localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, '{invalid json2');
        const { result: result2 } = renderHook(() => useWorkout(), { wrapper });
        expect(result2.current.savedWorkouts).toEqual([]);
    });
});
