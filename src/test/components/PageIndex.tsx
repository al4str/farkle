import { Show } from "solid-js";

import { testState } from "src/test/helpers/state";
import { TestControls } from "src/test/components/Controls";
import { TestCanvas } from "src/test/components/Canvas";
import { TestStart } from "src/test/components/Start";

export function TestPage() {
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

export default TestPage;
