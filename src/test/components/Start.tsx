import { audioUnlock } from "src/audio";
import { testStateSet } from "src/test/helpers/state";
import styles from "src/test/components/Start.module.css";

export function TestStart() {
  return (
    <div class={styles["start-screen"]}>
      <button
        type="button"
        class={styles["start-button"]}
        onClick={onStart}
      >
        Start testing
      </button>
    </div>
  );
}

function onStart(): void {
  audioUnlock();
  testStateSet("started", true);
}
