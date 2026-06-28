import { createEffect, onCleanup } from "solid-js";

import { sceneState } from "src/state/test";

export function SceneCanvas() {
  let element: undefined | HTMLCanvasElement = undefined;
  let dispose: undefined | (() => void) = undefined;

  createEffect(() => {
    if (!sceneState.started || !element || dispose) {
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
