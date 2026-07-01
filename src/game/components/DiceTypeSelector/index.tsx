import { splitProps, For } from "solid-js";
import { clsx } from "clsx";

import type { CoreDiceTypesDie } from "src/game/components/DiceTypeSelectorItem";
import { i18nTranslate } from "src/i18n/translation";
import { GameDiceTypeSelectorItem } from "src/game/components/DiceTypeSelectorItem";
import styles from "src/game/components/DiceTypeSelector/styles.module.css";

// --- Stubs: replace with real wiring ---
const DICE_AMOUNT = 6;

const CORE_DICE_TYPES_LIST: CoreDiceTypesDie[] = [
  {
    name: "dieNormal",
    title: "Normal die",
    description: "A regular six-sided die.",
    sides: [1, 1, 1, 1, 1, 1],
  },
];

const CORE_DICE_TYPES_BY_NAME: Record<string, CoreDiceTypesDie | undefined> = Object.fromEntries(
  CORE_DICE_TYPES_LIST.map((die) => [die.name, die]),
);

function coreDiceTypesIsNameValid(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(CORE_DICE_TYPES_BY_NAME, name);
}

const NORMAL_DIE: CoreDiceTypesDie = CORE_DICE_TYPES_LIST[0] ?? {
  name: "dieNormal",
  title: "Normal die",
  description: "",
  sides: [1, 1, 1, 1, 1, 1],
};
// --- End stubs ---

const DICE_LIST = CORE_DICE_TYPES_LIST.filter((die) => die.name !== "dieNormal");

export interface GameDiceTypeSelectorProps {
  class?: string;
  disabled?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
}

export function GameDiceTypeSelector(props: GameDiceTypeSelectorProps) {
  const [local] = splitProps(props, [
    "class",
    "disabled",
    "value",
    "onChange",
  ]);

  const atMax = () => local.value.length >= DICE_AMOUNT;

  const countOf = (name: string): number => {
    return local.value.reduce((total, current) => total + (current === name ? 1 : 0), 0);
  };

  const handleAdd = (name: string): void => {
    if (local.disabled === true || atMax()) {
      return;
    }
    local.onChange([...local.value, name]);
  };

  const handleRemove = (name: string): void => {
    if (local.disabled === true) {
      return;
    }
    const lastIndex = local.value.lastIndexOf(name);
    if (lastIndex >= 0) {
      local.onChange(local.value.filter((_, index) => index !== lastIndex));
    }
  };

  const slots = () => {
    return Array.from({ length: DICE_AMOUNT }, (_, index): CoreDiceTypesDie => {
      const dieName = local.value.at(index);
      if (dieName && coreDiceTypesIsNameValid(dieName)) {
        return CORE_DICE_TYPES_BY_NAME[dieName] ?? NORMAL_DIE;
      }
      return NORMAL_DIE;
    });
  };

  return (
    <div class={clsx(styles.selector, local.class)}>
      <p class={styles.minor}>
        {i18nTranslate("game.action.dice_selection")}
      </p>
      <div class={styles.grid}>
        <For each={DICE_LIST}>
          {(die) => (
            <GameDiceTypeSelectorItem
              disabled={local.disabled === true}
              count={countOf(die.name)}
              die={die}
              onAdd={() => handleAdd(die.name)}
              onRemove={() => handleRemove(die.name)}
            />
          )}
        </For>
      </div>
      <p class={styles.minor}>
        {local.value.length} / {DICE_AMOUNT}
      </p>
      <div class={styles.grid}>
        <For each={slots()}>
          {(die) => (
            <GameDiceTypeSelectorItem
              disabled={local.disabled === true}
              count={countOf(die.name)}
              die={die}
              onAdd={() => handleAdd(die.name)}
              onRemove={() => handleRemove(die.name)}
            />
          )}
        </For>
      </div>
    </div>
  );
}
