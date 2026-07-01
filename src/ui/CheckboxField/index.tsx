import { clsx } from "clsx";

import { UiAssetsImage } from "src/ui/AssetsImage";

import styles from "src/ui/CheckboxField/styles.module.css";

export interface UiCheckboxFieldProps {
  class?: string;
  disabled?: boolean;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function UiCheckboxField(props: UiCheckboxFieldProps) {
  return (
    <label class={clsx(styles.field, props.class)}>
      <input
        class={styles.input}
        type="checkbox"
        disabled={props.disabled}
        checked={props.value}
        onChange={(event) => {
          props.onChange(event.currentTarget.checked);
        }}
      />
      <UiAssetsImage
        class={clsx(!props.value && styles.tickOff)}
        asset="icon_green_tick"
        style={{
          width: "32px",
          height: "32px",
        }}
      />
      <span class={styles.label}>
        {props.label}
      </span>
    </label>
  );
}
