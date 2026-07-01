import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { Navigate } from "@solidjs/router";

import { lobbyDataPreload } from "src/lobby/helpers/data";
import { gameDataPreload } from "src/game/helpers/data";
import { statsDataPreload } from "src/stats/helpers/data";

const GAME_ID_REGEXP = /^\d+$/;

export const ROUTES_DEFINITION: RouteDefinition[] = [
  {
    path: "/",
    component: () => <Navigate href="/test/interactions" />,
  },
  {
    path: "/test/canvas",
    component: lazy(() => import("src/test/components/PageIndex")),
  },
  {
    path: "/test/interactions",
    component: lazy(() => import("src/test/components/PageInteractions")),
  },
  {
    path: "/lobby",
    component: lazy(() => import("src/lobby/components/Page")),
    preload: lobbyDataPreload,
  },
  {
    path: "/game/:id",
    component: lazy(() => import("src/game/components/PageIndex")),
    preload: gameDataPreload,
    matchFilters: {
      id: GAME_ID_REGEXP,
    },
  },
  {
    path: "/stats",
    component: lazy(() => import("src/stats/components/Layout")),
    preload: statsDataPreload,
    children: [
      {
        path: "/",
        component: lazy(() => import("src/stats/components/PageList")),
      },
      {
        path: "/:id",
        component: lazy(() => import("src/stats/components/PageDetail")),
        matchFilters: {
          id: GAME_ID_REGEXP,
        },
      },
    ],
  },
  {
    path: "*",
    component: lazy(() => import("src/routes/components/PageNotFound")),
  },
];
