import type { Light } from "three/webgpu";
import { Color, AmbientLight, DirectionalLight } from "three/webgpu";

export function renderLightsCreate(): Light[] {
  const ambient = new AmbientLight(new Color("#ffffff"), 0.6);
  const key = new DirectionalLight(new Color("#ffffff"), 2.5);
  key.position.set(3, 4, 2);
  return [ambient, key];
}
