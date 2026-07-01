import { createEffect, onCleanup } from "solid-js";

import { testState } from "src/test/helpers/state";

export function TestCanvas() {
  let element: undefined | HTMLCanvasElement = undefined;
  let dispose: undefined | (() => void) = undefined;

  createEffect(() => {
    if (!testState.started || !element || dispose) {
      return;
    }
    const canvas = element;
    void import("src/render").then((module) => {
      dispose = module.renderInitialize(canvas);
      return;
    });
  });

  onCleanup(() => {
    dispose?.();
  });

  return (
    <canvas
      ref={(node) => {
        element = node;
      }}
      class="scene-canvas"
    />
  );
}
