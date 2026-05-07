import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { speak, cancelSpeech } from './audio';

describe('Audio Engine Speech Queue', () => {
    let mockSpeechSynthesis;
    let mockUtterances = [];

    beforeEach(() => {
        mockUtterances = [];

        // Mock SpeechSynthesisUtterance
        global.SpeechSynthesisUtterance = class {
            constructor(text) {
                this.text = text;
                this.lang = '';
                this.rate = 1;
                this.volume = 1;
                this.onend = null;
                this.onerror = null;
            }
        };

        // Mock window.speechSynthesis
        mockSpeechSynthesis = {
            speak: vi.fn((utterance) => {
                mockUtterances.push(utterance);
            }),
            cancel: vi.fn(() => {
                // In a real browser, cancel stops current and clears browser's queue.
                // Our internal queue is cleared by our cancelSpeech function.
            }),
            speaking: false
        };

        vi.stubGlobal('speechSynthesis', mockSpeechSynthesis);
    });

    afterEach(() => {
        cancelSpeech(); // Reset internal state of the module
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('should queue multiple speech requests and process them sequentially', () => {
        speak('First');
        speak('Second');

        // First one should start immediately
        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
        expect(mockUtterances[0].text).toBe('First');

        // Simulate first one ending
        mockUtterances[0].onend();

        // Second one should start now
        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
        expect(mockUtterances[1].text).toBe('Second');
    });

    it('should not start second if first is still playing', () => {
        speak('First');
        speak('Second');

        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
        expect(mockUtterances.length).toBe(1);
    });

    it('should clear the queue and stop speaking when cancelSpeech is called', () => {
        speak('First');
        speak('Second');

        cancelSpeech();

        expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();

        // Triggering onend of the first one (which was already handed to speechSynthesis)
        // should not trigger the second one because speechQueue was cleared.
        if (mockUtterances[0] && mockUtterances[0].onend) {
            mockUtterances[0].onend();
        }

        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('should handle errors by continuing to the next item', () => {
        speak('First');
        speak('Second');

        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);

        // Simulate error on first
        if (mockUtterances[0] && mockUtterances[0].onerror) {
            mockUtterances[0].onerror({ error: 'test error' });
        }

        // Should still move to second
        expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
        expect(mockUtterances[1].text).toBe('Second');
    });
});
