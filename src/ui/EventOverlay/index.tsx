import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { clsx } from "clsx";

import type { UiButtonProps } from "src/ui/Button";
import { UiButton } from "src/ui/Button";
import { UiGenericOverlay } from "src/ui/GenericOverlay";

import styles from "src/ui/EventOverlay/styles.module.css";

export type UiEventOverlayAction = Pick<
  UiButtonProps,
  "label" | "code" | "actionId" | "onClick" | "holdable" | "disabled"
>;

export interface UiEventOverlayProps {
  class?: undefined | string;
  open?: undefined | boolean;
  onClose?: undefined | (() => void);
  action?: null | UiEventOverlayAction;
  children: JSX.Element;
}

export function UiEventOverlay(props: UiEventOverlayProps) {
  return (
    <UiGenericOverlay
      open={props.open}
      onClose={props.onClose}
    >
      <div class={clsx(styles.overlay, props.class)}>
        {props.children}
        <Show when={props.action}>
          {(action) => (
            <UiButton
              {...action()}
              class={styles.action}
              disabled={action().disabled === true || props.open === false}
            />
          )}
        </Show>
      </div>
    </UiGenericOverlay>
  );
}
