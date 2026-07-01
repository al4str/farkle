import type { JSX } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/FrameSimple/styles.module.css";

export interface UiFrameSimpleProps {
  class?: string;
  children: JSX.Element;
}

export function UiFrameSimple(props: UiFrameSimpleProps) {
  return (
    <section class={clsx(styles.section, props.class)}>
      <span class={styles.background} />
      <main class={styles.main}>
        {props.children}
      </main>
    </section>
  );
}
