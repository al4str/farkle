import { Show } from "solid-js";

import { i18nTranslate } from "src/i18n/translation";
import { UiButton } from "src/ui/Button";
import { GamePlayersScore } from "src/game/components/PlayersScore";
import { GameFarkleOverlay } from "src/game/components/FarkleOverlay";
import { GameTurnAnnouncementOverlay } from "src/game/components/TurnAnnouncementOverlay";
import { GameOverOverlay } from "src/game/components/GameOverOverlay";
import { GameVictoryOverlay } from "src/game/components/VictoryOverlay";
import styles from "src/game/components/Turn/styles.module.css";

// --- Stubs: replace with real wiring ---
type PlayerId = string;

interface CorePlayerInGame {
  id: PlayerId;
  name: string;
}

interface ClientGameState {
  phase: "CREATED" | "WAITING" | "PLAYING" | "FINISHED";
  turnPlayerId: null | PlayerId;
  outcomePlayerId: null | PlayerId;
  outcomeReason: null | string;
  players: Map<PlayerId, CorePlayerInGame>;
  dice: Map<string, unknown>;
  syncing: boolean;
  rollFarkled: boolean;
  gameOver: boolean;
  canDecide: boolean;
  canRoll: boolean;
  canBank: boolean;
}

function usePlayerContextData(): { id: PlayerId } {
  return { id: "" };
}

function useNavSettingsIsShown(): () => void {
  return () => {};
}

function clientSfxPlay(_name: string): void {}

function clientActionsBankAndPass(): void {}

function clientActionsBankAndRoll(): void {}

function clientActionsGiveUp(): void {}

// Placeholder components — wire to real implementations later.
function GameScreenReaderAnnouncements() {
  return null;
}

function GameAccessibleGameSummary() {
  return null;
}

function GameEmoteOverlay() {
  return null;
}

function GameTutorialOverlay() {
  return null;
}

function GameEmotePicker() {
  return null;
}

interface GameActionProps {
  disabled: boolean;
}

function GameActionNavigation(_props: GameActionProps) {
  return null;
}

function GameActionRoll(_props: GameActionProps) {
  return null;
}

function GameActionDieToggle(_props: GameActionProps) {
  return null;
}
// --- End stubs ---

export interface GameTurnProps {
  state: ClientGameState;
}

export function GameTurn(props: GameTurnProps) {
  const currentPlayer = usePlayerContextData();
  const openSettings = useNavSettingsIsShown();

  const myTurn = () => currentPlayer.id === props.state.turnPlayerId;
  const disabled = () => props.state.syncing || props.state.rollFarkled || props.state.gameOver;
  const isSpectating = () => {
    return props.state.players.size > 0 && !props.state.players.has(currentPlayer.id);
  };

  return (
    <section
      class={styles.board}
      aria-label="Game board"
    >
      <GameScreenReaderAnnouncements />
      <GameAccessibleGameSummary />
      <GameEmoteOverlay />
      <GameTutorialOverlay />
      <Show
        when={
          props.state.phase !== "FINISHED" && !props.state.syncing
            ? props.state.turnPlayerId
            : null
        }
      >
        {(turnPlayerId) => (
          <GameTurnAnnouncementOverlay
            players={props.state.players}
            turnPlayerId={turnPlayerId()}
          />
        )}
      </Show>
      <Show when={isSpectating()}>
        <div class={styles.spectator}>
          <span class={styles.spectatingLabel}>
            {i18nTranslate("game.status.spectating")}
          </span>
          <GameEmotePicker />
          <UiButton
            actionId="game--settings"
            code="Tab"
            label={i18nTranslate("settings.label.title")}
            onClick={openSettings}
          />
          <UiButton
            holdable={true}
            actionId="game--quit"
            code="Escape"
            label={i18nTranslate("common.action.quit")}
            onClick={() => {
              window.location.reload();
            }}
          />
        </div>
      </Show>
      <Show when={!isSpectating()}>
        <div class={styles.actions}>
          <GameActionNavigation
            disabled={!myTurn() || disabled() || props.state.dice.size === 0 || !props.state.canDecide}
          />
          <GameActionRoll
            disabled={!myTurn() || disabled() || !props.state.canRoll}
          />
          <GameActionDieToggle
            disabled={!myTurn() || disabled() || props.state.dice.size === 0 || !props.state.canDecide}
          />
          <UiButton
            disabled={!myTurn() || disabled() || !props.state.canDecide || !props.state.canBank}
            holdable={true}
            actionId="game--bank-and-roll"
            code="KeyF"
            label={i18nTranslate("game.action.score_and_continue")}
            onClick={() => {
              clientSfxPlay("ui_click");
              clientActionsBankAndRoll();
            }}
          />
          <UiButton
            disabled={!myTurn() || disabled() || !props.state.canDecide || !props.state.canBank}
            holdable={true}
            actionId="game--bank-and-pass"
            code="KeyQ"
            label={i18nTranslate("game.action.pass")}
            onClick={() => {
              clientSfxPlay("ui_click");
              clientActionsBankAndPass();
            }}
          />
          <GameEmotePicker />
          <UiButton
            actionId="game--settings"
            code="Tab"
            label={i18nTranslate("settings.label.title")}
            onClick={openSettings}
          />
          <UiButton
            disabled={props.state.gameOver || props.state.rollFarkled}
            holdable={true}
            actionId="game--give-up"
            code="Escape"
            label={i18nTranslate("game.action.give_up")}
            onClick={() => {
              clientSfxPlay("ui_click");
              clientActionsGiveUp();
              window.location.reload();
            }}
          />
        </div>
      </Show>
      <GamePlayersScore class={styles.playersScore} />
      <Show when={props.state.rollFarkled}>
        <GameFarkleOverlay myTurn={myTurn()} />
      </Show>
      <Show when={props.state.phase === "FINISHED"}>
        <Show
          when={
            props.state.outcomeReason === "PLAYER_WON"
            && props.state.outcomePlayerId === currentPlayer.id
          }
          fallback={<GameOverOverlay />}
        >
          <GameVictoryOverlay />
        </Show>
      </Show>
    </section>
  );
}
