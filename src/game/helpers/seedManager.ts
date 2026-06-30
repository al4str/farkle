import type { GameRng } from "src/game/helpers/rng";
import { gameRngMulberry32 } from "src/game/helpers/rng";

export interface GameSeedManager {
  gameSeed: number;
  getTurnSeed: (turnNumber: number) => number;
  getRollSeed: (turnNumber: number, rollIndex: number) => number;
  createRngForRoll: (turnNumber: number, rollIndex: number) => GameRng;
}

export function gameSeedManagerGenerateMaster(): number {
  return (Math.random() * 2 ** 32) >>> 0;
}

export function gameSeedManagerCreate(gameSeed: number): GameSeedManager {
  const getTurnSeed: GameSeedManager["getTurnSeed"] = (turnNumber) => {
    return hashSeed(gameSeed, turnNumber);
  };
  const getRollSeed: GameSeedManager["getRollSeed"] = (turnNumber, rollIndex) => {
    const turnSeed = getTurnSeed(turnNumber);
    return hashSeed(turnSeed, rollIndex);
  };
  const createRngForRoll: GameSeedManager["createRngForRoll"] = (turnNumber, rollIndex) => {
    const rollSeed = getRollSeed(turnNumber, rollIndex);
    return gameRngMulberry32(rollSeed);
  };

  return {
    gameSeed,
    getTurnSeed,
    getRollSeed,
    createRngForRoll,
  };
}

function hashSeed(a: number, b: number): number {
  return (Math.imul(a, 1664525) + Math.imul(b, 1013904223)) >>> 0;
}
