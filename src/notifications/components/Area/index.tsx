import type { Accessor } from "solid-js";
import { createSignal, For, Show } from "solid-js";
import { clsx } from "clsx";

import type { ClientNotificationsData } from "src/notifications/components/Item";
import { NotificationsItem } from "src/notifications/components/Item";
import styles from "src/notifications/components/Area/styles.module.css";

// --- Stubs: replace with real wiring ---
interface ClientNotificationsItem {
  data: ClientNotificationsData;
  removing: boolean;
}

interface ClientNotificationsState {
  items: Accessor<ClientNotificationsItem[]>;
}

function useClientStateByKey(_key: "notifications"): ClientNotificationsState {
  const [items] = createSignal<ClientNotificationsItem[]>([]);
  return { items };
}
// --- End stubs ---

export interface NotificationsAreaProps {
  class?: string;
}

export function NotificationsArea(props: NotificationsAreaProps) {
  const { items } = useClientStateByKey("notifications");

  const hasItems = (): boolean => {
    return items().length > 0;
  };

  return (
    <ul
      class={clsx(styles.area, props.class)}
      role="log"
      aria-live="polite"
      data-visible={hasItems() ? "" : undefined}
    >
      <Show when={hasItems()}>
        <For each={items()}>
          {(item) => (
            <li
              class={styles.item}
              data-removing={item.removing ? "" : undefined}
            >
              <NotificationsItem data={item.data} />
            </li>
          )}
        </For>
      </Show>
    </ul>
  );
}
