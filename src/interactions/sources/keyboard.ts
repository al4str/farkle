import type { InteractionsDispatch, InteractionsKeyModifiers, InteractionsKeyModifiersState } from "src/interactions/types";

export interface InteractionsKeyboardListeners {
  attach: () => void;
  detach: () => void;
}

export function interactionsKeyboardListen(dispatch: InteractionsDispatch): InteractionsKeyboardListeners {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) {
      return;
    }
    dispatch.pressKey(event.code, interactionsKeyboardModifierState(event), dispatch.now(), event);
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    dispatch.releaseKey(event.code, dispatch.now(), event);
  };

  const onBlur = (): void => {
    dispatch.releaseAllKeys(dispatch.now());
  };

  return {
    attach: (): void => {
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("blur", onBlur);
    },
    detach: (): void => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    },
  };
}

export function interactionsKeyboardModifiersMatch(modifiers: undefined | InteractionsKeyModifiers, modifiersState: InteractionsKeyModifiersState): boolean {
  return (modifiers?.shift ?? false) === modifiersState.shift
    && (modifiers?.ctrl ?? false) === modifiersState.ctrl
    && (modifiers?.alt ?? false) === modifiersState.alt
    && (modifiers?.meta ?? false) === modifiersState.meta;
}

function interactionsKeyboardModifierState(event: KeyboardEvent): InteractionsKeyModifiersState {
  return {
    shift: event.shiftKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    meta: event.metaKey,
  };
}
