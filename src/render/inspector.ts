import type { WebGPURenderer } from "three/webgpu";
import { InspectorBase } from "three/webgpu";

export async function renderInspectorAttach(renderer: WebGPURenderer): Promise<() => void> {
  const { Inspector } = await import("three/examples/jsm/inspector/Inspector.js");
  const inspector = new Inspector();
  renderer.inspector = inspector;
  document.body.appendChild(inspector.domElement);

  return (): void => {
    inspector.domElement.remove();
    renderer.inspector = new InspectorBase();
  };
}
