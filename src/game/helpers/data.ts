import type { RoutePreloadFuncArgs } from "@solidjs/router";
import { query } from "@solidjs/router";

import type { GameDetail } from "src/game/types/detail";
import { wait } from "src/utils/delay";

export const gameDataQueryById = query(
  async (id: string): Promise<GameDetail> => {
    // TODO: wire web-worker backend
    await wait(500);
    return {
      id,
      status: "playing",
      targetScore: 4000,
      players: [
        {
          name: "You",
          score: 1850,
        },
        {
          name: "AI · Greedy",
          score: 2100,
        },
      ],
    };
  },
  "game-by-id",
);

export function gameDataPreload(args: RoutePreloadFuncArgs): void {
  const id = args.params["id"];
  if (typeof id === "string") {
    void gameDataQueryById(id);
  }
}
