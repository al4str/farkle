import type { InteractionsActionId, InteractionsDevice, InteractionsPointerHandlers, InteractionsSourceId } from "src/interactions/types";

export interface InteractionsPointerCandidate {
  sourceId: InteractionsSourceId;
  button?: number;
}

export interface InteractionsPointerDeps {
  now: () => number;
  pointerBindings: (actionId: InteractionsActionId) => readonly InteractionsPointerCandidate[];
  activate: (source: InteractionsSourceId, device: InteractionsDevice, now: number) => void;
  deactivate: (source: InteractionsSourceId, device: InteractionsDevice, now: number, synthetic: boolean) => void;
}

export interface InteractionsPointer {
  handlersFor: (actionId: InteractionsActionId) => InteractionsPointerHandlers;
}

const DEVICE: InteractionsDevice = "keyboardMouse";

export function interactionsPointerCreate(deps: InteractionsPointerDeps): InteractionsPointer {
  const deactivateAll = (actionId: InteractionsActionId, synthetic: boolean): void => {
    const now = deps.now();
    for (const candidate of deps.pointerBindings(actionId)) {
      deps.deactivate(candidate.sourceId, DEVICE, now, synthetic);
    }
  };

  return {
    handlersFor: (actionId: InteractionsActionId): InteractionsPointerHandlers => {
      return {
        onPointerDown: (event: PointerEvent): void => {
          const now = deps.now();
          for (const candidate of deps.pointerBindings(actionId)) {
            if (buttonMatches(candidate, event.button)) {
              deps.activate(candidate.sourceId, DEVICE, now);
            }
          }
        },
        onPointerUp: (event: PointerEvent): void => {
          const now = deps.now();
          for (const candidate of deps.pointerBindings(actionId)) {
            if (buttonMatches(candidate, event.button)) {
              deps.deactivate(candidate.sourceId, DEVICE, now, false);
            }
          }
        },
        onPointerLeave: (): void => {
          deactivateAll(actionId, true);
        },
        onPointerCancel: (): void => {
          deactivateAll(actionId, true);
        },
      };
    },
  };
}

function buttonMatches(candidate: InteractionsPointerCandidate, button: number): boolean {
  return candidate.button === undefined || candidate.button === button;
}
