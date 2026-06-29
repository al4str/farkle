import { ErrorBoundary, For, Suspense } from "solid-js";
import { A, createAsync, useSearchParams } from "@solidjs/router";

import type { StatsFilter } from "src/stats/types/filter";
import { statsFilterParse } from "src/stats/helpers/filter";
import { statsDataListQuery } from "src/stats/helpers/data";
import { RoutesPageError } from "src/routes/components/PageError";
import { RoutesPagePending } from "src/routes/components/PagePending";

const FILTERS: readonly StatsFilter[] = ["played", "finished"];

export function StatsPageList() {
  const [searchParams, setSearchParams] = useSearchParams<{ filter: string }>();
  const filter = (): StatsFilter => statsFilterParse(searchParams.filter);
  const games = createAsync(() => statsDataListQuery(filter()));

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RoutesPageError
          error={error}
          reset={reset}
          title="Could not load stats"
        />
      )}
    >
      <div class="stats-tabs">
        <For each={FILTERS}>
          {(value) => (
            <button
              class="nav-link"
              classList={{ "is-active": filter() === value }}
              type="button"
              onClick={() => setSearchParams({ filter: value })}
            >
              {value}
            </button>
          )}
        </For>
      </div>
      <Suspense
        fallback={(
          <RoutesPagePending label="Loading stats…" />
        )}
      >
        <ul class="card-list">
          <For each={games()}>
            {(game) => (
              <li class="card">
                <div>
                  <strong>
                    {game.opponent}
                  </strong>
                  <span class="card-meta">
                    Target {game.targetScore} · {game.status}
                  </span>
                </div>
                <A
                  class="control-button"
                  href={`/stats/${game.id}`}
                >
                  Details
                </A>
              </li>
            )}
          </For>
        </ul>
      </Suspense>
    </ErrorBoundary>
  );
}

export default StatsPageList;
