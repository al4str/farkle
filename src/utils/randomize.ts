export function randomize(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function randomizeArray<T>(array: readonly T[]): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[j];
    const b = shuffled[i];
    if (a) {
      shuffled[i] = a;
    }
    if (b) {
      shuffled[j] = b;
    }
  }
  return shuffled;
}
