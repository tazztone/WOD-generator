import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext';
import * as storage from '../engine/storage';
import * as audio from '../engine/audio';

vi.mock('../engine/storage', () => ({
    loadConfig: vi.fn(),
    saveConfig: vi.fn()
}));

vi.mock('../engine/audio', () => ({
    setGlobalVolume: vi.fn()
}));

describe('SettingsContext', () => {
    let mockStorage = {};

    beforeEach(() => {
        mockStorage = {};
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage[key] || null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { mockStorage[key] = value.toString(); });

        storage.loadConfig.mockReturnValue({ theme: 'dark', volume: 0.8 });
        audio.setGlobalVolume.mockClear();
        storage.saveConfig.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('throws error when useSettings is used outside of SettingsProvider', () => {
        // Suppress expected console.error during the throw test to keep output clean
        const originalConsoleError = console.error;
        console.error = vi.fn();
        expect(() => renderHook(() => useSettings())).toThrow('useSettings must be used within SettingsProvider');
        console.error = originalConsoleError;
    });

    it('loads default state correctly', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        expect(result.current.lang).toBe('en');
        expect(result.current.unit).toBe('kg');
        expect(result.current.config).toEqual({ theme: 'dark', volume: 0.8 });
        expect(result.current.tooltip).toBeNull();
        expect(result.current.modalOpen).toBe(false);
    });

    it('loads state from localStorage if available', () => {
        mockStorage['wod_lang'] = 'de';
        mockStorage['wod_unit'] = 'lbs';

        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        expect(result.current.lang).toBe('de');
        expect(result.current.unit).toBe('lbs');
    });

    it('toggles language and persists to localStorage', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        act(() => {
            result.current.toggleLang();
        });

        expect(result.current.lang).toBe('de');
        expect(mockStorage['wod_lang']).toBe('de');

        act(() => {
            result.current.toggleLang();
        });

        expect(result.current.lang).toBe('en');
        expect(mockStorage['wod_lang']).toBe('en');
    });

    it('toggles unit and persists to localStorage', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        act(() => {
            result.current.toggleUnit();
        });

        expect(result.current.unit).toBe('lbs');
        expect(mockStorage['wod_unit']).toBe('lbs');

        act(() => {
            result.current.toggleUnit();
        });

        expect(result.current.unit).toBe('kg');
        expect(mockStorage['wod_unit']).toBe('kg');
    });

    it('saves config changes and updates global volume', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        act(() => {
            result.current.setConfig({ theme: 'light', volume: 0.5 });
        });

        expect(storage.saveConfig).toHaveBeenCalledWith({ theme: 'light', volume: 0.5 });
        expect(audio.setGlobalVolume).toHaveBeenCalledWith(0.5);
    });

    it('handles tooltips correctly', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        const mockEvent = {
            stopPropagation: vi.fn(),
            currentTarget: {
                getBoundingClientRect: () => ({ left: 100, top: 200, width: 50 })
            }
        };

        act(() => {
            result.current.handleTooltip(mockEvent, 'Test Tooltip');
        });

        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(result.current.tooltip).toEqual({ x: 125, y: 190, text: 'Test Tooltip' });

        act(() => {
            result.current.clearTooltip();
        });

        expect(result.current.tooltip).toBeNull();
    });

    it('does not set tooltip if text is empty', () => {
        const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

        const mockEvent = {
            stopPropagation: vi.fn()
        };

        act(() => {
            result.current.handleTooltip(mockEvent, '');
        });

        expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        expect(result.current.tooltip).toBeNull();
    });
});
