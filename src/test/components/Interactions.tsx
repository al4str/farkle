import { createSignal, onCleanup, onMount, For } from "solid-js";

import type { InteractionEvent, InteractionsDefinition } from "src/interactions/types";
import { interactionsState } from "src/interactions/state";
import { interactionsOnAny } from "src/interactions";
import { UiButton } from "src/ui/Button";
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
    const off = interactionsOnAny((event) => {
      if (event.type === "holdprogress") {
        return;
      }
      setLog((prev) => [formatEvent(event), ...prev].slice(0, LOG_LIMIT));
    });
    onCleanup(() => {
      off();
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
          {(action) => (
            <UiButton
              class={styles["demo-action"]}
              label={action.label}
              definition={action.definition}
            />
          )}
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
