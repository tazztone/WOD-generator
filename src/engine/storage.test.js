import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { exportData, importData, loadConfig, saveConfig, DEFAULT_CONFIG, CONFIG_STORAGE_KEY, HISTORY_STORAGE_KEY, SAVED_WORKOUTS_STORAGE_KEY } from './storage';

describe('Storage Engine - loadConfig', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should migrate old config lacking a version number to version 1', () => {
        // Mock an old config in localStorage that doesn't have a version
        const oldConfig = {
            duration: 25,
            difficulty: 'Scaled',
            focus: 'Cardio'
        };
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(oldConfig));

        const config = loadConfig();

        // The migrated config should have version 1
        expect(config.version).toBe(1);

        // It should retain the loaded values
        expect(config.duration).toBe(25);
        expect(config.difficulty).toBe('Scaled');
        expect(config.focus).toBe('Cardio');

        // It should be merged with DEFAULT_CONFIG for other missing values
        expect(config.templateType).toBe(DEFAULT_CONFIG.templateType);
        expect(config.equipment).toEqual(DEFAULT_CONFIG.equipment);
    });

    it('should catch exceptions and return DEFAULT_CONFIG when localStorage fails', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('localStorage read failed');
        });

        const config = loadConfig();

        expect(config).toEqual(DEFAULT_CONFIG);
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
            action: 'loadConfig',
            message: 'Failed to load config',
            error: 'localStorage read failed'
        }));

        consoleSpy.mockRestore();
        getItemSpy.mockRestore();
    });
});


describe('Storage Engine - saveConfig', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should save config to localStorage', () => {
        const mockConfig = { version: 1, duration: 45, difficulty: 'Rx' };

        saveConfig(mockConfig);

        const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
        expect(storedConfig).toBeDefined();
        expect(JSON.parse(storedConfig)).toEqual(mockConfig);
    });

    it('should handle localStorage errors during saveConfig', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Mock quota exceeded');
        });

        const mockConfig = { version: 1 };
        saveConfig(mockConfig);

        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
            action: 'saveConfig',
            message: 'Failed to save config',
            error: 'Mock quota exceeded'
        }));

        consoleSpy.mockRestore();
        setItemSpy.mockRestore();
    });
});

describe('Storage Engine - Export/Import', () => {
    beforeEach(() => {
        // Mock localStorage
        // In jsdom environment, localStorage is available.
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should export all data correctly', () => {
        const mockConfig = { version: 1, duration: 45, difficulty: 'Rx' };
        const mockHistory = [{ id: 1, date: '2023-01-01', type: 'AMRAP' }];
        const mockSaved = [{ id: 101, name: 'Murph' }];

        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(mockConfig));
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(mockHistory));
        localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(mockSaved));

        const resultJson = exportData();
        const result = JSON.parse(resultJson);

        expect(result).toBeDefined();
        expect(result.version).toBe(1);
        expect(result.timestamp).toBeDefined();
        // Since loadConfig merges with default, we check for properties
        expect(result.config).toMatchObject(mockConfig);
        expect(result.history).toEqual(mockHistory);
        expect(result.savedWorkouts).toEqual(mockSaved);
    });

    it('should handle missing data gracefully during export', () => {
        // Only config exists (and it might be partial/default)
        // loadConfig returns merged default config if missing

        const resultJson = exportData();
        const result = JSON.parse(resultJson);

        expect(result.config).toBeDefined();
        expect(result.history).toEqual([]);
        expect(result.savedWorkouts).toEqual([]);
    });

    it('should import valid data correctly', () => {
        const importPayload = {
            version: 1,
            timestamp: new Date().toISOString(),
            config: { version: 1, duration: 60, difficulty: 'Scaled' },
            history: [{ id: 2, timestamp: '2023-02-01', type: 'EMOM' }],
            savedWorkouts: [{ id: 102, name: 'Fran' }]
        };

        const success = importData(JSON.stringify(importPayload));

        expect(success).toBe(true);

        const storedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
        const storedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
        const storedSaved = JSON.parse(localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY));

        expect(storedConfig).toMatchObject(importPayload.config);
        expect(storedHistory).toEqual(importPayload.history);
        expect(storedSaved).toEqual(importPayload.savedWorkouts);
    });

    it('should handle object input for import', () => {
        const importPayload = {
            version: 1,
            config: { version: 1, duration: 30 }
        };

        const success = importData(importPayload);
        expect(success).toBe(true);

        const storedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
        expect(storedConfig).toMatchObject(importPayload.config);
    });

    it('should validate import data structure and return false on errors', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(importData(null)).toBe(false);
        expect(importData(undefined)).toBe(false);
        expect(importData("invalid json")).toBe(false);
        expect(importData({})).toBe(false);
        // Missing version or bad structure - currently simple implementation might just ignore
        // extra fields, but let's see if we want strict validation.
        // For now, basic JSON parsing check is enough.
        consoleSpy.mockRestore();
    });

    it('should handle partial import (only history)', () => {
        const importPayload = {
            history: [{ id: 3, timestamp: '2023-03-01' }]
        };

        const success = importData(importPayload);
        expect(success).toBe(true);

        const storedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
        expect(storedHistory).toEqual(importPayload.history);

        // Config should remain untouched (or default if not set)
        // Since we didn't set config, it remains null in localStorage in this test env
        // unless importData sets defaults. It shouldn't touch keys not present.
        expect(localStorage.getItem(CONFIG_STORAGE_KEY)).toBeNull();
    });

    it('should throw an error when localStorage fails during export', () => {
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('localStorage is broken');
        });

        // Supress console.error output during this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            exportData();
        }).toThrow('localStorage is broken');

        consoleSpy.mockRestore();
        getItemSpy.mockRestore();
    });

    it('should catch exceptions and return false during import', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Mock quota exceeded');
        });

        const importPayload = {
            version: 1,
            history: [{ id: 4, timestamp: '2023-04-01' }]
        };

        const success = importData(importPayload);

        expect(success).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
            action: 'importData',
            message: 'Failed to import data',
            error: 'Mock quota exceeded'
        }));

        consoleSpy.mockRestore();
        setItemSpy.mockRestore();
    });

    it('should reject payloads larger than 5MB', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        // Create a string slightly larger than 5MB
        const largeString = 'a'.repeat((5 * 1024 * 1024) + 1);

        const success = importData(largeString);

        expect(success).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
            action: 'importData',
            message: 'Payload too large'
        }));

        consoleSpy.mockRestore();
    });
});
