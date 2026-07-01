import { A } from "@solidjs/router";

import styles from "src/routes/components/NavBar/styles.module.css";

export function RoutesNavBar() {
  return (
    <nav class={styles["nav-bar"]}>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/test/canvas"
      >
        Canvas
      </A>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/test/kitchen-sink"
      >
        Kitchen Sink
      </A>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/lobby"
      >
        Game screen
      </A>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/stats"
      >
        Data loading
      </A>
    </nav>
  );
}
