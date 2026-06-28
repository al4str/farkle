import { audioContextEnsure } from "src/audio/context";
import { audioFormatResolveSfx } from "src/audio/format";

interface BuffersState {
  decoded: Map<string, AudioBuffer>;
  inflight: Map<string, Promise<AudioBuffer>>;
}

const STATE: BuffersState = {
  decoded: new Map(),
  inflight: new Map(),
};

export function audioBuffersGet(baseName: string): undefined | AudioBuffer {
  return STATE.decoded.get(baseName);
}

export function audioBuffersLoad(baseName: string): Promise<AudioBuffer> {
  const cached = STATE.decoded.get(baseName);
  if (cached) {
    return Promise.resolve(cached);
  }
  const pending = STATE.inflight.get(baseName);
  if (pending) {
    return pending;
  }
  const promise = fetchDecode(baseName);
  STATE.inflight.set(baseName, promise);
  return promise;
}

export function audioBuffersEvict(baseName: string): void {
  STATE.decoded.delete(baseName);
}

export function audioBuffersClear(): void {
  STATE.decoded.clear();
}

async function fetchDecode(baseName: string): Promise<AudioBuffer> {
  try {
    const ctx = audioContextEnsure();
    if (!ctx) {
      throw new Error("AudioContext unavailable");
    }
    const response = await fetch(audioFormatResolveSfx(baseName));
    if (!response.ok) {
      throw new Error(`Failed to fetch audio "${baseName}": ${response.status}`);
    }
    const data = await response.arrayBuffer();
    const buffer = await ctx.decodeAudioData(data);
    STATE.decoded.set(baseName, buffer);
    return buffer;
  }
  finally {
    STATE.inflight.delete(baseName);
  }
}
