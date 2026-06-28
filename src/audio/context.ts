import type { AudioBus } from "src/audio/types";

const GAIN_RAMP = 0.015;

type AudioContextConstructor = new () => AudioContext;

interface ContextState {
  ctx: null | AudioContext;
  master: null | GainNode;
  buses: null | Record<AudioBus, GainNode>;
  unlocked: boolean;
  sampleRate: number;
  visibilityAttached: boolean;
}

const STATE: ContextState = loadState();

export function audioContextEnsure(): null | AudioContext {
  if (STATE.ctx) {
    return STATE.ctx;
  }
  const Ctor = resolveContextConstructor();
  if (Ctor === undefined) {
    return null;
  }
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.connect(ctx.destination);
  const buses: Record<AudioBus, GainNode> = {
    ui: ctx.createGain(),
    sfx: ctx.createGain(),
    music: ctx.createGain(),
  };
  buses.ui.connect(master);
  buses.sfx.connect(master);
  buses.music.connect(master);

  STATE.ctx = ctx;
  STATE.master = master;
  STATE.buses = buses;
  STATE.sampleRate = ctx.sampleRate;

  ctx.addEventListener("statechange", onStateChange);
  attachVisibility();
  return ctx;
}

export async function audioContextResume(): Promise<void> {
  const ctx = STATE.ctx;
  if (!ctx || ctx.state === "running") {
    return;
  }
  try {
    await ctx.resume();
  }
  catch {
    // Resume can reject if not triggered by a gesture; retried on next gesture.
  }
}

export function audioContextBus(bus: AudioBus): null | GainNode {
  return STATE.buses === null ? null : STATE.buses[bus];
}

export function audioContextMaster(): null | GainNode {
  return STATE.master;
}

export function audioContextSetGain(node: GainNode, value: number): void {
  const ctx = STATE.ctx;
  if (!ctx) {
    node.gain.value = value;
    return;
  }
  node.gain.setTargetAtTime(value, ctx.currentTime, GAIN_RAMP);
}

export function audioContextIsRunning(): boolean {
  return STATE.ctx !== null && STATE.ctx.state === "running";
}

export function audioContextUnlocked(): boolean {
  return STATE.unlocked;
}

export function audioContextMarkUnlocked(): void {
  STATE.unlocked = true;
}

export function audioContextDispose(): void {
  if (STATE.visibilityAttached) {
    window.document.removeEventListener("visibilitychange", onVisibility);
    STATE.visibilityAttached = false;
  }
  const ctx = STATE.ctx;
  if (ctx) {
    ctx.removeEventListener("statechange", onStateChange);
    void ctx.close();
  }
  STATE.ctx = null;
  STATE.master = null;
  STATE.buses = null;
  STATE.unlocked = false;
  STATE.sampleRate = 0;
}

function attachVisibility(): void {
  if (STATE.visibilityAttached) {
    return;
  }
  STATE.visibilityAttached = true;
  window.document.addEventListener("visibilitychange", onVisibility);
}

function onVisibility(): void {
  const ctx = STATE.ctx;
  if (!ctx) {
    return;
  }
  if (window.document.visibilityState === "hidden") {
    void ctx.suspend();
  }
  else {
    void audioContextResume();
  }
}

function onStateChange(): void {
  const ctx = STATE.ctx;
  if (!ctx) {
    return;
  }
  // Recover from suspended/interrupted (iOS after call/Siri) when visible.
  if (ctx.state !== "running" && window.document.visibilityState === "visible") {
    void audioContextResume();
  }
}

function resolveContextConstructor(): undefined | AudioContextConstructor {
  if (typeof AudioContext !== "undefined") {
    return AudioContext;
  }
  const prefixed = windowProp("webkitAudioContext");
  return typeof prefixed === "function" ? asContextConstructor(prefixed) : undefined;
}

function loadState(): ContextState {
  const data = import.meta.hot?.data;
  if (data && isContextState(data.audioContextState)) {
    return data.audioContextState;
  }
  const created: ContextState = {
    ctx: null,
    master: null,
    buses: null,
    unlocked: false,
    sampleRate: 0,
    visibilityAttached: false,
  };
  if (data) {
    data.audioContextState = created;
  }
  return created;
}

function isContextState(value: unknown): value is ContextState {
  return typeof value === "object" && value !== null && "ctx" in value && "unlocked" in value;
}

function windowProp(key: string): unknown {
  return asRecord(window)[key];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function asContextConstructor(value: unknown): AudioContextConstructor {
  return value as AudioContextConstructor;
}
