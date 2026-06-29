import type { GameStatus } from "src/game/types/status";

export interface GameSummary {
  id: string;
  opponent: string;
  targetScore: number;
  status: GameStatus;
}
