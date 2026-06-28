import { loopSetTargetFps } from "src/loop";
import { audioSetMuted, audioSetVolume, audioSfxPlay, audioUiPlay } from "src/audio";
import { audioState } from "src/audio/state";
import { sceneState, setSceneState } from "src/state/test";
import { InteractionsDemo } from "src/components/InteractionsDemo";

const DICE_RATE_MIN = 0.9;

const DICE_RATE_SPREAD = 0.2;

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
      <div class="control-section">
        <span class="control-section-title">
          Audio
        </span>
        <label class="control">
          <span class="control-label">
            Master volume
            <output class="control-value">
              {Math.round(audioState.master * 100)}%
            </output>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.master}
            onInput={(event) => audioSetVolume("master", event.currentTarget.valueAsNumber)}
          />
        </label>
        <label class="control">
          <span class="control-label">
            SFX volume
            <output class="control-value">
              {Math.round(audioState.sfx * 100)}%
            </output>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.sfx}
            onInput={(event) => audioSetVolume("sfx", event.currentTarget.valueAsNumber)}
          />
        </label>
        <label class="control control-row">
          <span class="control-label">
            Mute
          </span>
          <input
            type="checkbox"
            checked={audioState.muted}
            onChange={(event) => audioSetMuted(event.currentTarget.checked)}
          />
        </label>
        <div class="demo-grid">
          <button
            type="button"
            class="control-button"
            onClick={() => audioUiPlay("ui_click")}
          >
            UI click
          </button>
          <button
            type="button"
            class="control-button"
            onClick={() => audioSfxPlay("dice_hit", { rate: DICE_RATE_MIN + Math.random() * DICE_RATE_SPREAD })}
          >
            Dice hit
          </button>
        </div>
      </div>
      <InteractionsDemo />
    </aside>
  );
}
