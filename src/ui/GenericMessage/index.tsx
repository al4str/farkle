import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { clsx } from "clsx";

import type { UiAssetsImageName } from "src/ui/AssetsImage";
import { UiAssetsImage } from "src/ui/AssetsImage";

import styles from "src/ui/GenericMessage/styles.module.css";

// --- Stubs: replace with real wiring ---
const PLAYER_ICONS_SIZE = 96;
// --- End stubs ---

export interface UiGenericMessageProps {
  class?: undefined | string;
  iconName: UiAssetsImageName;
  message?: undefined | string;
  children?: undefined | JSX.Element;
}

export function UiGenericMessage(props: UiGenericMessageProps) {
  return (
    <div class={clsx(styles.root, props.class)}>
      <UiAssetsImage
        class={styles.icon}
        asset={props.iconName}
        style={{
          width: `${PLAYER_ICONS_SIZE}px`,
          height: `${PLAYER_ICONS_SIZE}px`,
        }}
      />
      <Show when={props.message}>
        {(message) => (
          <p class={styles.message}>
            {message()}
          </p>
        )}
      </Show>
      <Show when={props.children}>
        {props.children}
      </Show>
    </div>
  );
}
