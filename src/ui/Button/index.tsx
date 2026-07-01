import type { JSX } from "solid-js";
import { splitProps, onCleanup, onMount, Show } from "solid-js";
import { clsx } from "clsx";

import type { InteractionsDefinition, InteractionsListeners } from "src/interactions/types";
import type { InteractionsKeyCode } from "src/interactions/keys";
import { interactionsGetHandlers, interactionsGetState, interactionsListen } from "src/interactions";
import { interactionsKeyLabel } from "src/interactions/keys";
import { audioUiPlay } from "src/audio";
import styles from "src/ui/Button/styles.module.css";

const HOLD_TIME_SEC = 1;

type Size = "long" | "small";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type SafeButtonProps = Omit<ButtonProps, "onClick" | "onContextMenu" | "children">;

export interface UiButtonProps extends SafeButtonProps {
  label: string;
  holdable?: boolean;
  actionId: InteractionsDefinition["actionId"];
  code: InteractionsKeyCode;
  onClick: () => void;
}

export function UiButton(props: UiButtonProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "disabled",
    "holdable",
    "label",
    "actionId",
    "code",
    "onClick",
  ]);
  const keyLabel = interactionsKeyLabel(local.code);
  const size: Size = keyLabel.length > 1 ? "long" : "small";
  const definition: InteractionsDefinition = {
    actionId: local.actionId,
    bindings: [
      {
        kind: "pointer",
        button: 0,
      },
      {
        kind: "key",
        code: local.code,
      },
    ],
    holdTime: local.holdable ? HOLD_TIME_SEC : undefined,
  };
  const handlers = interactionsGetHandlers(local.actionId);

  const getInteractionsState = () => {
    return interactionsGetState(local.actionId);
  };

  const getAngle = () => {
    return getInteractionsState().holdingProgress * 360;
  };

  const isDown = () => {
    return getInteractionsState().pressed && local.disabled !== true;
  };

  onMount(() => {
    const listeners: InteractionsListeners = {
      press: () => {
        audioUiPlay("cling_mid", { rate: 0.90 + Math.random() * 0.1 });
      },
    };
    if (local.holdable) {
      listeners.hold = () => {
        audioUiPlay("cling_high", { rate: 0.90 + Math.random() * 0.1 });
        local.onClick();
      };
    }
    else {
      listeners.click = () => {
        local.onClick();
      };
    }
    const off = interactionsListen(definition, listeners);
    onCleanup(off);
  });

  return (
    <button
      {...rest}
      {...handlers}
      class={clsx(styles["ui-action-button"], local.class)}
      disabled={local.disabled}
      type="button"
      aria-disabled={local.disabled === true ? "true" : undefined}
      data-input-key={local.code}
      data-down={isDown() ? "" : undefined}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <span class={styles["ui-action-button--row"]}>
        <Show when={local.label !== undefined}>
          <span class={styles["ui-action-button--label"]}>
            {local.label}
          </span>
        </Show>
        <span class={clsx(
          styles["ui-action-button--key"],
          size === "small"
            ? styles["ui-action-button--key-small"]
            : styles["ui-action-button--key-long"],
        )}>
          <span
            class={styles["ui-action-button--key-bg"]}
            style={{
              "background-image": `url("${getKbImage(size)}")`,
            }}
          />
          <span class={styles["ui-action-button--key-label"]}>
            {keyLabel}
          </span>
          <Show when={local.holdable && local.disabled !== true && !isDown()}>
            <span
              class={styles["ui-action-button--hold-preview"]}
              style={{
                "background-image": "url(/assets/images/ui/kb_hold_preview.webp)",
              }}
            />
          </Show>
          <Show when={local.holdable && local.disabled !== true && isDown()}>
            <span
              class={styles["ui-action-button--hold-track"]}
              style={{
                "background-image": "url(/assets/images/ui/kb_hold_track.webp)",
                "background-size": "auto 100%",
              }}
            >
              <span
                class={styles["ui-action-button--hold-indicator"]}
                style={{
                  "background-image": "url(/assets/images/ui/kb_hold_indicator.webp)",
                  "background-size": "auto 100%",
                  "mask": `conic-gradient(from 0deg, black ${getAngle()}deg, transparent ${getAngle()}deg)`,
                }}
              />
            </span>
          </Show>
        </span>
      </span>
    </button>
  );
}

function getKbImage(size: undefined | Size): string {
  if (size === "small") {
    return "/assets/images/ui/kb_small.webp";
  }
  return "/assets/images/ui/kb_long.webp";
}
