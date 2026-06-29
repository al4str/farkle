import type { JSX } from "solid-js";
import { mergeProps, splitProps, onCleanup, onMount, Show } from "solid-js";
import { clsx } from "clsx";

import type { InteractionsBinding, InteractionsDefinition } from "src/interactions/types";
import { interactionsDefine, interactionsGetHandlers, interactionsGetState, interactionsRemove } from "src/interactions";
import styles from "src/ui/Button.module.css";

const KEY_CODE_LABELS: Record<string, string> = {
  Space: "Space",
  Enter: "Enter",
  Escape: "Esc",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

const UI_BUTTON_DEFAULTS: Pick<UiButtonProps, "type" | "size"> = {
  type: "button",
  size: "long",
};

export type UiButtonSize = "long" | "small";

export interface UiButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: UiButtonSize;
  label?: string;
  definition: InteractionsDefinition;
}

export function UiButton(props: UiButtonProps) {
  const merged = mergeProps(UI_BUTTON_DEFAULTS, props);
  const [local, rest] = splitProps(merged, [
    "class",
    "disabled",
    "size",
    "label",
    "definition",
    "onContextMenu",
  ]);
  const { disabled, size, label, definition } = local;
  const { actionId, bindings, holdTime } = definition;
  const handlers = interactionsGetHandlers(actionId);

  const view = () => {
    return interactionsGetState(actionId);
  };

  const keyCap = () => {
    return keyCapOf(bindings);
  };

  const holdable = () => {
    return holdTime !== undefined;
  };

  const isDown = () => {
    return view().pressed && disabled !== true;
  };

  const progressAngle = () => {
    return view().holdingProgress * 360;
  };

  onMount(() => {
    interactionsDefine(definition);

    onCleanup(() => {
      interactionsRemove(actionId);
    });
  });

  return (
    <button
      {...rest}
      {...handlers}
      class={clsx(styles["ui-action-button"], local.class)}
      disabled={disabled}
      aria-disabled={disabled === true ? "true" : undefined}
      data-input-key={keyCap()?.code}
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
          <Show when={keyCap()}>
            {(cap) => (
              <span class={styles["ui-action-button--key-label"]}>
                {cap().label}
              </span>
            )}
          </Show>
          <Show when={holdable() && disabled !== true && !isDown()}>
            <span
              class={styles["ui-action-button--hold-preview"]}
              style={{
                "background-image": "url(/assets/images/ui/kb_hold_preview.webp)",
              }}
            />
          </Show>
          <Show when={holdable() && disabled !== true && isDown()}>
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

function keyCapOf(bindings: undefined | readonly InteractionsBinding[]): undefined | { code: string; label: string } {
  if (bindings === undefined) {
    return undefined;
  }
  for (const binding of bindings) {
    if (binding.kind === "key") {
      return {
        code: binding.code,
        label: humanizeKeyCode(binding.code),
      };
    }
  }
  return undefined;
}

function humanizeKeyCode(code: string): string {
  const known = KEY_CODE_LABELS[code];
  if (known !== undefined) {
    return known;
  }
  if (code.startsWith("Key")) {
    return code.slice(3);
  }
  if (code.startsWith("Digit")) {
    return code.slice(5);
  }
  return code;
}

function getKbImage(size: undefined | UiButtonSize): string {
  if (size === "small") {
    return "/assets/images/ui/kb_small.webp";
  }
  return "/assets/images/ui/kb_long.webp";
}
