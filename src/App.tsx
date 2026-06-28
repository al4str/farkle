import { Show } from "solid-js";

import { sceneState } from "src/state/test";
import { Controls } from "src/components/Controls";
import { SceneCanvas } from "src/components/SceneCanvas";
import { StartScreen } from "src/components/StartScreen";

export function App() {
  return (
    <Show when={sceneState.started} fallback={<StartScreen />}>
      <SceneCanvas />
      <Controls />
    </Show>
  );
}
