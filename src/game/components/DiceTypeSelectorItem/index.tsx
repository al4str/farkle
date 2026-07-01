import { splitProps, For } from "solid-js";
import { clsx } from "clsx";

import styles from "src/game/components/DiceTypeSelectorItem/styles.module.css";

// --- Stubs: replace with real wiring ---
const DICE_AMOUNT = 6;

export interface CoreDiceTypesDie {
  name: string;
  title: string;
  description: string;
  sides: number[];
}

function coreDiceTypesCalcSidePercentages(die: CoreDiceTypesDie): number[] {
  const total = die.sides.reduce((sum, side) => sum + side, 0);
  if (total <= 0) {
    return die.sides.map(() => 0);
  }
  return die.sides.map((side) => side / total);
}

function coreDiceIconsGetUrl(name: string): string {
  return `/assets/images/dice/${name}.webp`;
}
// --- End stubs ---

const SIDE_LABELS = ["I", "II", "III", "IV", "V", "VI"] as const;

export interface GameDiceTypeSelectorItemProps {
  class?: string;
  disabled?: boolean;
  count: number;
  die: CoreDiceTypesDie;
  onAdd: () => void;
  onRemove: () => void;
}

export function GameDiceTypeSelectorItem(props: GameDiceTypeSelectorItemProps) {
  const [local] = splitProps(props, [
    "class",
    "disabled",
    "count",
    "die",
    "onAdd",
    "onRemove",
  ]);

  const atMax = () => local.count >= DICE_AMOUNT;
  const iconUrl = () => coreDiceIconsGetUrl(local.die.name);
  const percentages = () => coreDiceTypesCalcSidePercentages(local.die);
  const addDisabled = () => local.disabled === true || atMax();
  const removeDisabled = () => local.disabled === true || local.count <= 0;

  return (
    <div class={clsx(styles.item, local.class)}>
      <div class={styles.header}>
        <span
          class={styles.icon}
          style={{ "background-image": `url("${iconUrl()}")` }}
        />
        <p class={styles.title}>
          {local.die.title}
        </p>
        <p class={styles.description}>
          {local.die.description}
        </p>
      </div>
      <div class={styles.tableWrap}>
        <table class={styles.table}>
          <tbody>
            <tr class={styles.headRow}>
              <For each={percentages()}>
                {(_, valueIndex) => (
                  <th class={styles.headCell}>
                    {SIDE_LABELS.at(valueIndex())}
                  </th>
                )}
              </For>
            </tr>
            <tr class={styles.valueRow}>
              <For each={percentages()}>
                {(value) => (
                  <td class={styles.valueCell}>
                    {(100 * value).toFixed(1)}%
                  </td>
                )}
              </For>
            </tr>
          </tbody>
        </table>
      </div>
      <div class={styles.controls}>
        <button
          class={styles.buttonLeft}
          data-active={local.count > 0 ? "" : undefined}
          disabled={addDisabled()}
          type="button"
          onClick={() => local.onAdd()}
        >
          Add
        </button>
        <span
          class={styles.count}
          data-active={local.count > 0 ? "" : undefined}
        >
          {local.count}
        </span>
        <button
          class={styles.buttonRight}
          data-active={local.count > 0 ? "" : undefined}
          disabled={removeDisabled()}
          type="button"
          onClick={() => local.onRemove()}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
