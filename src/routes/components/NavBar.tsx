import { A } from "@solidjs/router";

import styles from "src/routes/components/NavBar.module.css";

export function RoutesNavBar() {
  return (
    <nav class={styles["nav-bar"]}>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        end={true}
        href="/"
      >
        Test
      </A>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/lobby"
      >
        Lobby
      </A>
      <A
        class={styles["nav-link"]}
        activeClass={styles["is-active"]}
        href="/stats"
      >
        Stats
      </A>
    </nav>
  );
}
