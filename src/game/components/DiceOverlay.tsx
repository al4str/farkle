import { createSignal, onMount, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { clsx } from "clsx";

import type { DiceItem, DiceName } from "src/dice/data";
import { UiButton } from "src/ui/Button";
import { noop } from "src/utils/noop";
import type { Square } from "src/utils/placeIntoRadius";
import { audioUiPlay } from "src/audio";
import { diceCreateFromNames, diceGetMetaData } from "src/dice/data";
import { diceIconsGetUrl } from "src/dice/icons";
import { diceRoll } from "src/dice/roll";
import { gameRngMulberry32 } from "src/game/helpers/rng";
import { gameSeedManagerGenerateMaster } from "src/game/helpers/seedManager";
import { placeIntoRadius } from "src/utils/placeIntoRadius";
import styles from "src/game/components/DiceOverlay.module.css";

const DICE_NAMES = [
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
] as const satisfies DiceName[];

const RNG = gameRngMulberry32(gameSeedManagerGenerateMaster());

const DICE = Array.from(diceCreateFromNames(DICE_NAMES));

const DICE_PLACEMENTS = getDicePlacements(DICE);

function getDicePlacements(dice: typeof DICE) {
  const positionsMap = new Map<string, Square>();
  const placements = placeIntoRadius(
    dice.length,
    128,
    512,
    24,
    RNG,
  );
  for (const [index, placement] of placements.entries()) {
    const die = dice.at(index);
    if (die === undefined) {
      continue;
    }
    positionsMap.set(die.id, placement);
  }
  return positionsMap;
}

export function GameDiceOverlay() {
  const [dice, setDice] = createStore(DICE);
  const [getFocusId, setFocusId] = createSignal("");

  const rollDice = () => {
    setFocusId("");
    dice.forEach((die, index) => {
      setDice(index, "value", diceRoll(die, RNG));
    });
    audioUiPlay("dice_to_table_multiple", { rate: 0.95 + Math.random() * 0.1 });
  };

  onMount(() => {
    rollDice();
  });

  return (
    <div class={styles.screen}>
      <div class={styles.panel}>
        <UiButton
          label="Help"
          actionId="game.help"
          code="KeyT"
          onClick={noop}
        />
        <UiButton
          label="Re-roll"
          actionId="dice.reroll"
          code="KeyR"
          onClick={rollDice}
        />
        <UiButton
          label="Hold die"
          actionId="dice.hold"
          code="KeyE"
          onClick={noop}
        />
        <UiButton
          label="Score and continue"
          actionId="game.scoreAndContinue"
          code="KeyF"
          onClick={noop}
        />
        <UiButton
          holdable={true}
          label="Score and pass"
          actionId="game.scoreAndPass"
          code="KeyQ"
          onClick={noop}
        />
        <UiButton
          holdable={true}
          label="Give up"
          actionId="game.giveUp"
          code="Escape"
          onClick={noop}
        />
      </div>
      <ol
        class={styles.diceList}
        style={{
          position: "absolute",
          top: "calc(50% - 256px)",
          left: "calc(50% - 256px)",
          width: "512px",
          height: "512px",
        }}
      >
        <For each={dice}>
          {(die) => {
            const placement = DICE_PLACEMENTS.get(die.id);
            return (
              <li
                class={styles.diceItem}
                style={{
                  top: `${128 + (placement?.z ?? 0)}px`,
                  left: `${128 + (placement?.x ?? 0)}px`,
                }}
              >
                <Show when={getFocusId() === die.id}>
                  <div class={styles.focus} />
                </Show>
                <Die
                  angle={placement?.angle ?? 0}
                  die={die}
                  onFocus={() => setFocusId((prevId) => {
                    return prevId === die.id ? "" : die.id;
                  })}
                />
              </li>
            );
          }}
        </For>
      </ol>
    </div>
  );
}

interface DieProps {
  angle: number;
  die: DiceItem;
  onFocus: () => void;
}

function Die(props: DieProps) {
  const metaData = diceGetMetaData(props.die.name);

  return (
    <button
      class={styles.die}
      type="button"
      aria-label={metaData.title}
      onClick={() => {
        props.onFocus();
        audioUiPlay("dice_select", { rate: 0.95 + Math.random() * 0.1 });
      }}
    >
      <img
        class={styles.icon}
        src={diceIconsGetUrl(props.die.name)}
        alt={metaData.title}
        width={64}
        height={64}
        style={{
          transform: `rotate(${props.angle}rad)`,
        }}
      />
      <span class={clsx(styles.selection, styles.selectionPlayer)} />
      <span class={styles.labelWrapper}>
        <span
          class={styles.value}
          data-value={props.die.value}
        />
        <span class={styles.label}>
          {metaData.title}
        </span>
      </span>
    </button>
  )
}
