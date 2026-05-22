// --- AUDIO ENGINE (Oscillators for Beeps) ---
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

const generateBeepUri = (freq, duration, volumeMult) => {
  const sampleRate = 8000;
  const numSamples = Math.floor(duration * sampleRate);
  const wav = new Uint8Array(44 + numSamples);

  const view = new DataView(wav.buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples, true);

  const finalVolume = globalVolume * volumeMult;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freq * t);
    // apply volume and convert to 8-bit PCM (0-255)
    const val = Math.max(0, Math.min(255, Math.floor((sample * finalVolume + 1) * 127.5)));
    view.setUint8(44 + i, val);
  }

  let binary = '';
  for (let i = 0; i < wav.byteLength; i++) {
    binary += String.fromCharCode(wav[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
};
export const playBeep = (freq = 880, type = 'sine', duration = 0.1, volumeMult = 1.0) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      // Fallback for older browsers
      const uri = generateBeepUri(freq, duration, volumeMult);
      const audio = new Audio(uri);
      audio.play().catch((e) => console.error('Fallback Audio Error', e));
      return;
    }

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
  } catch (e) {
    console.error('Audio Error', e);
  }
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
  },
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
