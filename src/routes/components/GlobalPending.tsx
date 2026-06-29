import { Show } from "solid-js";
import { useIsRouting } from "@solidjs/router";

import styles from "src/routes/components/GlobalPending.module.css";

export function RoutesGlobalPending() {
  const isRouting = useIsRouting();

  return (
    <Show when={isRouting()}>
      <output
        class={styles["global-pending"]}
        aria-label="Loading route"
      >
        <span class={styles["global-pending-bar"]} />
      </output>
    </Show>
  );
}
