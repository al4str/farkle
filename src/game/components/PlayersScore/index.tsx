import { clsx } from "clsx";

import { i18nTranslate } from "src/i18n/translation";
import { UiSeparator } from "src/ui/Separator";
import { GameTimer } from "src/game/components/Timer";
import styles from "src/game/components/PlayersScore/styles.module.css";

type PlayerId = string;

interface GamePlayer {
  id: PlayerId;
  name: string;
  ready: boolean;
  finished: boolean;
  totalScore: number;
  turnScore: number;
  selectedScore: number;
}

const FALLBACK: GamePlayer = {
  id: "",
  name: "",
  ready: true,
  finished: false,
  totalScore: 0,
  turnScore: 0,
  selectedScore: 0,
};

interface Props {
  class?: string;
  goalScore: number;
  currentPlayerId: PlayerId;
  turnPlayerId: PlayerId;
  players: Record<PlayerId, GamePlayer>;
}

export function GamePlayersScore(props: Props) {
  const player = (): GamePlayer => {
    if (isSpectating(props.currentPlayerId, props.players)) {
      return Object.values(props.players)[0] ?? FALLBACK;
    }
    return getPlayer(props.currentPlayerId, props.players);
  };

  const opponent = (): GamePlayer => {
    if (isSpectating(props.currentPlayerId, props.players)) {
      return Object.values(props.players)[1] ?? FALLBACK;
    }
    return getOpponent(props.currentPlayerId, props.players);
  };

  const playerIsActive = () => player().id === props.turnPlayerId;

  return (
    <div class={clsx(styles.grid, props.class)}>
      <span
        class={styles.timer}
        data-side={playerIsActive() ? "player" : "opponent"}
      >
        <GameTimer class={styles.timerInner} />
      </span>
      <span class={styles.playerName}>
        <span class={styles.name}>
          {player().name}
        </span>
      </span>
      <span class={styles.playerTotal}>
        {player().totalScore}
      </span>
      <span class={styles.playerTurn}>
        {player().turnScore}
      </span>
      <span class={styles.playerSelected}>
        {player().selectedScore}
      </span>
      <UiSeparator
        class={styles.separatorLeft}
        variant="vertical"
      />
      <span class={styles.goalLabel}>
        {i18nTranslate("game.label.goal")}
      </span>
      <span class={styles.goalValue}>
        {props.goalScore}
      </span>
      <span class={styles.roundLabel}>
        {i18nTranslate("game.label.round")}
      </span>
      <span class={styles.selectedLabel}>
        {i18nTranslate("game.label.selected")}
      </span>
      <UiSeparator
        class={styles.separatorRight}
        variant="vertical"
      />
      <span class={styles.opponentName}>
        <span class={styles.name}>
          {opponent().name}
        </span>
      </span>
      <span class={styles.opponentTotal}>
        {opponent().totalScore}
      </span>
      <span class={styles.opponentTurn}>
        {opponent().turnScore}
      </span>
      <span class={styles.opponentSelected}>
        {opponent().selectedScore}
      </span>
    </div>
  );
}

function getPlayer(currentPlayerId: PlayerId, players: Record<PlayerId, GamePlayer>): GamePlayer {
  const found = players[currentPlayerId];
  return found ?? FALLBACK;
}

function getOpponent(currentPlayerId: PlayerId, players: Record<PlayerId, GamePlayer>): GamePlayer {
  const found = Object.values(players).find((player) => player.id !== currentPlayerId);
  return found ?? FALLBACK;
}

function isSpectating(currentPlayerId: PlayerId, players: Record<PlayerId, GamePlayer>): boolean {
  return !(currentPlayerId in players);
}
