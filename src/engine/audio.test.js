import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setGlobalVolume, playBeep } from './audio.js';

describe('audio.js', () => {
  let mockGainNode;
  let mockCtx;

  beforeEach(() => {
    mockGainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    const mockOscillator = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };

    mockCtx = {
      currentTime: 0,
      state: 'running',
      destination: {},
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      resume: vi.fn(),
    };

    window.AudioContext = vi.fn(() => mockCtx);
    window.webkitAudioContext = undefined;
  });

  describe('setGlobalVolume', () => {
    it('should correctly set volume within bounds [0, 1]', () => {
      setGlobalVolume(0.5);
      playBeep(880, 'sine', 0.1, 1.0);

      // Check that volume 0.5 was used
      // gain.gain.setValueAtTime(0.01 * finalVolume, ...) -> 0.005
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.005, 0);
    });

    it('should clamp volume to maximum 1', () => {
      setGlobalVolume(1.5);
      playBeep(880, 'sine', 0.1, 1.0);

      // Should be clamped to 1.0 -> 0.01 * 1.0 = 0.01
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.01, 0);
    });

    it('should clamp volume to minimum 0', () => {
      setGlobalVolume(-0.5);
      playBeep(880, 'sine', 0.1, 1.0);

      // Should be clamped to 0 -> 0.01 * 0 = 0
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('playBeep fallback', () => {
    beforeEach(() => {
      window.Audio = vi.fn().mockImplementation(() => ({
        play: vi.fn().mockResolvedValue(),
        volume: 1,
      }));
    });

    it('should use fallback Audio when AudioContext is missing', async () => {
      window.AudioContext = undefined;
      window.webkitAudioContext = undefined;

      vi.resetModules();
      const { playBeep: playBeepFallback } = await import('./audio.js');

      playBeepFallback(880, 'sine', 0.1, 1.0);
      expect(window.Audio).toHaveBeenCalled();
    });
  });
});
