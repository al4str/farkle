import { WebGPURenderer } from "three/webgpu";

const MAX_PIXEL_RATIO = 2;

export async function renderRendererCreate(canvas: HTMLCanvasElement): Promise<WebGPURenderer> {
  const renderer = new WebGPURenderer({
    canvas,
    antialias: true,
    trackTimestamp: true,
  });
  await renderer.init();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  return renderer;
}
