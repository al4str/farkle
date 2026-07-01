import { createStore } from "solid-js/store";

import { loopAddUpdate } from "src/loop/index";

interface State {
  startedAt: number;
  durationMs: number;
  progress: number;
  cb: null | (() => void);
}

const INITIAL_STATE: State = {
  startedAt: -1,
  durationMs: 0,
  progress: 0,
  cb: null,
};

const [state, setState] = createStore<State>(structuredClone(INITIAL_STATE));

export function loopTimerInitialize(): void {
  loopAddUpdate(loopTimerUpdate);
}

interface PublicState {
  isHidden: () => boolean;
  getProgress: () => number;
}

export function loopTimerGetState(): PublicState {
  return {
    isHidden: () => state.startedAt === -1,
    getProgress: () => state.progress,
  };
}

export function loopTimerSet(startedAt: number, durationMs: number, cb?: () => void): void {
  setState({
    startedAt: startedAt,
    durationMs: durationMs,
    progress: 0,
    cb: cb ?? null,
  });
}

export function loopTimerClear(): void {
  setState(structuredClone(INITIAL_STATE));
}

function loopTimerUpdate(): void {
  if (state.startedAt !== -1 && state.durationMs > 0) {
    const progress = (Date.now() - state.startedAt) / state.durationMs;
    setState("progress", Math.min(Math.max(0, progress), 1));
    if (progress >= 1) {
      if (typeof state.cb === "function") {
        state.cb();
      }
      setState(structuredClone(INITIAL_STATE));
    }
  }
}
