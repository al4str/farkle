import { i18nTranslate } from "src/i18n/translation";
import { UiTitle } from "src/ui/Title";
import { UiEventOverlay } from "src/ui/EventOverlay";
import styles from "src/game/components/GameOverOverlay/styles.module.css";

// --- Stubs: replace with real wiring ---
const clientActionsFinishPlayer = (): void => {};
// --- End stubs ---

export interface GameOverOverlayProps {
  class?: string;
}

export function GameOverOverlay(props: GameOverOverlayProps) {
  return (
    <UiEventOverlay
      class={props.class}
      action={{
        label: i18nTranslate("common.action.close"),
        actionId: "game.over.close",
        code: "Escape",
        onClick: clientActionsFinishPlayer,
      }}
    >
      <span class={styles.image} />
      <UiTitle variant="red">
        {i18nTranslate("game.label.over")}
      </UiTitle>
    </UiEventOverlay>
  );
}
