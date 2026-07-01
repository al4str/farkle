import type { GameRng } from "src/game/helpers/rng";

interface Params {
  amount: number;
  width: number;
  radius: number;
  gap: number;
  rng: GameRng;
}

export interface Placement {
  x: number;
  z: number;
  size: number;
  angle: number;
}

export function placeIntoRadius(params: Params): Placement[] {
  if (params.amount === 0) {
    return [];
  }
  for (let attempt = 0; attempt < 10; attempt++) {
    const placements = generateAndRelax(params);
    if (!hasOverlaps(placements, params.gap)) {
      return placements;
    }
  }
  return generateAndRelax(params);
}

function hasOverlaps(placements: Placement[], gap: number): boolean {
  for (const [i, si] of placements.entries()) {
    for (const sj of placements.slice(i + 1)) {
      if (satOverlap(si, sj, gap)) {
        return true;
      }
    }
  }
  return false;
}

function generateAndRelax(params: Params): Placement[] {
  const { amount, width, radius, gap, rng } = params;
  const placements: Placement[] = [];
  if (amount === 1) {
    const a = rng() * Math.PI * 2;
    const maxR = Math.max(0, radius - width * Math.SQRT2 * 0.5);
    const r = rng() * maxR * 0.4;
    placements.push({
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      size: width,
      angle: rng() * Math.PI * 2,
    });
  }
  else {
    const sector = (Math.PI * 2) / amount;
    const base = rng() * Math.PI * 2;
    for (let i = 0; i < amount; i++) {
      const effR = width * Math.SQRT2 * 0.5;
      const maxR = Math.max(0, radius - effR);
      const center = base + sector * i;
      const jitter = (rng() - 0.5) * sector * 0.6;
      const minR = effR * 0.3;
      const r = minR + (maxR - minR) * rng() * 0.8;
      placements.push({
        x: Math.cos(center + jitter) * r,
        z: Math.sin(center + jitter) * r,
        size: width,
        angle: rng() * Math.PI * 2,
      });
    }
  }
  for (let iter = 0; iter < 80; iter++) {
    let settled = true;
    for (const [i, si] of placements.entries()) {
      for (const sj of placements.slice(i + 1)) {
        const hit = satOverlap(si, sj, gap);
        if (!hit) {
          continue;
        }
        settled = false;
        const push = hit.depth * 0.75;
        si.x -= hit.ax * push;
        si.z -= hit.az * push;
        sj.x += hit.ax * push;
        sj.z += hit.az * push;
      }
    }
    for (const sq of placements) {
      const maxR = Math.max(0, radius - sq.size * Math.SQRT2 * 0.5);
      const d = Math.sqrt(sq.x * sq.x + sq.z * sq.z);
      if (d > maxR && d > 0) {
        sq.x *= maxR / d;
        sq.z *= maxR / d;
      }
    }
    if (settled) {
      break;
    }
  }
  return placements;
}

type Corner = [number, number];

type Quad = [Corner, Corner, Corner, Corner];

function cornersOf(x: number, z: number, size: number, angle: number, inflate: number): Quad {
  const half = (size + inflate) / 2;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [x + c * -half - s * -half, z + s * -half + c * -half],
    [x + c * half - s * -half, z + s * half + c * -half],
    [x + c * half - s * half, z + s * half + c * half],
    [x + c * -half - s * half, z + s * -half + c * half],
  ];
}

function projectOnAxis(corners: Corner[], ax: number, az: number): [number, number] {
  let min = Infinity, max = -Infinity;
  for (const [cx, cz] of corners) {
    const p = cx * ax + cz * az;
    if (p < min) {
      min = p;
    }
    if (p > max) {
      max = p;
    }
  }
  return [min, max];
}

interface Overlap {
  depth: number;
  ax: number;
  az: number;
}

function satOverlap(a: Placement, b: Placement, gap: number): null | Overlap {
  const ca = cornersOf(a.x, a.z, a.size, a.angle, gap);
  const cb = cornersOf(b.x, b.z, b.size, b.angle, gap);
  let minDepth = Infinity, bestAx = 0, bestAz = 0;

  for (const corners of [ca, cb]) {
    const [c0, c1, c2, c3] = corners;
    const edges: Array<[Corner, Corner]> = [[c0, c1], [c1, c2], [c2, c3], [c3, c0]];
    for (const [ci, cj] of edges) {
      const ex = cj[0] - ci[0];
      const ez = cj[1] - ci[1];
      const len = Math.sqrt(ex * ex + ez * ez);
      if (len === 0) {
        continue;
      }
      const nx = -ez / len, nz = ex / len;
      const [minA, maxA] = projectOnAxis(ca, nx, nz);
      const [minB, maxB] = projectOnAxis(cb, nx, nz);
      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
      if (overlap <= 0) {
        return null;
      }
      if (overlap < minDepth) {
        minDepth = overlap;
        const dx = b.x - a.x, dz = b.z - a.z;
        const dot = dx * nx + dz * nz;
        bestAx = dot >= 0 ? nx : -nx;
        bestAz = dot >= 0 ? nz : -nz;
      }
    }
  }
  return {
    depth: minDepth,
    ax: bestAx,
    az: bestAz,
  };
}
