import type { InteractionsActionId, InteractionsDispatch, InteractionsPointerHandlers } from "src/interactions/types";

export function interactionsPointerHandlers(dispatch: InteractionsDispatch, actionId: InteractionsActionId): InteractionsPointerHandlers {
  return {
    onPointerDown: (event: PointerEvent): void => {
      dispatch.pressPointer(actionId, event.button, dispatch.now());
    },
    onPointerUp: (event: PointerEvent): void => {
      dispatch.releasePointer(actionId, event.button, dispatch.now());
    },
    onPointerLeave: (): void => {
      dispatch.releaseAllPointers(actionId, dispatch.now());
    },
    onPointerCancel: (): void => {
      dispatch.releaseAllPointers(actionId, dispatch.now());
    },
  };
}
