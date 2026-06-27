import { AmbientLight, BoxGeometry, Color, DirectionalLight, Mesh, PerspectiveCamera, Scene, MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
import { createEffect, createRoot } from "solid-js";

import { sceneState, setSceneState } from "src/store/scene";

export type SceneHandle = {
  dispose: () => void;
};

const noop = (): void => {};

export async function createScene(canvas: HTMLCanvasElement): Promise<SceneHandle> {
  const renderer = new WebGPURenderer({ canvas, antialias: true });
  await renderer.init();
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));

  const scene = new Scene();
  scene.background = new Color("#16171d");

  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(2.2, 1.8, 3);
  camera.lookAt(0, 0, 0);

  const ambient = new AmbientLight(0xffffff, 0.6);
  const key = new DirectionalLight(0xffffff, 2.5);
  key.position.set(3, 4, 2);
  scene.add(ambient, key);

  const geometry = new BoxGeometry(1.4, 1.4, 1.4);
  const material = new MeshStandardNodeMaterial({
    color: new Color(sceneState.color),
    metalness: 0.3,
    roughness: 0.35,
    wireframe: sceneState.wireframe,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  let disposeRoot: () => void = noop;
  createRoot((dispose) => {
    disposeRoot = dispose;
    createEffect(() => {
      material.color.set(sceneState.color);
      material.wireframe = sceneState.wireframe;
    });
  });

  const resize = (): void => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let lastTime = 0;
  let frame = 0;
  void renderer.setAnimationLoop((time) => {
    const delta = lastTime === 0 ? 0 : (time - lastTime) / 1000;
    lastTime = time;

    if (sceneState.autoRotate) {
      mesh.rotation.y += sceneState.rotationSpeed * delta;
      mesh.rotation.x += sceneState.rotationSpeed * delta * 0.35;
      setSceneState("rotationY", mesh.rotation.y);
    }

    frame += 1;
    if (frame % 10 === 0 && delta > 0) {
      setSceneState("fps", Math.round(1 / delta));
    }

    renderer.render(scene, camera);
  });

  return {
    dispose: (): void => {
      disposeRoot();
      void renderer.setAnimationLoop(null);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

type LiveScene = {
  canvas: HTMLCanvasElement | null;
  handle: SceneHandle | null;
  disposed: boolean;
};

const live: LiveScene = {
  canvas: null,
  handle: null,
  disposed: false,
};

function attach(factory: (canvas: HTMLCanvasElement) => Promise<SceneHandle>, canvas: HTMLCanvasElement): void {
  void factory(canvas).then((handle) => {
    if (live.disposed || live.canvas !== canvas) {
      handle.dispose();
      return;
    }
    live.handle = handle;
    return;
  });
}

export function mountScene(canvas: HTMLCanvasElement): () => void {
  live.canvas = canvas;
  live.disposed = false;
  attach(createScene, canvas);

  return () => {
    live.disposed = true;
    live.handle?.dispose();
    live.handle = null;
    live.canvas = null;
  };
}

function isSceneModule(mod: unknown): mod is { createScene: (canvas: HTMLCanvasElement) => Promise<SceneHandle> } {
  return (
    typeof mod === "object" &&
    mod !== null &&
    "createScene" in mod &&
    typeof (mod as Record<string, unknown>)["createScene"] === "function"
  );
}

if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    const canvas = live.canvas;
    if (!isSceneModule(mod) || !canvas) {
      return;
    }
    live.handle?.dispose();
    live.handle = null;
    attach(mod.createScene, canvas);
  });
}
