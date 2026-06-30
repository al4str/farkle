import type { JSX } from "solid-js";
import { splitProps, onCleanup, onMount, Show } from "solid-js";
import { clsx } from "clsx";

import type { InteractionsDefinition } from "src/interactions/types";
import type { InteractionsKeyCode } from "src/interactions/keys";
import { interactionsDefine, interactionsGetHandlers, interactionsGetState, interactionsOn, interactionsRemove } from "src/interactions";
import { interactionsKeyLabel } from "src/interactions/keys";
import styles from "src/ui/Button.module.css";

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
  const { disabled, holdable, label, actionId, code, onClick } = local;
  const keyLabel = interactionsKeyLabel(code);
  const size: Size = keyLabel.length > 1 ? "long" : "small";
  const definition: InteractionsDefinition = {
    actionId,
    bindings: [
      {
        kind: "pointer",
        button: 0,
      },
      {
        kind: "key",
        code,
      },
    ],
    holdTime: holdable ? HOLD_TIME_SEC : undefined,
  };
  const handlers = interactionsGetHandlers(actionId);

  const view = () => {
    return interactionsGetState(actionId);
  };

  const isDown = () => {
    return view().pressed && disabled !== true;
  };

  const progressAngle = () => {
    return view().holdingProgress * 360;
  };

  onMount(() => {
    interactionsDefine(definition);
    const trigger = holdable ? "hold" : "click";
    const off = interactionsOn(actionId, (event) => {
      if (event.type === trigger) {
        onClick();
      }
    });

    onCleanup(() => {
      off();
      interactionsRemove(actionId);
    });
  });

  return (
    <button
      {...rest}
      {...handlers}
      class={clsx(styles["ui-action-button"], local.class)}
      disabled={disabled}
      type="button"
      aria-disabled={disabled === true ? "true" : undefined}
      data-input-key={code}
      data-down={isDown() ? "" : undefined}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <span class={styles["ui-action-button--row"]}>
        <Show when={label !== undefined}>
          <span class={styles["ui-action-button--label"]}>
            {label}
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
          <Show when={holdable && disabled !== true && !isDown()}>
            <span
              class={styles["ui-action-button--hold-preview"]}
              style={{
                "background-image": "url(/assets/images/ui/kb_hold_preview.webp)",
              }}
            />
          </Show>
          <Show when={holdable && disabled !== true && isDown()}>
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
                  "mask": `conic-gradient(from 0deg, black ${progressAngle()}deg, transparent ${progressAngle()}deg)`,
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
