import { createSignal } from "solid-js";

import { audioSfxPlay } from "src/audio";
import { loopTimerGetState, loopTimerSet, loopTimerClear } from "src/loop/timer";
import { GameTimer } from "src/game/components/Timer";
import { UiButton } from "src/ui/Button";

export function TestGameTimer() {
  const [getDurationMs, setDurationMs] = createSignal(5_000);
  const state = loopTimerGetState();
  const isTimerHidden = () => state.isHidden();

  const onStart = () => {
    loopTimerSet(Date.now(), getDurationMs(), () => audioSfxPlay("cling_whoosh_long"));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        <input
          disabled={!isTimerHidden()}
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={getDurationMs()}
          onInput={(event) => setDurationMs(event.currentTarget.valueAsNumber)}
        />
        <UiButton
          disabled={!isTimerHidden()}
          label="Start"
          actionId="test.gameTimer.start"
          code="KeyR"
          onClick={onStart}
        />
        <UiButton
          disabled={isTimerHidden()}
          label="Stop"
          actionId="test.gameTimer.stop"
          code="KeyT"
          onClick={loopTimerClear}
        />
      </div>
      <div
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          "pointer-events": "none",
        }}
      >
        <GameTimer
          style={{
            width: "100px",
            height: "100px",
          }}
        />
      </div>
    </>
  );
}
