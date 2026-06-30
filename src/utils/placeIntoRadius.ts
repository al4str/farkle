export interface Square {
  x: number;
  z: number;
  size: number;
  angle: number;
}

type Corner = [number, number];

interface Overlap {
  depth: number;
  ax: number;
  az: number;
}

export function placeIntoRadius(
  count: number,
  sideLen: number,
  radius: number,
  gap: number,
  rng: () => number,
): Square[] {
  if (count === 0) return [];
  for (let attempt = 0; attempt < 10; attempt++) {
    const squares = generateAndRelax(count, sideLen, radius, gap, rng);
    if (!hasOverlaps(squares, gap)) return squares;
  }
  return generateAndRelax(count, sideLen, radius, gap, rng);
}

function hasOverlaps(squares: Square[], gap: number): boolean {
  for (const [i, si] of squares.entries()) {
    for (const sj of squares.slice(i + 1)) {
      if (satOverlap(si, sj, gap)) return true;
    }
  }
  return false;
}

function generateAndRelax(
  count: number,
  sideLen: number,
  radius: number,
  gap: number,
  rng: () => number,
): Square[] {
  const squares: Square[] = [];
  if (count === 1) {
    const a = rng() * Math.PI * 2;
    const maxR = Math.max(0, radius - sideLen * Math.SQRT2 * 0.5);
    const r = rng() * maxR * 0.4;
    squares.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, size: sideLen, angle: rng() * Math.PI * 2 });
  } else {
    const sector = (Math.PI * 2) / count;
    const base = rng() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      const effR = sideLen * Math.SQRT2 * 0.5;
      const maxR = Math.max(0, radius - effR);
      const center = base + sector * i;
      const jitter = (rng() - 0.5) * sector * 0.6;
      const minR = effR * 0.3;
      const r = minR + (maxR - minR) * rng() * 0.8;
      squares.push({
        x: Math.cos(center + jitter) * r,
        z: Math.sin(center + jitter) * r,
        size: sideLen,
        angle: rng() * Math.PI * 2,
      });
    }
  }
  for (let iter = 0; iter < 80; iter++) {
    let settled = true;
    for (const [i, si] of squares.entries()) {
      // slice copies the array, not the squares — pushes mutate the originals.
      for (const sj of squares.slice(i + 1)) {
        const hit = satOverlap(si, sj, gap);
        if (!hit) continue;
        settled = false;
        const push = hit.depth * 0.75;
        si.x -= hit.ax * push;
        si.z -= hit.az * push;
        sj.x += hit.ax * push;
        sj.z += hit.az * push;
      }
    }
    for (const sq of squares) {
      const maxR = Math.max(0, radius - sq.size * Math.SQRT2 * 0.5);
      const d = Math.sqrt(sq.x * sq.x + sq.z * sq.z);
      if (d > maxR && d > 0) { sq.x *= maxR / d; sq.z *= maxR / d; }
    }
    if (settled) break;
  }
  return squares;
}

type Quad = [Corner, Corner, Corner, Corner];

function cornersOf(x: number, z: number, size: number, angle: number, inflate: number): Quad {
  const half = (size + inflate) / 2;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [x + c * -half - s * -half, z + s * -half + c * -half],
    [x + c *  half - s * -half, z + s *  half + c * -half],
    [x + c *  half - s *  half, z + s *  half + c *  half],
    [x + c * -half - s *  half, z + s * -half + c *  half],
  ];
}

function projectOnAxis(corners: Corner[], ax: number, az: number): [number, number] {
  let min = Infinity, max = -Infinity;
  for (const [cx, cz] of corners) {
    const p = cx * ax + cz * az;
    if (p < min) min = p;
    if (p > max) max = p;
  }
  return [min, max];
}

function satOverlap(a: Square, b: Square, gap: number): Overlap | null {
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
      if (len === 0) continue;
      const nx = -ez / len, nz = ex / len;
      const [minA, maxA] = projectOnAxis(ca, nx, nz);
      const [minB, maxB] = projectOnAxis(cb, nx, nz);
      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
      if (overlap <= 0) return null;
      if (overlap < minDepth) {
        minDepth = overlap;
        const dx = b.x - a.x, dz = b.z - a.z;
        const dot = dx * nx + dz * nz;
        bestAx = dot >= 0 ? nx : -nx;
        bestAz = dot >= 0 ? nz : -nz;
      }
    }
  }
  return { depth: minDepth, ax: bestAx, az: bestAz };
}
