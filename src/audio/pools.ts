import type { AudioSoundId } from "src/audio/catalog";

interface PoolsState {
  lastIndex: Map<AudioSoundId, number>;
}

const STATE: PoolsState = {
  lastIndex: new Map(),
};

export function audioPoolsPick(id: AudioSoundId, count: number): number {
  if (count <= 1) {
    return 0;
  }
  const last = STATE.lastIndex.get(id);
  let index = Math.floor(Math.random() * count);
  if (index === last) {
    index = (index + 1) % count;
  }
  STATE.lastIndex.set(id, index);
  return index;
}

export function audioPoolsReset(): void {
  STATE.lastIndex.clear();
}
