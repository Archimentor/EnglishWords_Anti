/**
 * Web Audio API Sound Synthesizer & Web Speech Engine (Grammar Master Pro)
 * 100% Standalone - zero external audio asset dependencies
 */

const Sound = (() => {
  let audioCtx = null;
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

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, startTimeOffset = 0) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTimeOffset);
      osc.stop(ctx.currentTime + startTimeOffset + duration);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }

  // 1. Correct Answer Sound (C-Major Triad Chord)
  function playCorrect() {
    if (!isSoundEnabled) return;
    playTone(523.25, 'triangle', 0.2, 0.12, 0);     // C5
    playTone(659.25, 'triangle', 0.25, 0.12, 0.06);  // E5
    playTone(783.99, 'triangle', 0.35, 0.15, 0.12);  // G5
    playTone(1046.50, 'sine', 0.45, 0.18, 0.18);     // C6
  }

  // 2. Wrong Answer Sound (Low Buzzer)
  function playWrong() {
    if (!isSoundEnabled) return;
    playTone(196.00, 'sawtooth', 0.22, 0.15, 0);    // G3
    playTone(185.00, 'sawtooth', 0.3, 0.18, 0.08);   // F#3
  }

  // 3. Combo Chime
  function playCombo(combo = 1) {
    if (!isSoundEnabled) return;
    const baseFreq = 587.33; // D5
    const step = Math.min(combo, 8) * 45;
    playTone(baseFreq + step, 'sine', 0.18, 0.14, 0);
    playTone(baseFreq + step + 150, 'triangle', 0.25, 0.16, 0.06);
  }

  // 4. Click / Tap Sound
  function playClick() {
    if (!isSoundEnabled) return;
    playTone(800, 'sine', 0.05, 0.06, 0);
  }

  // 5. Victory Fanfare (Level Clear)
  function playFanfare() {
    if (!isSoundEnabled) return;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.36 },
      { f: 880.00, d: 0.15, t: 0.5 },
      { f: 1046.50, d: 0.6, t: 0.65 }
    ];
    notes.forEach(n => playTone(n.f, 'triangle', n.d, 0.16, n.t));
  }

  // 6. Web Speech API (TTS)
  function speak(text, lang = 'en-US', rate = 0.95) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith(lang) || v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speak failed:", e);
    }
  }

  function setSoundEnabled(enabled) {
    isSoundEnabled = !!enabled;
  }

  function isEnabled() {
    return isSoundEnabled;
  }

  return {
    playCorrect,
    playWrong,
    playCombo,
    playClick,
    playFanfare,
    speak,
    setSoundEnabled,
    isEnabled
  };
})();
