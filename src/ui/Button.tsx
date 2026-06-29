import type { JSX } from "solid-js";
import { Show, mergeProps, splitProps } from "solid-js";

import type { InteractionsActionId } from "src/interactions/types";
import { interactionsActionHandlers, interactionsView } from "src/interactions";
import styles from "src/ui/Button.module.css";

export interface UiButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  actionId?: InteractionsActionId;
  holdMeter?: boolean;
}

const UI_BUTTON_DEFAULTS: Pick<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> = {
  type: "button",
};

export function UiButton(props: UiButtonProps) {
  const merged = mergeProps(UI_BUTTON_DEFAULTS, props);
  const [local, rest] = splitProps(merged, ["actionId", "holdMeter", "class", "children", "onContextMenu"]);

  const handlers = local.actionId === undefined
    ? undefined
    : interactionsActionHandlers(local.actionId);
  const view = () => local.actionId === undefined
    ? undefined
    : interactionsView(local.actionId);

  return (
    <button
      {...rest}
      {...(handlers ?? {})}
      class={local.class === undefined ? styles.button : `${styles.button} ${local.class}`}
      data-pressed={view()?.pressed === true ? "" : undefined}
      data-holding={view()?.holding === true ? "" : undefined}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      {local.children}
      <Show when={local.holdMeter === true && local.actionId !== undefined}>
        <span class={styles.meter}>
          <span
            class={styles.bar}
            style={{
              width: `${Math.round((view()?.holdProgress ?? 0) * 100)}%`,
            }}
          />
        </span>
      </Show>
    </button>
  );
}
