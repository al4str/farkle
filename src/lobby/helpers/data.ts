import { query } from "@solidjs/router";

import type { GameSummary } from "src/game/types/summary";
import { wait } from "src/utils/delay";

const LOBBY_STUB: GameSummary[] = [
  {
    id: "1",
    opponent: "AI · Greedy",
    targetScore: 4000,
    status: "playing",
  },
  {
    id: "2",
    opponent: "AI · Cautious",
    targetScore: 10000,
    status: "playing",
  },
];

export const lobbyDataGamesQuery = query(
  async (): Promise<GameSummary[]> => {
    // TODO: wire web-worker backend
    await wait(500);
    return LOBBY_STUB;
  },
  "lobby-games",
);

export function lobbyDataPreload(): void {
  void lobbyDataGamesQuery();
}
