import { loopSetTargetFps } from "src/loop";
import { sceneState, setSceneState } from "src/state/test";
import { InteractionsDemo } from "src/components/InteractionsDemo";

export function Controls() {
  return (
    <aside class="controls">
      <h1 class="controls-title">
        Shared store demo
      </h1>
      <p class="controls-hint">
        Solid.js UI and three.js WebGPU, one store.
      </p>
      <button
        type="button"
        class="control-button"
        disabled={sceneState.started}
        onClick={() => setSceneState("started", true)}
      >
        {sceneState.loaded ? "Running" : sceneState.started ? "Loading…" : "Load scene"}
      </button>
      <label class="control">
        <span class="control-label">
          Target FPS
        </span>
        <select
          value={sceneState.targetFps}
          onInput={(event) => {
            const targetFps = parseInt(event.currentTarget.value, 10);
            setSceneState("targetFps", targetFps);
            loopSetTargetFps(targetFps);
          }}
        >
          <option value="30">30</option>
          <option value="60">60</option>
          <option value="120">120</option>
          <option value="144">144</option>
        </select>
      </label>
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
      <label class="control control-row">
        <span class="control-label">
          WebGPU inspector
        </span>
        <input
          type="checkbox"
          disabled={!sceneState.loaded}
          checked={sceneState.inspectorEnabled}
          onChange={(event) => setSceneState("inspectorEnabled", event.currentTarget.checked)}
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
      <InteractionsDemo />
    </aside>
  );
}
