import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { clsx } from "clsx";

import { loopTimerGetState } from "src/loop/timer";

import styles from "src/game/components/Timer/styles.module.css";

type Props = JSX.HTMLAttributes<HTMLDivElement>;

export function GameTimer(props: Props) {
  const [local, rest] = splitProps(props, ["class"]);
  const state = loopTimerGetState();
  const isHidden = () => state.isHidden();
  const getAngle = () => state.getProgress() * 360;

  return (
    <div
      {...rest}
      class={clsx(styles.timer, local.class)}
      data-hidden={isHidden()}
    >
      <span class={styles.track} />
      <span
        class={styles.indicatorMask}
        style={{
          mask: `conic-gradient(from 0deg, black ${getAngle()}deg, transparent ${getAngle()}deg)`,
        }}
      >
        <span class={styles.indicator} />
      </span>
      <span class={styles.hourglass} />
    </div>
  );
}
