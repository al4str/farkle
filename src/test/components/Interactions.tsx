import { clsx } from "clsx";
import { createSignal, onCleanup, onMount, For } from "solid-js";

import type { InteractionEvent, InteractionsDefinition } from "src/interactions/types";
import { noop } from "src/utils/noop";
import { interactionsState } from "src/interactions/state";
import { interactionsOnAny, interactionsDefine, interactionsRemove, interactionsGetHandlers, interactionsGetState } from "src/interactions";
import styles from "src/test/components/Interactions.module.css";

interface ActionItem {
  definition: InteractionsDefinition;
  label: string;
  hint: string;
}

const ACTION_ITEMS: readonly ActionItem[] = [
  {
    label: "Click",
    hint: "key C / left click",
    definition: {
      actionId: "demo.click",
      bindings: [
        {
          kind: "key",
          code: "KeyC",
        },
        {
          kind: "pointer",
          button: 0,
        },
      ],
    },
  },
  {
    label: "Hold (1.5s)",
    hint: "key H / left click",
    definition: {
      actionId: "demo.hold",
      holdTime: 1.5,
      bindings: [
        {
          kind: "key",
          code: "KeyH",
        },
        {
          kind: "pointer",
          button: 0,
        },
      ],
    },
  },
  {
    label: "Shift + S",
    hint: "key S with Shift",
    definition: {
      actionId: "demo.shift",
      bindings: [
        {
          kind: "key",
          code: "KeyS",
          modifiers: {
            shift: true,
          },
        },
      ],
    },
  },
  {
    label: "Multi (Space + click)",
    hint: "Space and/or left click",
    definition: {
      actionId: "demo.multi",
      bindings: [
        {
          kind: "key",
          code: "Space",
        },
        {
          kind: "pointer",
          button: 0,
        },
      ],
    },
  },
];

const LOG_LIMIT = 64;

export function TestInteractions() {
  const [log, setLog] = createSignal<readonly string[]>([]);

  onMount(() => {
    for (const item of ACTION_ITEMS) {
      interactionsDefine(item.definition);
    }
    const off = interactionsOnAny((event) => {
      if (event.type === "holdprogress") {
        return;
      }
      setLog((prev) => [formatEvent(event), ...prev].slice(0, LOG_LIMIT));
    });
    onCleanup(() => {
      off();
      for (const item of ACTION_ITEMS) {
        interactionsRemove(item.definition.actionId);
      }
    });
  });

  return (
    <section class={styles["interactions-demo"]}>
      <div class="control-label">
        <span>
          Interactions demo
        </span>
        <span class={styles["device-badge"]}>
          {interactionsState.lastDevice}
        </span>
      </div>
      <div class="demo-grid">
        <For each={ACTION_ITEMS}>
          {(action) => {
            const view = () => interactionsGetState(action.definition.actionId);
            return (
              <button
                {...interactionsGetHandlers(action.definition.actionId)}
                class={clsx(
                  styles["demo-action"],
                  view().pressed && styles["pressed"],
                  view().holding && styles["holding"],
                )}
                type="button"
                onClick={noop}
              >
                <span class={styles["demo-action-label"]}>
                  {action.label}
                </span>
                <span class={styles["demo-action-hint"]}>
                  {action.hint}
                </span>
                <span class={styles["demo-meter"]}>
                  <span
                    class={styles["demo-bar"]}
                    style={{
                      width: `${Math.round(view().holdingProgress * 100)}%`,
                    }}
                  />
                </span>
              </button>
            );
          }}
        </For>
      </div>
      <ol class={styles["demo-log"]}>
        <For
          each={log()}
          fallback={
            <li class={styles["demo-log-empty"]}>
              interact to see events…
            </li>
          }
        >
          {(line) => (
            <li>
              {line}
            </li>
          )}
        </For>
      </ol>
    </section>
  );
}

function formatEvent(event: InteractionEvent): string {
  const id = event.actionId.replace("demo.", "");
  if (event.type === "holdprogress") {
    return `${id} · holdprogress ${Math.round(event.progress * 100)}%`;
  }
  return `${id} · ${event.type}`;
}
