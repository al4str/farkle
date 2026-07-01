import type { JSX } from "solid-js";

import { TestAssetsLoading } from "src/test/components/AssetsLoading";
import { TestGamePlayersScore } from "src/test/components/GamePlayersScore";
import { TestGameTimer } from "src/test/components/GameTimer";
import { TestTypography } from "src/test/components/Typography";
import { TestAudio } from "src/test/components/Audio/Audio";
import { TestInteractions } from "src/test/components/Interactions/Interactions";
import { TestOverlays } from "src/test/components/Overlays";

function Fold(props: { title: string; children: JSX.Element }) {
  return (
    <details
      style={{
        border: "1px solid var(--border, #333)",
        "border-radius": "8px",
        padding: "0 16px",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          padding: "16px 0",
          "font-weight": 700,
          "user-select": "none",
        }}
      >
        {props.title}
      </summary>
      <div style={{ padding: "16px 0 24px" }}>{props.children}</div>
    </details>
  );
}

export function KitchenSink() {
  return (
    <section
      style={{
        "max-width": "1024px",
        margin: "0 auto",
        padding: "48px 24px 128px",
        display: "flex",
        "flex-direction": "column",
        gap: "16px",
      }}
    >
      <Fold title="Typography">
        <TestTypography />
      </Fold>
      <Fold title="Assets Loading">
        <TestAssetsLoading />
      </Fold>
      <Fold title="Game Timer">
        <TestGameTimer />
      </Fold>
      <Fold title="Game Players Score">
        <TestGamePlayersScore />
      </Fold>
      <Fold title="Interactions">
        <TestInteractions />
      </Fold>
      <Fold title="Overlays">
        <TestOverlays />
      </Fold>
      <Fold title="Audio">
        <TestAudio />
      </Fold>
    </section>
  );
}

export default KitchenSink;
