import type { GamePlayer } from "src/game/types/player";
import type { GameStatus } from "src/game/types/status";

export interface GameDetail {
  id: string;
  status: GameStatus;
  targetScore: number;
  players: GamePlayer[];
}
