import { createEffect, createRoot } from "solid-js";

import type { LoopUpdateCallback } from "src/loop";
import { loopAddUpdate, loopGetFps, loopRemoveUpdate } from "src/loop";
import { sceneState, setSceneState } from "src/state/test";
import { renderBoxCreate } from "src/render/box";
import { renderCameraCreate, renderCameraResize } from "src/render/camera";
import { renderInspectorAttach } from "src/render/inspector";
import { renderLightsCreate } from "src/render/lights";
import { renderRendererCreate } from "src/render/renderer";
import { renderSceneCreate } from "src/render/scene";
import { noop } from "src/utils/noop";

interface State {
  canvas: null | HTMLCanvasElement;
  boot: null | BootResults;
  disposed: boolean;
}

const STATE: State = {
  canvas: null,
  boot: null,
  disposed: false,
};

export function renderInitialize(canvas: HTMLCanvasElement): () => void {
  STATE.canvas = canvas;
  STATE.disposed = false;
  executeBootFunction(boot, canvas);

  return () => {
    STATE.disposed = true;
    STATE.boot?.dispose();
    STATE.boot = null;
    STATE.canvas = null;
    setSceneState("loaded", false);
  };
}

type BootFunction = (canvas: HTMLCanvasElement) => Promise<BootResults>;

interface BootResults {
  dispose: () => void;
}

async function boot(canvas: HTMLCanvasElement): Promise<BootResults> {
  const renderer = await renderRendererCreate(canvas);
  const scene = renderSceneCreate();
  const camera = renderCameraCreate();
  scene.add(...renderLightsCreate());

  const box = renderBoxCreate();
  scene.add(box.mesh);

  let detachInspector: () => void = noop;
  let inspectorToken = 0;
  const disposeRoot = createRoot((dispose) => {
    createEffect(() => {
      const token = ++inspectorToken;
      if (sceneState.inspectorEnabled) {
        void renderInspectorAttach(renderer).then((detach) => {
          if (token !== inspectorToken) {
            detach();
            return;
          }
          detachInspector = detach;
          return;
        });
      }
      else {
        detachInspector();
        detachInspector = noop;
      }
    });
    return dispose;
  });

  const resize = (): void => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    renderCameraResize(camera, width, height);
    renderer.setSize(width, height, false);
  };
  resize();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let frame = 0;
  const update: LoopUpdateCallback = (delta) => {
    box.update(delta);

    frame += 1;
    if (frame % 10 === 0) {
      setSceneState("fps", loopGetFps());
    }

    renderer.render(scene, camera);
    if (sceneState.inspectorEnabled) {
      void renderer.resolveTimestampsAsync();
    }
  };
  loopAddUpdate(update);

  return {
    dispose: (): void => {
      disposeRoot();
      detachInspector();
      detachInspector = noop;
      loopRemoveUpdate(update);
      observer.disconnect();
      box.dispose();
      renderer.dispose();
    },
  };
}

function executeBootFunction(bootFunction: BootFunction, canvas: HTMLCanvasElement): void {
  void bootFunction(canvas).then((handle) => {
    if (STATE.disposed || STATE.canvas !== canvas) {
      handle.dispose();
      return;
    }
    STATE.boot = handle;
    setSceneState("loaded", true);
    return;
  });
}

function isBootModule(module: unknown): module is { boot: BootFunction } {
  return typeof module === "object" && module !== null && "boot" in module && typeof module.boot === "function";
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    const canvas = STATE.canvas;
    if (!isBootModule(module) || !canvas) {
      return;
    }
    STATE.boot?.dispose();
    STATE.boot = null;
    executeBootFunction(module.boot, canvas);
  });
}
