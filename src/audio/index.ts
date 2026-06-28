import { createEffect, createRoot } from "solid-js";

import type { AudioBus, AudioHandle, AudioPlayOptions, AudioSoundDef } from "src/audio/types";
import type { AudioSoundId } from "src/audio/catalog";
import { audioCatalogGet, audioCatalogIds } from "src/audio/catalog";
import { audioContextBus, audioContextDispose, audioContextEnsure, audioContextMarkUnlocked, audioContextMaster, audioContextResume, audioContextSetGain, audioContextUnlocked } from "src/audio/context";
import { audioState, audioStatePersist, audioStateSet } from "src/audio/state";
import { audioBuffersClear, audioBuffersGet, audioBuffersLoad } from "src/audio/buffers";
import { audioPoolsPick } from "src/audio/pools";
import { audioVoicesPlay, audioVoicesStopAll } from "src/audio/voices";
import { clamp } from "src/utils/clamp";
import { noop } from "src/utils/noop";

export const AUDIO_DEFAULTS = {
  maxVoicesPerSound: 6,
};

const NOOP_HANDLE: AudioHandle = {
  stop: noop,
};

interface State {
  initialized: boolean;
  disposeEffects: null | (() => void);
}

const STATE: State = {
  initialized: false,
  disposeEffects: null,
};

export function audioInitialize(): () => void {
  if (STATE.initialized) {
    return audioDispose;
  }
  STATE.initialized = true;

  STATE.disposeEffects = createRoot((dispose) => {
    createEffect(applyVolumes);
    return dispose;
  });

  return audioDispose;
}

export function audioDispose(): void {
  if (STATE.disposeEffects) {
    STATE.disposeEffects();
    STATE.disposeEffects = null;
  }
  audioVoicesStopAll();
  STATE.initialized = false;
}

export function audioDestroy(): void {
  audioDispose();
  audioVoicesStopAll();
  audioBuffersClear();
  audioContextDispose();
}

export function audioPlay(id: AudioSoundId, options?: AudioPlayOptions): AudioHandle {
  return play(id, options);
}

export function audioSfxPlay(id: AudioSoundId, options?: AudioPlayOptions): AudioHandle {
  return play(id, options);
}

export function audioUiPlay(id: AudioSoundId, options?: AudioPlayOptions): AudioHandle {
  return play(id, withBus(options, "ui"));
}

export async function audioPreload(ids: readonly AudioSoundId[]): Promise<void> {
  const bases = new Set<string>();
  for (const id of ids) {
    for (const base of audioCatalogGet(id).variants) {
      bases.add(base);
    }
  }
  await Promise.all(
    Array.from(bases, (base) => audioBuffersLoad(base).then(() => undefined).catch(() => undefined)),
  );
}

export function audioSetVolume(bus: "master" | AudioBus, value: number): void {
  audioStateSet(bus, clamp(value, 0, 1));
}

export function audioSetMuted(muted: boolean): void {
  audioStateSet("muted", muted);
}

export function audioIsUnlocked(): boolean {
  return audioContextUnlocked();
}

export function audioUnlock(): void {
  performUnlock();
}

function performUnlock(): void {
  const ctx = audioContextEnsure();
  if (!ctx) {
    return;
  }
  void audioContextResume();
  playSilent(ctx);
  audioContextMarkUnlocked();
  applyVolumes();
  void audioPreload(preloadIds());
}

function playSilent(ctx: AudioContext): void {
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}

function play(id: AudioSoundId, options?: AudioPlayOptions): AudioHandle {
  const ctx = audioContextEnsure();
  if (!ctx) {
    return NOOP_HANDLE;
  }
  if (!audioContextUnlocked()) {
    void audioContextResume();
  }
  const def = audioCatalogGet(id);
  const bus = audioContextBus(options?.bus ?? def.bus);
  if (!bus || def.variants.length === 0) {
    return NOOP_HANDLE;
  }
  const index = audioPoolsPick(id, def.variants.length);
  const base = def.variants[index];
  if (base === undefined) {
    return NOOP_HANDLE;
  }
  const buffer = audioBuffersGet(base);
  if (buffer === undefined) {
    void audioBuffersLoad(base)
      .then((loaded) => {
        spawn(id, loaded, bus, ctx, def, options);
        return;
      })
      .catch(() => undefined);
    return NOOP_HANDLE;
  }
  return spawn(id, buffer, bus, ctx, def, options);
}

function spawn(id: AudioSoundId, buffer: AudioBuffer, bus: GainNode, ctx: AudioContext, def: AudioSoundDef, options?: AudioPlayOptions): AudioHandle {
  const gain = clamp((def.volume ?? 1) * (options?.volume ?? 1), 0, 1);
  const rate = options?.rate ?? 1;
  const maxVoices = def.maxVoices ?? AUDIO_DEFAULTS.maxVoicesPerSound;
  return audioVoicesPlay({ id, buffer, bus, ctx, gain, rate, maxVoices });
}

function applyVolumes(): void {
  const master = audioContextMaster();
  if (master) {
    audioContextSetGain(master, audioState.muted ? 0 : clamp(audioState.master, 0, 1));
  }
  applyBus("ui", audioState.ui);
  applyBus("sfx", audioState.sfx);
  applyBus("music", audioState.music);
  audioStatePersist({
    master: audioState.master,
    ui: audioState.ui,
    sfx: audioState.sfx,
    music: audioState.music,
    muted: audioState.muted,
  });
}

function applyBus(bus: AudioBus, value: number): void {
  const node = audioContextBus(bus);
  if (node) {
    audioContextSetGain(node, clamp(value, 0, 1));
  }
}

function withBus(options: undefined | AudioPlayOptions, bus: AudioBus): AudioPlayOptions {
  return { ...options, bus };
}

function preloadIds(): readonly AudioSoundId[] {
  return audioCatalogIds().filter((id) => audioCatalogGet(id).preload === true);
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    audioDispose();
  });
}
