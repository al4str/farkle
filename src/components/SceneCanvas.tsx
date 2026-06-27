import { onCleanup, onMount } from "solid-js";

import { mountScene } from "src/three/scene";

export function SceneCanvas() {
  let element: undefined | HTMLCanvasElement = undefined;

  onMount(() => {
    if (!element) {
      return;
    }
    onCleanup(mountScene(element));
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
