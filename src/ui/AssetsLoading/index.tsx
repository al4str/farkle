import type { JSX } from "solid-js";
import { splitProps, Show } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/AssetsLoading/styles.module.css";

type Element = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children">;

export interface UiAssetsLoadingProps extends Element {
  visible: boolean;
  progress: number;
}

export function UiAssetsLoading(props: UiAssetsLoadingProps) {
  const [local, rest] = splitProps(props, ["class", "visible", "progress"]);

  const complete = () => {
    return local.progress === 1;
  };

  const angle = () => {
    return local.progress * 360;
  };

  return (
    <div
      {...rest}
      class={clsx(
        styles.root,
        props.visible ? styles.visible : styles.hidden,
        local.class,
      )}
    >
      <div class={styles.frame}>
        <div class={styles.canvas}>
          <span
            class={styles.base}
            style={{ display: complete() ? "none" : "block" }}
          />
          <span
            class={clsx(styles.base, styles.baseDone)}
            style={{ display: complete() ? "block" : "none" }}
          />
          <span
            class={styles.dial}
            style={{
              "-webkit-mask": `conic-gradient(from 0deg, black ${angle()}deg, transparent ${angle()}deg)`,
              "mask": `conic-gradient(from 0deg, black ${angle()}deg, transparent ${angle()}deg)`,
            }}
          >
            <span class={styles.indicator} />
            <span class={clsx(styles.text, styles.textDone, styles.spin)} />
          </span>
          <span
            class={styles.dial}
            style={{
              "-webkit-mask": `conic-gradient(from 0deg, transparent ${angle()}deg, black ${angle()}deg)`,
              "mask": `conic-gradient(from 0deg, transparent ${angle()}deg, black ${angle()}deg)`,
            }}
          >
            <span class={clsx(styles.text, styles.textIdle, styles.spin)} />
          </span>
          <span
            class={styles.top}
            style={{ display: complete() ? "none" : "block" }}
          />
          <Show when={complete()}>
            <span class={styles.topDone} />
          </Show>
        </div>
      </div>
    </div>
  );
}
