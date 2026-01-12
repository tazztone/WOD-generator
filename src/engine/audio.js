
// --- AUDIO ENGINE (Oscillators for Beeps) ---
export const playBeep = (freq = 880, type = 'sine', duration = 0.1) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
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

export const speak = (text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
};
