import { TestTypography } from "src/lobby/components/TestTypography";
import { TestAssetsLoading } from "src/lobby/components/TestAssetsLoading";
import { TestGameTimer } from "src/lobby/components/TestGameTimer";
import { TestGamePlayersScore } from "src/lobby/components/TestGamePlayersScore";
import { UiSeparator } from "src/ui/Separator";

export function LobbyPage() {

  return (
    <section
      style={{
        "max-width": "1024px",
        margin: "0 auto",
        padding: "48px 24px 128px",
        display: "flex",
        "flex-direction": "column",
        gap: "48px",
      }}
    >
      <TestTypography />
      <UiSeparator style={{ "margin-inline": "auto" }} />
      <TestAssetsLoading />
      <UiSeparator style={{ "margin-inline": "auto" }} />
      <TestGameTimer />
      <UiSeparator style={{ "margin-inline": "auto" }} />
      <TestGamePlayersScore />
      <UiSeparator style={{ "margin-inline": "auto" }} />
    </section>
  );
}

export default LobbyPage;
