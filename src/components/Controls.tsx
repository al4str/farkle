import { sceneState, setSceneState } from "src/store/scene";

export function Controls() {
  return (
    <aside class="controls">
      <h1 class="controls-title">
        Shared store demo
      </h1>
      <p class="controls-hint">
        Solid.js UI and three.js WebGPU, one store.
      </p>
      <label class="control">
        <span class="control-label">
          Rotation speed
          <output class="control-value">
            {sceneState.rotationSpeed.toFixed(2)}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="4"
          step="0.05"
          value={sceneState.rotationSpeed}
          onInput={(event) => setSceneState("rotationSpeed", event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class="control control-row">
        <span class="control-label">
          Color
        </span>
        <input
          type="color"
          value={sceneState.color}
          onInput={(event) => setSceneState("color", event.currentTarget.value)}
        />
      </label>
      <label class="control control-row">
        <span class="control-label">
          Auto rotate
        </span>
        <input
          type="checkbox"
          checked={sceneState.autoRotate}
          onChange={(event) => setSceneState("autoRotate", event.currentTarget.checked)}
        />
      </label>
      <label class="control control-row">
        <span class="control-label">
          Wireframe
        </span>
        <input
          type="checkbox"
          checked={sceneState.wireframe}
          onChange={(event) => setSceneState("wireframe", event.currentTarget.checked)}
        />
      </label>
      <dl class="readouts">
        <div class="readout">
          <dt>
            rotationY
          </dt>
          <dd>
            {sceneState.rotationY.toFixed(2)} rad
          </dd>
        </div>
        <div class="readout">
          <dt>
            fps
          </dt>
          <dd>
            {sceneState.fps}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
