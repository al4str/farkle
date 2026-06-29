import { ErrorBoundary, For, Show, Suspense } from "solid-js";
import { A, createAsync, useParams } from "@solidjs/router";

import { statsDataGameQuery } from "src/stats/helpers/data";
import { RoutesPageError } from "src/routes/components/PageError";
import { RoutesPagePending } from "src/routes/components/PagePending";

export function StatsPageDetail() {
  const params = useParams<{ id: string }>();
  const game = createAsync(() => statsDataGameQuery(params.id));

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RoutesPageError
          error={error}
          reset={reset}
          title="Could not load game"
        />
      )}
    >
      <A
        class="nav-link"
        href="/stats"
      >
        ← Back to stats
      </A>
      <Suspense
        fallback={(
          <RoutesPagePending label="Loading game…" />
        )}
      >
        <Show when={game()}>
          {(detail) => (
            <>
              <h2 class="page-subtitle">
                Game #{detail().id}
              </h2>
              <p class="card-meta">
                Target {detail().targetScore} · {detail().status}
              </p>
              <ul class="card-list">
                <For each={detail().players}>
                  {(player) => (
                    <li class="card">
                      <strong>
                        {player.name}
                      </strong>
                      <span class="card-meta">
                        {player.score}
                      </span>
                    </li>
                  )}
                </For>
              </ul>
            </>
          )}
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}

export default StatsPageDetail;
