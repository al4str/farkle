import { Color, Scene } from "three/webgpu";

export function renderSceneCreate(): Scene {
  const scene = new Scene();
  scene.background = new Color("#16171d");
  return scene;
}
