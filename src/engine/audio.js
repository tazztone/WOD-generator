
// --- AUDIO ENGINE (Oscillators for Beeps) ---
// TODO: Add volume control setting for users (currently hardcoded gain values)
// TODO: Add fallback audio using Audio API for older browsers that don't support AudioContext
// Singleton AudioContext
let audioCtx = null;

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

export const playBeep = (freq = 880, type = 'sine', duration = 0.1) => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.1);

        // Cleanup helps garbage collection, though nodes disconnect automatically on stop
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    } catch (e) { console.error("Audio Error", e); }
};

export const SOUNDS = {
    click: () => playBeep(1200, 'sine', 0.05),
    countdown: () => playBeep(600, 'square', 0.1),
    start: () => playBeep(1000, 'square', 0.6),
    round: () => playBeep(880, 'sine', 0.3),
    end: () => {
        playBeep(600, 'square', 0.1);
        setTimeout(() => playBeep(600, 'square', 0.1), 150);
        setTimeout(() => playBeep(1000, 'square', 0.8), 300);
    }
};

// TODO: Add voice selection in settings (some users prefer different voices/accents)
// TODO: Queue speech synthesis to prevent overlapping announcements
export const speak = (text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
};
