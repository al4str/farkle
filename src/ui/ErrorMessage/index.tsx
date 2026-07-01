import type { JSX } from "solid-js";

import { errorMessageToString } from "src/utils/errorMessage";
import { UiGenericMessage } from "src/ui/GenericMessage";

import styles from "src/ui/ErrorMessage/styles.module.css";

export interface UiErrorMessageProps {
  class?: string;
  error: unknown;
  children?: JSX.Element;
}

export function UiErrorMessage(props: UiErrorMessageProps) {
  const message = () => {
    return errorMessageToString(props.error);
  };

  return (
    <UiGenericMessage
      class={props.class}
      iconName="icon_painted_skull"
    >
      <p class={styles.message}>
        {message()}
      </p>
      {props.children}
    </UiGenericMessage>
  );
}
