import type { JSX } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/Title/styles.module.css";

export type UiTitleVariant = "chalk" | "yellow" | "red";

const ORNAMENTS = {
  chalk: "/assets/images/ui/title_ornament_chalk.webp",
  yellow: "/assets/images/ui/title_ornament_yellow.webp",
  red: "/assets/images/ui/title_ornament_red.webp",
} as const;

const ORNAMENT_HEIGHT = 124;

export interface UiTitleProps {
  class?: string;
  variant: UiTitleVariant;
  children: JSX.Element;
}

export function UiTitle(props: UiTitleProps) {
  const image = () => {
    return ORNAMENTS[props.variant];
  };
  const verticalOffset = () => {
    if (props.variant === "chalk") {
      return undefined;
    }
    return `translateY(calc(50% - ${ORNAMENT_HEIGHT / 1.5}px))`;
  };

  return (
    <header class={clsx(styles.header, props.class)} data-variant={props.variant}>
      <span
        class={styles.ornamentLeft}
        style={{
          "background-image": `url("${image()}")`,
          "transform": verticalOffset(),
        }}
      />
      <h1 class={styles.title}>
        {props.children}
      </h1>
      <span
        class={styles.ornamentRight}
        style={{
          "background-image": `url("${image()}")`,
          "transform": verticalOffset(),
        }}
      />
    </header>
  );
}
