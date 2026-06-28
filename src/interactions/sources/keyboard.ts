import type { InteractionsDevice, InteractionsModifierSpec, InteractionsSourceId } from "src/interactions/types";

export interface InteractionsKeyboardCandidate {
  sourceId: InteractionsSourceId;
  modifiers?: InteractionsModifierSpec;
}

export interface InteractionsKeyboardDeps {
  lookupCode: (code: string) => readonly InteractionsKeyboardCandidate[];
  allKeySources: () => readonly InteractionsSourceId[];
  now: () => number;
  activate: (source: InteractionsSourceId, device: InteractionsDevice, now: number) => void;
  deactivate: (source: InteractionsSourceId, device: InteractionsDevice, now: number, synthetic: boolean) => void;
}

export interface InteractionsKeyboardListeners {
  attach: () => void;
  detach: () => void;
}

const DEVICE: InteractionsDevice = "keyboardMouse";

export function interactionsKeyboardCreate(deps: InteractionsKeyboardDeps): InteractionsKeyboardListeners {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) {
      return;
    }
    const now = deps.now();
    for (const candidate of deps.lookupCode(event.code)) {
      if (interactionsKeyboardMatchModifiers(candidate.modifiers, event)) {
        deps.activate(candidate.sourceId, DEVICE, now);
      }
    }
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    const now = deps.now();
    for (const candidate of deps.lookupCode(event.code)) {
      deps.deactivate(candidate.sourceId, DEVICE, now, false);
    }
  };

  const onBlur = (): void => {
    const now = deps.now();
    for (const source of deps.allKeySources()) {
      deps.deactivate(source, DEVICE, now, true);
    }
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

export function interactionsKeyboardMatchModifiers(spec: undefined | InteractionsModifierSpec, event: KeyboardEvent,): boolean {
  return (spec?.shift === true) === event.shiftKey && (spec?.ctrl === true) === event.ctrlKey && (spec?.alt === true) === event.altKey && (spec?.meta === true) === event.metaKey;
}
