import { Vector3 } from "three/webgpu";

import type { DiceValue } from "src/dice/data";

export const DICE_ROTATION_MAP = [
  [0, new Vector3(0, 0, -1)],
  [1, new Vector3(0, 1, 0)],
  [2, new Vector3(0, 0, -1)],
  [3, new Vector3(-1, 0, 0)],
  [4, new Vector3(1, 0, 0)],
  [5, new Vector3(0, 0, 1)],
  [6, new Vector3(0, -1, 0)],
  [666, new Vector3(0, 1, 0)],
] as const satisfies [DiceValue, Vector3][];
