import { For, Show } from "solid-js";
import { clsx } from "clsx";

import type { UiAssetsImageName } from "src/ui/AssetsImage";
import { i18nTranslate } from "src/i18n/translation";
import { UiAssetsImage } from "src/ui/AssetsImage";
import { UiBreadcrumbs } from "src/ui/Breadcrumbs";
import { UiSeparator } from "src/ui/Separator";
import { UiButton } from "src/ui/Button";
import styles from "src/game/components/LobbyScreen/styles.module.css";

// --- Stubs: replace with real wiring ---
type PlayerId = string;

interface CorePlayerInGame {
  id: PlayerId;
  name: string;
  icon: string;
  connected: boolean;
  ready: boolean;
  left: boolean;
}

interface ClientGameStateShape {
  gameId: string;
  isAgainstAI: boolean;
  players: Map<PlayerId, CorePlayerInGame>;
}

function useClientStateByKey(_key: "game"): ClientGameStateShape {
  return {
    gameId: "",
    isAgainstAI: false,
    players: new Map<PlayerId, CorePlayerInGame>(),
  };
}

function usePlayerContextData(): { id: PlayerId } {
  return { id: "" };
}

function clientActionsToggleReadiness(): void {}

function clientSfxPlay(_name: string): void {}

interface ClientNotificationsData {
  id: string;
  type: string;
  message: string;
  icon: UiAssetsImageName;
}

function clientNotificationsUpsert(_data: ClientNotificationsData): void {}

interface PlayerBadgeProps {
  class?: string;
  player: CorePlayerInGame;
}

function PlayerBadge(_props: PlayerBadgeProps) {
  return null;
}
// --- End stubs ---

export function GameLobbyScreen() {
  const gameState = useClientStateByKey("game");
  const currentPlayer = usePlayerContextData();

  const copyGameLink = async (): Promise<void> => {
    clientSfxPlay("ui_copy");
    await window.navigator.clipboard.writeText(window.location.href);
    clientNotificationsUpsert({
      id: "COPY_GAME_LINK",
      type: "COPIED",
      message: i18nTranslate("game.status.link_copied"),
      icon: "perk_sympatak",
    });
  };

  const iAmReady = () => gameState.players.get(currentPlayer.id)?.ready === true;
  const playersList = () => {
    return Array.from(gameState.players.values()).filter((player) => !player.left && player.connected);
  };
  const opponentJoined = () => gameState.players.size === 2;
  const nobodyIsReady = () => playersList().every((player) => !player.ready);
  const someoneIsReady = () => playersList().some((player) => player.ready);
  const allReady = () => playersList().length === 2 && playersList().every((player) => player.ready);

  return (
    <div class="page-container">
      <section class={styles.section}>
        <UiBreadcrumbs
          items={[
            { label: i18nTranslate("nav.link.home"), to: "/$language" },
            { label: i18nTranslate("nav.link.games"), to: "/$language/games" },
            { label: `#${gameState.gameId.slice(-6)}` },
          ]}
        />
        <h2 class={styles.heading}>
          {i18nTranslate("game.label.lobby")}
        </h2>
        <Show when={gameState.isAgainstAI}>
          <p class={styles.minor}>
            {i18nTranslate("game.status.playing_against_ai")}
          </p>
        </Show>
        <Show when={!opponentJoined() && !gameState.isAgainstAI}>
          <div class={styles.imageRow}>
            <UiAssetsImage
              asset="crime_looking"
              style={{ width: "128px", height: "64px" }}
            />
          </div>
          <p class={clsx(styles.thin, styles.minor)}>
            {i18nTranslate("game.status.waiting_for_players")}
          </p>
        </Show>
        <Show when={opponentJoined() && !allReady() && (nobodyIsReady() || someoneIsReady())}>
          <div class={styles.imageRow}>
            <UiAssetsImage
              asset={someoneIsReady() ? "crime_combat_active" : "crime_combat_passive"}
              style={{ width: "128px", height: "64px" }}
            />
          </div>
          <p class={clsx(styles.thin, styles.minor)}>
            {i18nTranslate("game.status.waiting_for_ready")}
          </p>
        </Show>
        <Show when={allReady()}>
          <div class={styles.imageRow}>
            <UiAssetsImage
              asset="crime_combat_active"
              style={{ width: "128px", height: "64px" }}
            />
          </div>
          <p class={clsx(styles.thin, styles.starting)}>
            {i18nTranslate("game.status.starting_shortly")}
          </p>
        </Show>
        <UiSeparator class={styles.separator} />
        <For each={playersList()}>
          {(player) => (
            <div class={styles.playerRow}>
              <PlayerBadge player={player} />
              <p class={styles.playerStatus}>
                <UiAssetsImage
                  asset={player.ready ? "icon_green_tick" : "icon_red_cross"}
                  style={{
                    width: player.ready ? "25.5px" : "21px",
                    height: player.ready ? "24px" : "20.5px",
                  }}
                />
                <span class={clsx(!player.ready && styles.notReadyText)}>
                  {player.ready
                    ? i18nTranslate("game.status.player_ready")
                    : i18nTranslate("game.status.player_not_ready")}
                </span>
              </p>
            </div>
          )}
        </For>
        <UiSeparator class={styles.separator} />
        <div class={styles.actions}>
          <UiButton
            disabled={!opponentJoined()}
            actionId="game--mark-is-ready"
            code="Space"
            label={iAmReady()
              ? i18nTranslate("game.status.not_ready")
              : i18nTranslate("game.status.ready_to_play")}
            onClick={() => {
              clientActionsToggleReadiness();
            }}
          />
          <UiButton
            actionId="game--copy--game-id"
            code="KeyC"
            label={i18nTranslate("game.action.copy_link")}
            onClick={() => {
              void copyGameLink();
            }}
          />
        </div>
      </section>
    </div>
  );
}
