import { createEffect, on, onCleanup } from "solid-js";
import { clsx } from "clsx";

import { i18nTranslate } from "src/i18n/translation";
import { UiGenericOverlay } from "src/ui/GenericOverlay";
import styles from "src/game/components/TurnAnnouncementOverlay/styles.module.css";

const TIMER_MS = 2_000;

interface Props {
  class?: string;
  open?: undefined | boolean;
  playerName: undefined | string;
  onClose?: undefined | (() => void);
}

export function GameTurnAnnouncementOverlay(props: Props) {
  const getPlayerName = () => props.playerName ?? i18nTranslate("game.label.next_player");
  let timerId = -1;

  createEffect(on(
    () => props.open,
    (nextOpen) => {
      window.clearTimeout(timerId);
      if (nextOpen) {
        timerId = window.setTimeout(() => props.onClose?.(), TIMER_MS);
      }
    },
  ));

  onCleanup(() => {
    window.clearTimeout(timerId);
  });

  return (
    <UiGenericOverlay
      modal={false}
      open={props.open}
      onClose={props.onClose}
    >
      <div
        class={clsx(styles.overlay, props.class)}
      >
        <div class={styles.message}>
          <span class={clsx(styles.ornament, styles.ornamentLeft)} />
          <span>
            {i18nTranslate("game.label.turn", { name: getPlayerName() })}
          </span>
          <span class={clsx(styles.ornament, styles.ornamentRight)} />
        </div>
      </div>
    </UiGenericOverlay>
  );
}
