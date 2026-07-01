import { Show } from "solid-js";

import { testState } from "src/test/helpers/state";
import { TestControls } from "src/test/components/Canvas/Controls";
import { TestCanvas } from "src/test/components/Canvas/Canvas";
import { TestStart } from "src/test/components/Canvas/Start";

export function TestPageCanvas() {
  return (
    <Show
      when={testState.started}
      fallback={(
        <TestStart />
      )}
    >
      <TestCanvas />
      <TestControls />
    </Show>
  );
}

export default TestPageCanvas;
