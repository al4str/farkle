import { createEffect, createSignal, onCleanup } from "solid-js";
import { clsx } from "clsx";

import { i18nTranslate } from "src/i18n/translation";
import styles from "src/game/components/TurnAnnouncementOverlay/styles.module.css";

// --- Stubs: replace with real wiring ---
type PlayerId = string;

interface CorePlayerInGame {
  name: string;
}

const ROLL_ALLOW_TIME_MS = 3_000;
// --- End stubs ---

export interface GameTurnAnnouncementOverlayProps {
  class?: string;
  players: Map<PlayerId, CorePlayerInGame>;
  turnPlayerId: PlayerId;
}

export function GameTurnAnnouncementOverlay(props: GameTurnAnnouncementOverlayProps) {
  const [hidden, setHidden] = createSignal(false);
  const name = () => props.players.get(props.turnPlayerId)?.name ?? i18nTranslate("game.label.next_player");

  createEffect(() => {
    void props.turnPlayerId;
    setHidden(false);
    const timerId = window.setTimeout(() => {
      setHidden(true);
    }, ROLL_ALLOW_TIME_MS);
    onCleanup(() => {
      window.clearTimeout(timerId);
    });
  });

  return (
    <div
      class={clsx(styles.overlay, props.class)}
      data-hidden={hidden() ? "" : undefined}
    >
      <div class={styles.message}>
        <span class={clsx(styles.ornament, styles.ornamentLeft)} />
        <span>
          {i18nTranslate("game.label.turn", { name: name() })}
        </span>
        <span class={clsx(styles.ornament, styles.ornamentRight)} />
      </div>
    </div>
  );
}
