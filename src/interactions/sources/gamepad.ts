import type { InteractionsDevice, InteractionsSourceId } from "src/interactions/types";

export interface InteractionsGamepadDeps {
  activate: (source: InteractionsSourceId, device: InteractionsDevice, now: number) => void;
  deactivate: (source: InteractionsSourceId, device: InteractionsDevice, now: number, synthetic: boolean) => void;
}

// const DEVICE: InteractionsDevice = "gamepad";

/**
 * Gamepad source stub
 *
 * When implemented, `interactionsGamepadPoll` runs once per frame from `interactionsUpdate(delta, elapsed)`:
 * - read `navigator.getGamepads()`
 * - for each connected pad `i`, diff its `buttons[b].pressed` against the previous frame
 * - on a 0->1 edge call `deps.activate("pad:" + i + ":" + b, "gamepad", now)`
 * - on a 1->0 edge call `deps.deactivate(...)`
 * - axes-as-buttons (e.g. stick past a deadzone) map to the same source-id scheme, e.g. `"pad:0:axis:1+"`
 */
export function interactionsGamepadPoll(_elapsed: number, _deps: InteractionsGamepadDeps): void {
  // TBD
}
