import { createEffect } from "solid-js";
import styles from "src/routes/components/PageError/styles.module.css";

export interface RoutesPageErrorProps {
  error: unknown;
  title?: string;
  reset: () => void;
}

export function RoutesPageError(props: RoutesPageErrorProps) {
  createEffect(() => {
    console.error(props.error);
  });

  return (
    <div
      class={styles["route-error"]}
      role="alert"
    >
      <h2 class={styles["route-error-title"]}>
        {props.title ?? "Something went wrong"}
      </h2>
      <p class={styles["route-error-message"]}>{
        getMessageFromError(props.error)}
      </p>
      <button
        class="control-button"
        type="button"
        onClick={() => props.reset()}
      >
        Try again
      </button>
    </div>
  );
}

function getMessageFromError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
}
