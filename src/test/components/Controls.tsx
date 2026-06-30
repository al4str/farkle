import { loopSetTargetFps } from "src/loop";
import { testState, testStateSet } from "src/test/helpers/state";
import styles from "src/test/components/Controls.module.css";

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
    </aside>
  );
}
