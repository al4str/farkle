export type LoopUpdateCallback = (delta: number, elapsed: number) => void;

const MAX_DELTA = 0.1;

const FPS_SMOOTHING = 0.1;

const STATE = {
  initialized: false,
  running: false,
  id: 0,
  lastFrameTime: 0,
  startTime: 0,
  targetInterval: 1000 / 60,
  smoothedDelta: 0,
  updateCallbacks: new Set<LoopUpdateCallback>(),
};

export function loopInitialize(): void {
  if (STATE.initialized) {
    return;
  }
  STATE.initialized = true;
  window.document.addEventListener("visibilitychange", loopCheckVisibility);
  loopCheckVisibility();
}

export function loopAddUpdate(cb: LoopUpdateCallback): void {
  STATE.updateCallbacks.add(cb);
}

export function loopRemoveUpdate(cb: LoopUpdateCallback): void {
  STATE.updateCallbacks.delete(cb);
}

export function loopSetTargetFps(targetFps: number): void {
  if (Number.isNaN(targetFps) || targetFps <= 0) {
    STATE.targetInterval = 0;
  }
  else {
    STATE.targetInterval = 1000 / targetFps;
  }
}

export function loopGetFps(): number {
  return STATE.smoothedDelta > 0 ? Math.round(1 / STATE.smoothedDelta) : 0;
}

function loopStart(): void {
  loopStop();
  STATE.running = true;
  STATE.lastFrameTime = 0;
  STATE.startTime = 0;
  STATE.smoothedDelta = 0;
  STATE.id = window.requestAnimationFrame(loopTick);
}

function loopStop(): void {
  STATE.running = false;
  window.cancelAnimationFrame(STATE.id);
  STATE.id = 0;
}

function loopTick(time: number): void {
  STATE.id = window.requestAnimationFrame(loopTick);
  if (STATE.targetInterval > 0 && STATE.lastFrameTime !== 0) {
    if (time - STATE.lastFrameTime < STATE.targetInterval - 1) {
      return;
    }
  }
  const delta = STATE.lastFrameTime === 0
    ? 0
    : Math.min((time - STATE.lastFrameTime) / 1000, MAX_DELTA);
  if (delta > 0) {
    STATE.smoothedDelta = STATE.smoothedDelta === 0
      ? delta
      : STATE.smoothedDelta + (delta - STATE.smoothedDelta) * FPS_SMOOTHING;
  }
  if (STATE.startTime === 0) {
    STATE.startTime = time;
  }
  STATE.lastFrameTime = time;
  const elapsed = (time - STATE.startTime) / 1000;
  for (const cb of STATE.updateCallbacks) {
    cb(delta, elapsed);
  }
}

function loopCheckVisibility(): void {
  if (window.document.visibilityState === "visible") {
    loopStart();
  }
  else {
    loopStop();
  }
}
