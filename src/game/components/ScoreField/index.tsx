import { clsx } from "clsx";

import { i18nTranslate } from "src/i18n/translation";
import styles from "src/game/components/ScoreField/styles.module.css";

// --- Stubs: replace with real wiring ---
const TARGET_SCORE_DEFAULT = 4_000;
// --- End stubs ---

const SCORE_MIN = 1_000;
const SCORE_MAX = 100_000;

export interface GameScoreFieldProps {
  ref?: (el: HTMLInputElement) => void;
  class?: string;
  disabled?: boolean;
  value: number;
  onChange: (value: number) => void;
}

export function GameScoreField(props: GameScoreFieldProps) {
  return (
    <label
      class={clsx(styles.field, props.class)}
      aria-label={i18nTranslate("game.action.target_score")}
      data-disabled={props.disabled === true ? "" : undefined}
    >
      <span class={styles.background} />
      <input
        class={styles.input}
        ref={props.ref}
        readOnly={props.disabled === true}
        required={true}
        autocomplete="off"
        autocorrect="off"
        spellcheck={false}
        type="number"
        step={1_000}
        min={SCORE_MIN}
        max={SCORE_MAX}
        name="targetScore"
        placeholder={i18nTranslate("game.config.score_placeholder", {
          default: TARGET_SCORE_DEFAULT.toString(),
        })}
        value={props.value}
        onInput={(event) => {
          props.onChange(event.currentTarget.valueAsNumber);
        }}
        onBlur={(event) => {
          const nextValue = event.currentTarget.valueAsNumber;
          if (!Number.isFinite(nextValue) || (nextValue < SCORE_MIN && nextValue > SCORE_MAX)) {
            props.onChange(TARGET_SCORE_DEFAULT);
          }
        }}
      />
      <span class={styles.frame} />
    </label>
  );
}
