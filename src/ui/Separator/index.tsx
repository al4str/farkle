import type { JSX } from "solid-js";
import { splitProps, Show } from "solid-js";
import { clsx } from "clsx";

import { UiAssetsImage } from "src/ui/AssetsImage";

import styles from "src/ui/Separator/styles.module.css";

type Element = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children">;

interface Props extends Element {
  variant?: "horizontal" | "vertical";
}

export function UiSeparator(props: Props) {
  const [local, rest] = splitProps(props, ["class", "variant"]);

  const isVertical = () => {
    return local.variant === "vertical";
  };

  return (
    <Show
      when={isVertical()}
      fallback={(
        <UiAssetsImage
          {...rest}
          class={clsx(styles.separator, styles.vertical, local.class)}
          asset="separator_horizontal"
        />
      )}
    >
      <UiAssetsImage
        {...rest}
        class={clsx(styles.separator, styles.horizontal, local.class)}
        asset="separator_vertical"
      />
    </Show>
  );
}
