import { loopSetTargetFps } from "src/loop";
import { audioSetMuted, audioSetVolume, audioSfxPlay, audioUiPlay } from "src/audio";
import { audioState } from "src/audio/state";
import { testState, testStateSet } from "src/test/helpers/state";
import styles from "src/test/components/Controls.module.css";

const DICE_RATE_MIN = 0.9;

const DICE_RATE_SPREAD = 0.2;

export function TestControls() {
  return (
    <aside class={styles.controls}>
      <h1 class={styles["controls-title"]}>
        Shared store demo
      </h1>
      <p class={styles["controls-hint"]}>
        Solid.js UI and three.js WebGPU, one store.
      </p>
      <label class={styles.control}>
        <span class="control-label">
          Target FPS
        </span>
        <select
          value={testState.targetFps}
          onInput={(event) => {
            const targetFps = parseInt(event.currentTarget.value, 10);
            testStateSet("targetFps", targetFps);
            loopSetTargetFps(targetFps);
          }}
        >
          <option value="30">30</option>
          <option value="60">60</option>
          <option value="120">120</option>
          <option value="144">144</option>
        </select>
      </label>
      <label class={styles.control}>
        <span class="control-label">
          Rotation speed
          <output class={styles["control-value"]}>
            {testState.rotationSpeed.toFixed(2)}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="4"
          step="0.05"
          value={testState.rotationSpeed}
          onInput={(event) => testStateSet("rotationSpeed", event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={`${styles.control} ${styles["control-row"]}`}>
        <span class="control-label">
          Color
        </span>
        <input
          type="color"
          value={testState.color}
          onInput={(event) => testStateSet("color", event.currentTarget.value)}
        />
      </label>
      <label class={`${styles.control} ${styles["control-row"]}`}>
        <span class="control-label">
          Auto rotate
        </span>
        <input
          type="checkbox"
          checked={testState.autoRotate}
          onChange={(event) => testStateSet("autoRotate", event.currentTarget.checked)}
        />
      </label>
      <label class={`${styles.control} ${styles["control-row"]}`}>
        <span class="control-label">
          Wireframe
        </span>
        <input
          type="checkbox"
          checked={testState.wireframe}
          onChange={(event) => testStateSet("wireframe", event.currentTarget.checked)}
        />
      </label>
      <label class={`${styles.control} ${styles["control-row"]}`}>
        <span class="control-label">
          WebGPU inspector
        </span>
        <input
          type="checkbox"
          disabled={!testState.loaded}
          checked={testState.inspectorEnabled}
          onChange={(event) => testStateSet("inspectorEnabled", event.currentTarget.checked)}
        />
      </label>
      <dl class={styles.readouts}>
        <div class={styles.readout}>
          <dt>
            rotationY
          </dt>
          <dd>
            {testState.rotationY.toFixed(2)} rad
          </dd>
        </div>
        <div class={styles.readout}>
          <dt>
            fps
          </dt>
          <dd>
            {testState.fps}
          </dd>
        </div>
      </dl>
      <div class={styles["control-section"]}>
        <span class={styles["control-section-title"]}>
          Audio
        </span>
        <label class={styles.control}>
          <span class="control-label">
            Master volume
            <output class={styles["control-value"]}>
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
        <label class={styles.control}>
          <span class="control-label">
            SFX volume
            <output class={styles["control-value"]}>
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
        <label class={`${styles.control} ${styles["control-row"]}`}>
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
    </aside>
  );
}
