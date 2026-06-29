import { BoxGeometry, Color, Mesh, MeshStandardNodeMaterial } from "three/webgpu";
import { createEffect, createRoot } from "solid-js";

import { testState, testStateSet } from "src/test/helpers/state";

interface Results {
  mesh: Mesh;
  update: (delta: number) => void;
  dispose: () => void;
}

export function renderBoxCreate(): Results {
  const geometry = new BoxGeometry(1.4, 1.4, 1.4);
  const material = new MeshStandardNodeMaterial({
    color: new Color(testState.color),
    metalness: 0.3,
    roughness: 0.35,
    wireframe: testState.wireframe,
  });
  const mesh = new Mesh(geometry, material);

  const disposeRoot = createRoot((dispose) => {
    createEffect(() => {
      material.color.set(testState.color);
      material.wireframe = testState.wireframe;
    });
    return dispose;
  });

  const update = (delta: number): void => {
    if (!testState.autoRotate) {
      return;
    }
    mesh.rotation.y += testState.rotationSpeed * delta;
    mesh.rotation.x += testState.rotationSpeed * delta * 0.35;
    testStateSet("rotationY", mesh.rotation.y);
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
