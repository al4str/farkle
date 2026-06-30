import type { DiceValue, DiceItem } from "src/dice/data";
import type { GameRng } from "src/game/helpers/rng";
import { DICE_VALUE_SCHEMA, diceIsDevil } from "src/dice/data";

export function diceRoll(dieData: DiceItem, rng: GameRng): DiceValue {
  const isDevil = diceIsDevil(dieData.name);
  const total = dieData.weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  let i = 0;
  for (const weight of dieData.weights) {
    i += 1;
    r -= weight;
    if (r <= 0) {
      if (i === 1 && isDevil) {
        return 666;
      }
      return DICE_VALUE_SCHEMA.parse(i);
    }
  }
  return isDevil ? 666 : 1;
}
