import { PerspectiveCamera } from "three/webgpu";

export function renderCameraCreate(): PerspectiveCamera {
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(2.2, 1.8, 3);
  camera.lookAt(0, 0, 0);
  return camera;
}

export function renderCameraResize(camera: PerspectiveCamera, width: number, height: number): void {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
