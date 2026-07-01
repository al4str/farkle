import type { JSX } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/Title/styles.module.css";

const ORNAMENTS = {
  chalk: "/assets/images/ui/title_ornament_chalk.webp",
  yellow: "/assets/images/ui/title_ornament_yellow.webp",
  red: "/assets/images/ui/title_ornament_red.webp",
} as const;

const ORNAMENT_HEIGHT = 124;

interface Props {
  class?: string;
  variant: "chalk" | "yellow" | "red";
  children: JSX.Element;
}

export function UiTitle(props: Props) {
  const getImage = () => {
    return ORNAMENTS[props.variant];
  };

  const getOffset = () => {
    if (props.variant === "chalk") {
      return undefined;
    }
    return `translateY(calc(50% - ${ORNAMENT_HEIGHT / 1.5}px))`;
  };

  return (
    <header
      class={clsx(styles.header, props.class)}
      data-variant={props.variant}
    >
      <span
        class={styles.ornamentLeft}
        style={{
          "background-image": `url("${getImage()}")`,
          "transform": getOffset(),
        }}
      />
      <h1 class={styles.title}>
        {props.children}
      </h1>
      <span
        class={styles.ornamentRight}
        style={{
          "background-image": `url("${getImage()}")`,
          "transform": getOffset(),
        }}
      />
    </header>
  );
}
