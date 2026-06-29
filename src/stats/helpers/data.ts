import type { RoutePreloadFuncArgs } from "@solidjs/router";
import { query } from "@solidjs/router";
import type { GameDetail } from "src/game/types/detail";
import type { GameSummary } from "src/game/types/summary";

import type { StatsFilter } from "src/stats/types/filter";
import { wait } from "src/utils/delay";

const STATS_STUB: GameSummary[] = [
  {
    id: "1",
    opponent: "AI · Greedy",
    targetScore: 4000,
    status: "finished",
  },
  {
    id: "2",
    opponent: "AI · Cautious",
    targetScore: 10000,
    status: "playing",
  },
  {
    id: "3",
    opponent: "AI · Reckless",
    targetScore: 4000,
    status: "finished",
  },
];

export const statsDataListQuery = query(
  async (filter: StatsFilter): Promise<GameSummary[]> => {
    // TODO: wire web-worker backend
    await wait(450);
    if (filter === "finished") {
      return STATS_STUB.filter((game) => game.status === "finished");
    }
    return STATS_STUB;
  },
  "stats-list",
);

export const statsDataGameQuery = query(
  async (id: string): Promise<GameDetail> => {
    // TODO: wire web-worker backend
    await wait(450);
    return {
      id,
      status: "finished",
      targetScore: 4000,
      players: [
        {
          name: "You",
          score: 4200,
        },
        {
          name: "AI · Greedy",
          score: 3650,
        },
      ],
    };
  },
  "stats-game",
);

export function statsDataPreload(args: RoutePreloadFuncArgs): void {
  const id = args.params["id"];
  if (typeof id === "string") {
    void statsDataGameQuery(id);
    return;
  }
  void statsDataListQuery("played");
}
