import { clsx } from "clsx";

import { UiAssetsImage } from "src/ui/AssetsImage";

import styles from "src/ui/Placeholder/styles.module.css";

export interface UiPlaceholderProps {
  class?: string;
}

export function UiPlaceholder(props: UiPlaceholderProps) {
  return (
    <UiAssetsImage
      class={clsx(styles.placeholder, props.class)}
      shadow={false}
      asset="placeholder"
      style={{
        width: "18px",
        height: "16px",
      }}
    />
  );
}
