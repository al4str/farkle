import { createSignal, onCleanup, onMount, For } from "solid-js";

import type { InteractionEvent, InteractionsActionDefinition } from "src/interactions/types";
import { interactionsActionHandlers, interactionsDefineAction, interactionsOn, interactionsRemoveAction, interactionsView } from "src/interactions";
import { interactionsState } from "src/interactions/state";
import styles from "src/test/components/Interactions.module.css";

interface DemoAction {
  def: InteractionsActionDefinition;
  label: string;
  hint: string;
}

const DEMO_ACTIONS: readonly DemoAction[] = [
  {
    label: "Click",
    hint: "key C / left click",
    def: {
      id: "demo.click",
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
    label: "Double-click",
    hint: "key D / left click",
    def: {
      id: "demo.double",
      bindings: [
        {
          kind: "key",
          code: "KeyD",
        },
        {
          kind: "pointer",
          button: 0,
        },
      ],
    },
  },
  {
    label: "Hold (0.6s)",
    hint: "key H / left click",
    def: {
      id: "demo.hold",
      holdThreshold: 0.6,
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
    def: {
      id: "demo.shift",
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
    def: {
      id: "demo.multi",
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

const LOG_LIMIT = 8;

export function TestInteractions() {
  const [log, setLog] = createSignal<readonly string[]>([]);

  onMount(() => {
    for (const action of DEMO_ACTIONS) {
      interactionsDefineAction(action.def);
    }
    const off = interactionsOn((event) => {
      if (event.type === "holdprogress") {
        return;
      }
      setLog((prev) => [formatEvent(event), ...prev].slice(0, LOG_LIMIT));
    });
    onCleanup(() => {
      off();
      for (const action of DEMO_ACTIONS) {
        interactionsRemoveAction(action.def.id);
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
        <For each={DEMO_ACTIONS}>
          {(action) => {
            const view = () => interactionsView(action.def.id);
            return (
              <button
                {...interactionsActionHandlers(action.def.id)}
                type="button"
                class={styles["demo-action"]}
                classList={{
                  [styles.pressed]: view().pressed,
                  [styles.holding]: view().holding,
                }}
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
                      width: `${Math.round(view().holdProgress * 100)}%`,
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
            <li class={styles["demo-log-empty"]}>interact to see events…</li>
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
