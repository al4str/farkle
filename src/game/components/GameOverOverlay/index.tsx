import { i18nTranslate } from "src/i18n/translation";
import { UiTitle } from "src/ui/Title";
import { UiEventOverlay } from "src/ui/EventOverlay";
import styles from "src/game/components/GameOverOverlay/styles.module.css";

interface Props {
  class?: string;
  open?: undefined | boolean;
  onClose?: undefined | (() => void);
}

export function GameOverOverlay(props: Props) {
  return (
    <UiEventOverlay
      class={props.class}
      open={props.open}
      onClose={props.onClose}
      action={{
        label: i18nTranslate("common.action.close"),
        actionId: "game.over.close",
        code: "Escape",
        onClick: () => {
          props.onClose?.();
        },
      }}
    >
      <span class={styles.image} />
      <UiTitle variant="red">
        {i18nTranslate("game.label.over")}
      </UiTitle>
    </UiEventOverlay>
  );
}
