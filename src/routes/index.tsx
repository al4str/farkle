import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { Navigate } from "@solidjs/router";

import { lobbyDataPreload } from "src/lobby/helpers/data";
import { gameDataPreload } from "src/game/helpers/data";
import { statsDataPreload } from "src/stats/helpers/data";

export const routesConfig: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("src/test/components/Page")),
  },
  {
    path: "/lobby",
    component: lazy(() => import("src/lobby/components/Page")),
    preload: lobbyDataPreload,
  },
  {
    path: "/game/:id",
    component: lazy(() => import("src/game/components/Page")),
    preload: gameDataPreload,
    matchFilters: { id: /^\d+$/ },
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
        matchFilters: { id: /^\d+$/ },
      },
    ],
  },
  {
    path: "/games",
    component: () => <Navigate href="/lobby" />,
  },
  {
    path: "*",
    component: lazy(() => import("src/routes/components/PageNotFound")),
  },
];
