import { For, Show } from "solid-js";

import { i18nTranslate } from "src/i18n/translation";
import { UiBreadcrumbs } from "src/ui/Breadcrumbs";
import { UiSeparator } from "src/ui/Separator";
import styles from "src/game/components/ResultsScreen/styles.module.css";

// --- Stubs: replace with real wiring ---
type PlayerId = string;

type OutcomeReason =
  | null
  | "WAITING_TIMED_OUT"
  | "PLAYER_DISAPPEARED"
  | "PLAYER_GAVE_UP"
  | "PLAYER_WON";

interface CorePlayerInGame {
  id: PlayerId;
  name: string;
  icon: string;
  totalScore: number;
}

interface ClientGameStateShape {
  gameId: string;
  goalScore: number;
  outcomePlayerId: null | PlayerId;
  outcomeReason: OutcomeReason;
  players: Map<PlayerId, CorePlayerInGame>;
}

function useClientStateByKey(_key: "game"): ClientGameStateShape {
  return {
    gameId: "",
    goalScore: 0,
    outcomePlayerId: null,
    outcomeReason: null,
    players: new Map<PlayerId, CorePlayerInGame>(),
  };
}

interface DalGameData {
  createdAt: number;
  startedAt: null | number;
  finishedAt: null | number;
  seed: string;
}

function useDalGameQuery(_gameId: null | string): { data: null | DalGameData } {
  return { data: null };
}

function durationFormat(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

interface PlayerIconProps {
  class?: string;
  name: string;
}

function PlayerIcon(_props: PlayerIconProps) {
  return null;
}

interface PlayerBadgeProps {
  class?: string;
  player: CorePlayerInGame;
}

function PlayerBadge(_props: PlayerBadgeProps) {
  return null;
}
// --- End stubs ---

export function GameResultsScreen() {
  const gameState = useClientStateByKey("game");
  const query = useDalGameQuery(gameState.gameId || null);

  const outcomePlayer = (): null | CorePlayerInGame => {
    if (gameState.outcomePlayerId) {
      return gameState.players.get(gameState.outcomePlayerId) ?? null;
    }
    return null;
  };
  const playersList = () => Array.from(gameState.players.values());
  const duration = (): null | string => {
    const data = query.data;
    if (data?.startedAt && data.finishedAt) {
      return durationFormat(data.finishedAt - data.startedAt);
    }
    return null;
  };

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
          {i18nTranslate("game.results.title")}
        </h2>
        <p class={styles.row}>
          <span class={styles.rowLabel}>
            {i18nTranslate("game.results.score_to_win")}
          </span>
          <span class={styles.rowValue}>
            {gameState.goalScore}
          </span>
        </p>
        <UiSeparator class={styles.separator} />
        <p class={styles.row}>
          <span class={styles.rowLabel}>
            {i18nTranslate("game.results.player")}
          </span>
          <span class={styles.rowValueThin}>
            {i18nTranslate("game.results.score")}
          </span>
        </p>
        <For each={playersList()}>
          {(player) => (
            <div class={styles.playerRow}>
              <PlayerBadge
                class={styles.playerBadge}
                player={player}
              />
              <span class={styles.rowValue}>
                {player.totalScore}
              </span>
            </div>
          )}
        </For>
        <Show when={gameState.outcomeReason}>
          <UiSeparator class={styles.separator} />
          <Show when={gameState.outcomeReason === "WAITING_TIMED_OUT"}>
            <p>
              {i18nTranslate("game.results.no_one_showed")}
            </p>
          </Show>
          <Show
            when={
              gameState.outcomeReason === "PLAYER_DISAPPEARED"
              || gameState.outcomeReason === "PLAYER_GAVE_UP"
              || gameState.outcomeReason === "PLAYER_WON"
            }
          >
            <p class={styles.outcomeRow}>
              <Show when={outcomePlayer()}>
                {(player) => (
                  <PlayerIcon
                    class={styles.shrink}
                    name={player().icon}
                  />
                )}
              </Show>
              <span>
                {outcomePlayer()?.name ?? i18nTranslate("game.results.unknown_fighter")}
                {" "}
                <Show when={gameState.outcomeReason === "PLAYER_DISAPPEARED"}>
                  {i18nTranslate("game.results.disappeared")}
                </Show>
                <Show when={gameState.outcomeReason === "PLAYER_GAVE_UP"}>
                  {i18nTranslate("game.results.gave_up")}
                </Show>
                <Show when={gameState.outcomeReason === "PLAYER_WON"}>
                  {i18nTranslate("game.results.won")}
                </Show>
              </span>
            </p>
          </Show>
        </Show>
        <Show when={query.data}>
          {(data) => (
            <>
              <UiSeparator class={styles.separator} />
              <Show when={duration()}>
                {(value) => (
                  <p class={styles.row}>
                    <span class={styles.rowLabel}>
                      {i18nTranslate("game.results.duration")}
                    </span>
                    <span class={styles.rowValue}>
                      {value()}
                    </span>
                  </p>
                )}
              </Show>
              <p class={styles.row}>
                <span class={styles.rowLabel}>
                  {i18nTranslate("game.results.created_at")}
                </span>
                <span class={styles.rowValue}>
                  {new Date(data().createdAt).toLocaleString()}
                </span>
              </p>
              <p class={styles.row}>
                <span class={styles.rowLabel}>
                  {i18nTranslate("game.results.seed")}
                </span>
                <span class={styles.rowValue}>
                  {data().seed}
                </span>
              </p>
            </>
          )}
        </Show>
      </section>
    </div>
  );
}
