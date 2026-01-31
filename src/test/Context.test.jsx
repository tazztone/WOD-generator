import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';

// Mock Storage
const mockStorage = {};
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; },
        clear: () => { for (const key in mockStorage) delete mockStorage[key]; }
    }
});

describe('Context Architecture (v1.10)', () => {
    it('provides unified state via useAppContext', () => {
        const { result } = renderHook(() => useAppContext(), {
            wrapper: AppProvider
        });

        expect(result.current.state.appState).toBe('config');
        expect(result.current.state.lang).toBe('en');
        expect(result.current.state.config).toBeDefined();
    });

    it('updates settings across providers', () => {
        const { result } = renderHook(() => useAppContext(), {
            wrapper: AppProvider
        });

        act(() => {
            result.current.actions.toggleLang();
        });

        expect(result.current.state.lang).toBe('de');
    });

    it('manages workout state', () => {
        const { result } = renderHook(() => useAppContext(), {
            wrapper: AppProvider
        });

        act(() => {
            result.current.actions.generateWorkout();
        });

        expect(result.current.state.appState).toBe('preview');
        expect(result.current.state.workout).not.toBeNull();
    });
});
