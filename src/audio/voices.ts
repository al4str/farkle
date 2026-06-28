import type { AudioHandle } from "src/audio/types";
import type { AudioSoundId } from "src/audio/catalog";

export interface AudioVoicesPlayParams {
  id: AudioSoundId;
  buffer: AudioBuffer;
  bus: GainNode;
  ctx: AudioContext;
  gain: number;
  rate: number;
  maxVoices: number;
}

interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
  id: AudioSoundId;
  startedAt: number;
  onEnded: () => void;
}

interface VoicesState {
  active: Set<Voice>;
  perSound: Map<AudioSoundId, Set<Voice>>;
}

const MAX_VOICES_TOTAL = 24;

const STATE: VoicesState = {
  active: new Set(),
  perSound: new Map(),
};

export function audioVoicesCount(): number {
  return STATE.active.size;
}

export function audioVoicesPlay(params: AudioVoicesPlayParams): AudioHandle {
  enforceCaps(params.id, params.maxVoices);

  const source = params.ctx.createBufferSource();
  source.buffer = params.buffer;
  source.playbackRate.value = params.rate;

  const voiceGain = params.ctx.createGain();
  voiceGain.gain.value = params.gain;
  source.connect(voiceGain);
  voiceGain.connect(params.bus);

  const voice: Voice = {
    source,
    gain: voiceGain,
    id: params.id,
    startedAt: params.ctx.currentTime,
    onEnded: (): void => {
      cleanup(voice);
    },
  };
  register(voice);
  source.addEventListener("ended", voice.onEnded, { once: true });
  source.start(0);

  return {
    stop: (): void => {
      stopVoice(voice);
    },
  };
}

export function audioVoicesStopAll(): void {
  for (const voice of Array.from(STATE.active)) {
    stopVoice(voice);
  }
}

function enforceCaps(id: AudioSoundId, maxVoices: number): void {
  const sounds = STATE.perSound.get(id);
  if (sounds && sounds.size >= maxVoices) {
    stealOldest(sounds);
  }
  if (STATE.active.size >= MAX_VOICES_TOTAL) {
    stealOldest(STATE.active);
  }
}

function stealOldest(set: Set<Voice>): void {
  let oldest: undefined | Voice;
  for (const voice of set) {
    if (oldest === undefined || voice.startedAt < oldest.startedAt) {
      oldest = voice;
    }
  }
  if (oldest) {
    stopVoice(oldest);
  }
}

function stopVoice(voice: Voice): void {
  try {
    voice.source.stop();
  }
  catch {
    // Source may already be stopped; cleanup still runs below.
  }
  cleanup(voice);
}

function register(voice: Voice): void {
  STATE.active.add(voice);
  const set = STATE.perSound.get(voice.id);
  if (set) {
    set.add(voice);
  }
  else {
    STATE.perSound.set(voice.id, new Set([voice]));
  }
}

function cleanup(voice: Voice): void {
  if (!STATE.active.has(voice)) {
    return;
  }
  STATE.active.delete(voice);
  const set = STATE.perSound.get(voice.id);
  if (set) {
    set.delete(voice);
    if (set.size === 0) {
      STATE.perSound.delete(voice.id);
    }
  }
  voice.source.removeEventListener("ended", voice.onEnded);
  try {
    voice.source.disconnect();
    voice.gain.disconnect();
  }
  catch {
    // Nodes may already be disconnected.
  }
}
