import type { InteractionsDispatch } from "src/interactions/types";

/**
 * Gamepad source stub
 *
 * Should run once per frame from `interactionsUpdate(delta, elapsed)`:
 * - read `navigator.getGamepads()`
 * - for each connected pad, diff `buttons[b].pressed` against previous frame
 * - on 0->1 edge, dispatch press for actions bound to that pad button
 * - on 1->0 edge, dispatch matching release
 *
 * Would require gamepad binding kind + pad-aware dispatch methods on `InteractionsDispatch`
 */
export function interactionsGamepadPoll(_elapsed: number, _dispatch: InteractionsDispatch): void {
  // TBD
}
