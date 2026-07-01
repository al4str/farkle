import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/FrameFancy/styles.module.css";

export interface UiFrameFancyProps {
  class?: string;
  stretch?: boolean;
  center?: boolean;
  padding?: boolean;
  gap?: boolean;
  header?: JSX.Element;
  children: JSX.Element;
}

export function UiFrameFancy(props: UiFrameFancyProps) {
  const stretch = () => {
    return props.stretch === true;
  };
  const center = () => {
    return props.center !== false;
  };
  const padding = () => {
    return props.padding !== false;
  };
  const gap = () => {
    return props.gap !== false;
  };

  return (
    <section
      class={clsx(styles.section, props.class)}
      data-stretch={stretch() ? "" : undefined}
    >
      <span class={styles.shadow} />
      <Show when={props.header}>
        {(header) => (
          <header class={styles.header}>
            <h2 class={styles.headerTitle}>
              {header()}
            </h2>
          </header>
        )}
      </Show>
      <main
        class={styles.main}
        data-gap={gap() ? "" : undefined}
        data-center={center() ? "" : undefined}
        data-padding={padding() ? "" : undefined}
      >
        {props.children}
      </main>
      <span class={styles.frame} />
    </section>
  );
}
