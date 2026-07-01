import { createSignal } from "solid-js";

import { GameFarkleOverlay } from "src/game/components/FarkleOverlay";
import { GameOverOverlay } from "src/game/components/GameOverOverlay";
import { GameVictoryOverlay } from "src/game/components/VictoryOverlay";
import { GameTurnAnnouncementOverlay } from "src/game/components/TurnAnnouncementOverlay";
import { UiButton } from "src/ui/Button";
import { UiPlaceholder } from "src/ui/Placeholder";

const PLAYERS = new Map([
  ["p1", { name: "Henry" }],
  ["p2", { name: "Radzig" }],
]);

const TURN_ORDER = ["p1", "p2"] as const;

type TurnPlayerId = (typeof TURN_ORDER)[number];

export function TestOverlays() {
  const [farkleOpen, setFarkleOpen] = createSignal(false);
  const [gameOverOpen, setGameOverOpen] = createSignal(false);
  const [victoryOpen, setVictoryOpen] = createSignal(false);
  const [turnOpen, setTurnOpen] = createSignal(false);
  const [turnPlayerId, setTurnPlayerId] = createSignal<TurnPlayerId>(TURN_ORDER[0]);

  const showTurn = () => {
    setTurnPlayerId((current) => (current === "p1" ? "p2" : "p1"));
    setTurnOpen(true);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          "flex-wrap": "wrap",
          "align-items": "center",
          gap: "12px",
        }}
      >
        <UiButton
          label="Farkle"
          actionId="test.overlays.farkle"
          code="Digit1"
          onClick={() => setFarkleOpen(true)}
        />
        <UiPlaceholder />
        <UiButton
          label="Game Over"
          actionId="test.overlays.gameOver"
          code="Digit2"
          onClick={() => setGameOverOpen(true)}
        />
        <UiPlaceholder />
        <UiButton
          label="Victory"
          actionId="test.overlays.victory"
          code="Digit3"
          onClick={() => setVictoryOpen(true)}
        />
        <UiPlaceholder />
        <UiButton
          label="Turn Announcement"
          actionId="test.overlays.turn"
          code="Digit4"
          onClick={() => showTurn()}
        />
      </div>
      <GameFarkleOverlay
        myTurn={true}
        open={farkleOpen()}
        onClose={() => setFarkleOpen(false)}
      />
      <GameOverOverlay
        open={gameOverOpen()}
        onClose={() => setGameOverOpen(false)}
      />
      <GameVictoryOverlay
        open={victoryOpen()}
        onClose={() => setVictoryOpen(false)}
      />
      <GameTurnAnnouncementOverlay
        open={turnOpen()}
        playerName={PLAYERS.get(turnPlayerId())?.name}
        onClose={() => setTurnOpen(false)}
      />
    </>
  );
}
