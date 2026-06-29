import type { BeforeLeaveEventArgs } from "@solidjs/router";
import { createSignal, ErrorBoundary, For, Show, Suspense } from "solid-js";
import { createAsync, useBeforeLeave, useNavigate, useParams } from "@solidjs/router";

import { gameDataQueryById } from "src/game/helpers/data";
import { RoutesPageError } from "src/routes/components/PageError";
import { RoutesPagePending } from "src/routes/components/PagePending";

export function GamePage() {
  const params = useParams<{ id: string }>();
  const game = createAsync(() => gameDataQueryById(params.id));
  const navigate = useNavigate();

  const [active, setActive] = createSignal(true);

  useBeforeLeave((event: BeforeLeaveEventArgs) => {
    if (!active() || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    if (window.confirm("Leave the current game? Progress in this demo is not saved.")) {
      event.retry(true);
    }
  });

  return (
    <section class="page">
      <h1 class="page-title">
        Game #{params.id}
      </h1>
      <ErrorBoundary
        fallback={(error, reset) => (
          <RoutesPageError
            error={error}
            reset={reset}
            title="Could not load game"
          />
        )}
      >
        <Suspense
          fallback={(
            <RoutesPagePending label="Loading game…" />
          )}
        >
          <Show when={game()}>
            {(detail) => (
              <>
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
          <div class="page-actions">
            <button
              class="control-button"
              type="button"
              onClick={() => setActive(false)}
            >
              Finish game
            </button>
            <button
              class="control-button"
              type="button"
              onClick={() => navigate("/stats")}
            >
              Go to stats
            </button>
          </div>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

export default GamePage;
