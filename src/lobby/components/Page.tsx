import { ErrorBoundary, For, Suspense } from "solid-js";
import { createAsync, useNavigate } from "@solidjs/router";

import { lobbyDataGamesQuery } from "src/lobby/helpers/data";
import { RoutesPageError } from "src/routes/components/PageError";
import { RoutesPagePending } from "src/routes/components/PagePending";

export function LobbyPage() {
  const games = createAsync(() => lobbyDataGamesQuery());
  const navigate = useNavigate();

  return (
    <section class="page">
      <h1 class="page-title">
        Lobby
      </h1>
      <ErrorBoundary
        fallback={(error, reset) => (
          <RoutesPageError
            error={error}
            reset={reset}
            title="Could not load lobby"
          />
        )}
      >
        <Suspense
          fallback={(
            <RoutesPagePending label="Loading lobby…" />
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
                      Target {game.targetScore}
                    </span>
                  </div>
                  <button
                    class="control-button"
                    type="button"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    Resume
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

export default LobbyPage;
