import { audioUnlock } from "src/audio";
import { setSceneState } from "src/state/test";

export function StartScreen() {
  return (
    <div class="start-screen">
      <button
        type="button"
        class="start-button"
        onClick={onStart}
      >
        Start testing
      </button>
    </div>
  );
}

function onStart(): void {
  audioUnlock();
  setSceneState("started", true);
}
