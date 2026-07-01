import type { JSX } from "solid-js";
import { ErrorBoundary } from "solid-js";

import { i18nTranslate } from "src/i18n/translation";
import { UiErrorMessage } from "src/ui/ErrorMessage";
import { UiButton } from "src/ui/Button";
import styles from "src/game/components/ErrorBoundary/styles.module.css";

export interface GameErrorBoundaryProps {
  children: JSX.Element;
}

export function GameErrorBoundary(props: GameErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error: unknown) => {
        console.error("[GameErrorBoundary]", error);
        return (
          <div class={styles.fallback}>
            <UiErrorMessage error={error} />
            <UiButton
              label={i18nTranslate("common.action.retry")}
              actionId="game.error.retry"
              code="KeyR"
              onClick={() => {
                window.location.reload();
              }}
            />
          </div>
        );
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
