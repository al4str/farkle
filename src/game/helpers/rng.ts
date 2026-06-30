export type GameRng = () => number;

/**
 * mulberry32 is a 32-bit fast PRNG.
 */
export function gameRngMulberry32(seed: number): GameRng {
  let s = seed;
  return () => {
    let t = s += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
