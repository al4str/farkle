import { createSignal } from "solid-js";

import { randomize } from "src/utils/randomize";
import { i18nTranslate } from "src/i18n/translation";
import { UiTitle } from "src/ui/Title";
import { UiEventOverlay } from "src/ui/EventOverlay";
import styles from "src/game/components/FarkleOverlay/styles.module.css";

// --- Stubs: replace with real wiring ---
const clientActionsPassTurn = (): void => {};
// --- End stubs ---

const IMAGES = [
  "/assets/images/icons/unsatisfaction.webp",
  "/assets/images/icons/fool.webp",
  "/assets/images/icons/mortal_hug.webp",
  "/assets/images/icons/no_thank_you.webp",
  "/assets/images/icons/charisma.webp",
  "/assets/images/icons/defence.webp",
] as const;

export interface GameFarkleOverlayProps {
  class?: string;
  myTurn: boolean;
}

export function GameFarkleOverlay(props: GameFarkleOverlayProps) {
  const [image] = createSignal(IMAGES[randomize(0, IMAGES.length - 1)]);

  return (
    <UiEventOverlay
      class={props.class}
      action={props.myTurn ? {
        label: i18nTranslate("common.action.continue"),
        actionId: "game.farkle.continue",
        code: "KeyF",
        onClick: clientActionsPassTurn,
      } : null}
    >
      <span
        class={styles.image}
        style={{
          "background-image": `url("${image()}")`,
        }}
      />
      <UiTitle variant="red">
        {i18nTranslate("game.label.farkle")}
      </UiTitle>
    </UiEventOverlay>
  );
}
