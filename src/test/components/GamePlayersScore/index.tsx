import { createSignal } from "solid-js";

import { GamePlayersScore } from "src/game/components/PlayersScore";

import styles from "src/test/components/Canvas/Controls.module.css";

const PLAYER_ID = "player";

const OPPONENT_ID = "opponent";

export function TestGamePlayersScore() {
  const [getGoalScore, setGoalScore] = createSignal(2_000);
  const [getTurnPlayerId, setTurnPlayerId] = createSignal(OPPONENT_ID);
  const [getPlayerTotal, setPlayerTotal] = createSignal(5_000);
  const [getPlayerTurn, setPlayerTurn] = createSignal(450);
  const [getPlayerSelected, setPlayerSelected] = createSignal(150);
  const [getOpponentTotal, setOpponentTotal] = createSignal(5_000);
  const [getOpponentTurn, setOpponentTurn] = createSignal(450);
  const [getOpponentSelected, setOpponentSelected] = createSignal(150);

  return (
    <div>
      <label class={styles.control}>
        <span class="control-label">
          Game score goal
          <output class={styles["control-value"]}>
            {getGoalScore()}
          </output>
        </span>
        <input
          type="range"
          min="1000"
          max="10000"
          step="1000"
          value={getGoalScore()}
          onInput={(event) => setGoalScore(event.currentTarget.valueAsNumber)}
        />
      </label>
      <span class="control-section-title">
        Player score
      </span>
      <label class={styles.control}>
        <span class="control-label">
          Total
          <output class={styles["control-value"]}>
            {getPlayerTotal()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getPlayerTotal()}
          onInput={(event) => setPlayerTotal(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.control}>
        <span class="control-label">
          Turn
          <output class={styles["control-value"]}>
            {getPlayerTurn()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getPlayerTurn()}
          onInput={(event) => setPlayerTurn(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.control}>
        <span class="control-label">
          Selected
          <output class={styles["control-value"]}>
            {getPlayerSelected()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getPlayerSelected()}
          onInput={(event) => setPlayerSelected(event.currentTarget.valueAsNumber)}
        />
      </label>
      <span class="control-section-title">
        Opponent score
      </span>
      <label class={styles.control}>
        <span class="control-label">
          Total
          <output class={styles["control-value"]}>
            {getOpponentTotal()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getOpponentTotal()}
          onInput={(event) => setOpponentTotal(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.control}>
        <span class="control-label">
          Turn
          <output class={styles["control-value"]}>
            {getOpponentTurn()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getOpponentTurn()}
          onInput={(event) => setOpponentTurn(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.control}>
        <span class="control-label">
          Selected
          <output class={styles["control-value"]}>
            {getOpponentSelected()}
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={getOpponentSelected()}
          onInput={(event) => setOpponentSelected(event.currentTarget.valueAsNumber)}
        />
      </label>
      <div class={styles.control}>
        <span class="control-label">
          Turn Player ID
          <output class={styles["control-value"]}>
            {getTurnPlayerId()}
          </output>
        </span>
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          <label>
            <input
              type="radio"
              name="turnPlayerId"
              checked={getTurnPlayerId() === PLAYER_ID}
              value={PLAYER_ID}
              onChange={() => setTurnPlayerId(PLAYER_ID)}
            />
            <span>"{PLAYER_ID}"</span>
          </label>
          <label>
            <input
              type="radio"
              name="turnPlayerId"
              checked={getTurnPlayerId() === OPPONENT_ID}
              value={OPPONENT_ID}
              onChange={() => setTurnPlayerId(OPPONENT_ID)}
            />
            <span>"{OPPONENT_ID}"</span>
          </label>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          "pointer-events": "none",
        }}
      >
        <GamePlayersScore
          goalScore={getGoalScore()}
          currentPlayerId={PLAYER_ID}
          turnPlayerId={getTurnPlayerId()}
          players={{
            [PLAYER_ID]: {
              id: PLAYER_ID,
              name: "Player",
              ready: true,
              finished: false,
              totalScore: getPlayerTotal(),
              turnScore: getPlayerTurn(),
              selectedScore: getPlayerSelected(),
            },
            [OPPONENT_ID]: {
              id: OPPONENT_ID,
              name: "Enemy AI",
              ready: true,
              finished: false,
              totalScore: getOpponentTotal(),
              turnScore: getOpponentTurn(),
              selectedScore: getOpponentSelected(),
            },
          }}
        />
      </div>
    </div>
  )
}
