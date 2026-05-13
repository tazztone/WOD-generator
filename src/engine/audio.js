
// --- AUDIO ENGINE (Oscillators for Beeps) ---
// TODO: Add fallback audio using Audio API for older browsers that don't support AudioContext
// Singleton AudioContext
let audioCtx = null;
let globalVolume = 0.7;

export const setGlobalVolume = (val) => {
    globalVolume = Math.max(0, Math.min(1, val));
};

const getAudioContext = () => {
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
            audioCtx = new Ctx();
        }
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

export const playBeep = (freq = 880, type = 'sine', duration = 0.1, volumeMult = 1.0) => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const finalVolume = globalVolume * volumeMult;

        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0.01 * finalVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2 * finalVolume, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001 * finalVolume, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.1);

        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    } catch (e) { console.error("Audio Error", e); }
};

export const SOUNDS = {
    click: () => playBeep(1200, 'sine', 0.05, 0.5),
    countdown: () => playBeep(440, 'triangle', 0.15, 0.8),
    start: () => playBeep(880, 'square', 0.5, 1.0),
    round: () => playBeep(660, 'sine', 0.3, 0.7),
    halfway: () => {
        playBeep(523, 'sine', 0.1, 0.6);
        setTimeout(() => playBeep(659, 'sine', 0.1, 0.6), 150);
    },
    warning: () => playBeep(330, 'triangle', 0.4, 0.9),
    end: () => {
        playBeep(440, 'square', 0.2, 1.0);
        setTimeout(() => playBeep(440, 'square', 0.2, 1.0), 250);
        setTimeout(() => playBeep(880, 'square', 0.8, 1.0), 500);
    }
};

// --- SPEECH ENGINE (Queue to prevent overlapping) ---
let speechQueue = [];
let isSpeaking = false;

const processQueue = () => {
    if (isSpeaking || speechQueue.length === 0) return;

    isSpeaking = true;
    const { text, lang, volume } = speechQueue.shift();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 1.1;
    utterance.volume = volume;

    utterance.onend = () => {
        isSpeaking = false;
        processQueue();
    };

    utterance.onerror = () => {
        isSpeaking = false;
        processQueue();
    };

    window.speechSynthesis.speak(utterance);
};

export const speak = (text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    
    speechQueue.push({ text, lang, volume: globalVolume });
    processQueue();
};

