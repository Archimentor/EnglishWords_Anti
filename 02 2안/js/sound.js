/**
 * Sound & Audio Synthesis Engine
 * - Web Audio API Synthesizer (Zero external sound file dependencies)
 * - Web Speech API (TTS with US/UK voice preference and speed control)
 */

const Sound = (() => {
  let audioCtx = null;
  let synth = window.speechSynthesis;
  let englishVoice = null;
  let voiceLang = 'en-US';
  let isSoundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ===== Web Audio API Sound Effects =====

  // Correct Answer: Bright major chord (C5 -> E5 -> G5)
  function playCorrect() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Wrong Answer: Gentle low double buzz
  function playWrong() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [180, 140].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.23);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Click / Tap: Crisp soft pop
  function playClick() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  // Flip Card Whoosh
  function playFlip() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {}
  }

  // Combo Chime: Escalating pitch based on streak
  function playCombo(comboCount = 1) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const baseFreq = 440; // A4
      const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
      const step = scale[Math.min(comboCount - 1, scale.length - 1)];
      const freq = baseFreq * Math.pow(2, step / 12);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Level Up / Victory Fanfare
  function playVictory() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.50, d: 0.35 } // C6
      ];

      let offset = 0;
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now + offset);

        gain.gain.setValueAtTime(0.22, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + item.d + 0.02);

        offset += item.d;
      });
    } catch (e) {}
  }

  // ===== Web Speech API (TTS) =====
  function initSpeech() {
    if (!synth) {
      console.warn('Web Speech API not supported on this browser.');
      return;
    }

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;

      // Find native US or UK English voice
      englishVoice = voices.find(v => v.lang === voiceLang && v.localService) ||
                     voices.find(v => v.lang === voiceLang) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     voices[0];
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  function speak(text, rate = 0.9, onEndCallback = null) {
    if (!synth || !text) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    synth.speak(utterance);
  }

  function speakSlow(text, onEndCallback = null) {
    speak(text, 0.65, onEndCallback);
  }

  function stop() {
    if (synth) synth.cancel();
  }

  function setSoundEnabled(enabled) {
    isSoundEnabled = !!enabled;
  }

  function setVoiceLang(lang) {
    voiceLang = lang;
    initSpeech();
  }

  return {
    init: initSpeech,
    playCorrect,
    playWrong,
    playClick,
    playFlip,
    playCombo,
    playVictory,
    speak,
    speakSlow,
    stop,
    setSoundEnabled,
    setVoiceLang,
    isSoundSupported: () => !!(window.AudioContext || window.webkitAudioContext),
    isSpeechSupported: () => !!window.speechSynthesis
  };
})();
