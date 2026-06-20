import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from './WorkoutContext';
import { HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from '../engine/storage';

// Mock the SettingsContext
vi.mock('./SettingsContext', () => ({
  useSettings: () => ({
    config: { volume: 0.5 },
    lang: 'en',
  }),
}));

// Mock the engine generator
vi.mock('../engine/generator', () => ({
  generateWorkout: vi.fn(),
  swapExercise: vi.fn(),
}));

// Dummy component to consume the context
const TestComponent = () => {
  const { history, savedWorkouts } = useWorkout();
  return (
    <div>
      <span data-testid="history-length">{history.length}</span>
      <span data-testid="saved-workouts-length">{savedWorkouts.length}</span>
    </div>
  );
};

describe('WorkoutContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads history and saved workouts from localStorage on mount', () => {
    const dummyHistory = [{ id: 1, name: 'Test WOD' }];
    const dummySavedWorkouts = [{ id: 2, name: 'Saved WOD' }];

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(dummyHistory));
    localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(dummySavedWorkouts));

    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    expect(screen.getByTestId('history-length')).toHaveTextContent('1');
    expect(screen.getByTestId('saved-workouts-length')).toHaveTextContent('1');
  });

  it('handles JSON.parse errors gracefully and defaults to empty state', () => {
    // Set invalid JSON strings
    localStorage.setItem(HISTORY_STORAGE_KEY, 'invalid-json');
    localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, '{ broken-json');

    // Render the provider; it should catch the parse error internally
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );

    // State should default to empty arrays
    expect(screen.getByTestId('history-length')).toHaveTextContent('0');
    expect(screen.getByTestId('saved-workouts-length')).toHaveTextContent('0');
  });
});
