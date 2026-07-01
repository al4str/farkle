import type { JSX } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/GenericOverlay/styles.module.css";

export interface UiGenericOverlayProps {
  class?: undefined | string;
  /** Whether the overlay is shown. Defaults to `true`. */
  open?: undefined | boolean;
  /** Modal overlays sit in the top layer, trap focus and dim the page. Defaults to `true`. */
  modal?: undefined | boolean;
  /** Fired whenever the underlying dialog closes. */
  onClose?: undefined | (() => void);
  children: JSX.Element;
}

export function UiGenericOverlay(props: UiGenericOverlayProps) {
  const [dialog, setDialog] = createSignal<undefined | HTMLDialogElement>(undefined);

  const isOpen = () => props.open ?? true;
  const isModal = () => props.modal ?? true;

  createEffect(() => {
    const element = dialog();
    if (!element) {
      return;
    }
    if (isOpen()) {
      if (!element.open) {
        if (isModal()) {
          element.showModal();
        }
        else {
          element.show();
        }
      }
    }
    else if (element.open) {
      element.close();
    }
  });

  return (
    <dialog
      ref={setDialog}
      class={clsx(styles.overlay, props.class)}
      onClose={() => {
        props.onClose?.();
      }}
      onCancel={(event) => {
        // Dismissal is driven by the `open` prop, not native Escape, so the
        // game's own interaction bindings stay the single source of truth.
        event.preventDefault();
      }}
    >
      {props.children}
    </dialog>
  );
}
