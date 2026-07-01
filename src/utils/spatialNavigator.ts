import { Vector3 } from "three/webgpu";

// Screen-to-world mapping on the X-Z board plane: the camera looks from +Z
// downward, so screen-up is world -Z and screen-right is world +X. Tweak here
// if the axis mapping ever feels wrong.
const DIRECTION_VECTORS: Record<SpatialNavigatorDirection, DirectionVector> = {
  up: { x: 0, z: -1 },
  down: { x: 0, z: 1 },
  left: { x: -1, z: 0 },
  right: { x: 1, z: 0 },
};

// Lateral drift costs more than forward distance, biasing toward dice that
// sit "straight ahead". The primary tuning knob of the default algorithm.
const PERPENDICULAR_WEIGHT = 2.0;

// Candidates must be strictly in front of the current die; rejects
// coincident positions.
const EPS = 1e-6;

const CURRENT_SCRATCH = new Vector3();

const CANDIDATE_SCRATCH = new Vector3();

export type SpatialNavigatorDirection = "up" | "down" | "left" | "right";

interface DirectionVector {
  x: number;
  z: number;
}

interface ObjectLike {
  getWorldPosition: (target: Vector3) => Vector3;
}

interface Params<T extends ObjectLike> {
  items: T[];
  isFocusable: (object: T, index: number) => boolean;
}

interface Results {
  next: (direction: SpatialNavigatorDirection, current: null | number) => null | number;
}

export function spatialNavigatorCreate<T extends ObjectLike>(params: Params<T>): Results {
  return {
    next: (direction, current) => {
      const directionVector = DIRECTION_VECTORS[direction];
      const currentObject = current === null ? undefined : params.items[current];
      if (currentObject === undefined) {
        return coldStart(params, directionVector);
      }
      currentObject.getWorldPosition(CURRENT_SCRATCH);

      let best: null | number = null;
      let bestScore = Infinity;
      for (const [i, object] of params.items.entries()) {
        if (i === current || !params.isFocusable(object, i)) {
          continue;
        }
        object.getWorldPosition(CANDIDATE_SCRATCH);
        const vx = CANDIDATE_SCRATCH.x - CURRENT_SCRATCH.x;
        const vz = CANDIDATE_SCRATCH.z - CURRENT_SCRATCH.z;
        // Half-plane filter: only dice strictly ahead in the travel direction.
        const along = vx * directionVector.x + vz * directionVector.z;
        if (along <= EPS) {
          continue;
        }
        const perp = Math.abs(vx * -directionVector.z + vz * directionVector.x);
        const score = along + PERPENDICULAR_WEIGHT * perp;
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      }
      return best;
    },
  };
}

// With nothing focused, enter from the edge: pick the focusable die with the
// minimum projection along the travel direction (the die "furthest behind"),
// so the first press sweeps across the whole field.
function coldStart<T extends ObjectLike>(params: Params<T>, directionVector: DirectionVector): null | number {
  let best: null | number = null;
  let bestAlong = Infinity;
  for (const [i, object] of params.items.entries()) {
    if (!params.isFocusable(object, i)) {
      continue;
    }
    object.getWorldPosition(CANDIDATE_SCRATCH);
    const along = CANDIDATE_SCRATCH.x * directionVector.x + CANDIDATE_SCRATCH.z * directionVector.z;
    if (along < bestAlong) {
      bestAlong = along;
      best = i;
    }
  }
  return best;
}
