import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { clsx } from "clsx";

import { randomize } from "src/utils/randomize";
import { i18nTranslate } from "src/i18n/translation";
import { UiTitle } from "src/ui/Title";
import { UiEventOverlay } from "src/ui/EventOverlay";
import styles from "src/game/components/VictoryOverlay/styles.module.css";

// --- Stubs: replace with real wiring ---
type PlayerId = string;

interface CorePlayerInGame {
  name: string;
}

interface ClientGameState {
  players: Map<PlayerId, CorePlayerInGame>;
  outcomePlayerId: null | PlayerId;
  celebrate: boolean;
}

interface PlayerContextData {
  id: PlayerId;
}

function useClientStateByKey(key: "game"): () => ClientGameState {
  void key;
  const [state] = createSignal<ClientGameState>({
    players: new Map(),
    outcomePlayerId: null,
    celebrate: false,
  });
  return state;
}

function usePlayerContextData(): PlayerContextData {
  return { id: "" };
}

const clientRenderConfettiFire = (_side: "left" | "right"): void => {};

// How long the confetti keeps bursting after a victory.
const CELEBRATION_MS = 6000;
// --- End stubs ---

const IMAGES = [
  "/assets/images/ui/mantling_activity.webp",
  "/assets/images/ui/mantling_side.webp",
  "/assets/images/ui/mantling_main.webp",
] as const;

interface Props {
  class?: string;
  open?: undefined | boolean;
  onClose?: undefined | (() => void);
}

export function GameVictoryOverlay(props: Props) {
  const [image] = createSignal(IMAGES[randomize(0, IMAGES.length - 1)]);
  const currentPlayer = usePlayerContextData();
  const game = useClientStateByKey("game");

  const message = (): undefined | string => {
    const outcomePlayerId = game().outcomePlayerId;
    if (currentPlayer.id === outcomePlayerId) {
      return i18nTranslate("common.label.you");
    }
    if (outcomePlayerId) {
      return game().players.get(outcomePlayerId)?.name;
    }
    return undefined;
  };

  onMount(() => {
    if (!game().celebrate) {
      return;
    }
    clientRenderConfettiFire("left");
    clientRenderConfettiFire("right");
    const timerLeft = window.setInterval(() => {
      clientRenderConfettiFire("left");
    }, 1000);
    const timerRight = window.setInterval(() => {
      clientRenderConfettiFire("right");
    }, 1000);
    const stopTimerId = window.setTimeout(() => {
      window.clearInterval(timerLeft);
      window.clearInterval(timerRight);
    }, CELEBRATION_MS);
    onCleanup(() => {
      window.clearInterval(timerLeft);
      window.clearInterval(timerRight);
      window.clearTimeout(stopTimerId);
    });
  });

  return (
    <UiEventOverlay
      class={props.class}
      open={props.open}
      onClose={props.onClose}
      action={{
        label: i18nTranslate("common.action.close"),
        actionId: "game.victory.close",
        code: "Escape",
        onClick: () => {
          props.onClose?.();
        },
      }}
    >
      <span class={styles.figure}>
        <span class={clsx(styles.rays, styles.raysSmall)} />
        <span class={clsx(styles.rays, styles.raysBig)} />
        <span
          class={styles.image}
          style={{
            "background-image": `url("${image()}")`,
          }}
        />
      </span>
      <UiTitle variant="yellow">
        {i18nTranslate("game.label.victory")}
      </UiTitle>
      <Show when={message()}>
        {(name) => (
          <h2 class={styles.winner}>
            {i18nTranslate("game.label.player_won", { name: name() })}
          </h2>
        )}
      </Show>
    </UiEventOverlay>
  );
}
