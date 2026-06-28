import { BoxGeometry, Color, Mesh, MeshStandardNodeMaterial } from "three/webgpu";
import { createEffect, createRoot } from "solid-js";

import { sceneState, setSceneState } from "src/state/test";

interface Results {
  mesh: Mesh;
  update: (delta: number) => void;
  dispose: () => void;
}

export function renderBoxCreate(): Results {
  const geometry = new BoxGeometry(1.4, 1.4, 1.4);
  const material = new MeshStandardNodeMaterial({
    color: new Color(sceneState.color),
    metalness: 0.3,
    roughness: 0.35,
    wireframe: sceneState.wireframe,
  });
  const mesh = new Mesh(geometry, material);

  const disposeRoot = createRoot((dispose) => {
    createEffect(() => {
      material.color.set(sceneState.color);
      material.wireframe = sceneState.wireframe;
    });
    return dispose;
  });

  const update = (delta: number): void => {
    if (!sceneState.autoRotate) {
      return;
    }
    mesh.rotation.y += sceneState.rotationSpeed * delta;
    mesh.rotation.x += sceneState.rotationSpeed * delta * 0.35;
    setSceneState("rotationY", mesh.rotation.y);
  };

  const dispose = (): void => {
    disposeRoot();
    geometry.dispose();
    material.dispose();
  };

  return {
    mesh,
    update,
    dispose,
  };
}
