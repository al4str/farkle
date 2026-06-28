import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";

import type { AudioVolumes } from "src/audio/types";
import { clamp } from "src/utils/clamp";

const STORAGE_KEY = "farkle.audio";

const INITIAL_STATE: AudioVolumes = {
  master: 0.25,
  ui: 1,
  sfx: 1,
  music: 0.6,
  muted: false,
};

export const [audioState, audioStateSet] = loadStore();

type AudioStore = [
  state: AudioVolumes,
  setState: SetStoreFunction<AudioVolumes>,
];

export function audioStatePersist(volumes: AudioVolumes): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(volumes));
  }
  catch {
    // localStorage may be unavailable or full; persistence is best-effort.
  }
}

function loadStore(): AudioStore {
  const data = import.meta.hot?.data;
  if (data && isStore(data.store)) {
    return data.store;
  }
  const created = createStore<AudioVolumes>(hydrate());
  if (data) {
    data.store = created;
  }
  return created;
}

function hydrate(): AudioVolumes {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return INITIAL_STATE;
    }
    const parsed: unknown = JSON.parse(raw);
    return fromUnknown(parsed);
  }
  catch {
    return INITIAL_STATE;
  }
}

function fromUnknown(value: unknown): AudioVolumes {
  if (!isRecord(value)) {
    return INITIAL_STATE;
  }
  return {
    master: volumeOr(value["master"], INITIAL_STATE.master),
    ui: volumeOr(value["ui"], INITIAL_STATE.ui),
    sfx: volumeOr(value["sfx"], INITIAL_STATE.sfx),
    music: volumeOr(value["music"], INITIAL_STATE.music),
    muted: typeof value["muted"] === "boolean" ? value["muted"] : INITIAL_STATE.muted,
  };
}

function volumeOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? clamp(value, 0, 1)
    : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStore(value: unknown): value is AudioStore {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "object" && value[0] !== null && typeof value[1] === "function";
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
