import type { RouteSectionProps } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";

import { RoutesNavBar } from "src/routes/components/NavBar";
import { RoutesGlobalPending } from "src/routes/components/GlobalPending";
import { RoutesPageError } from "src/routes/components/PageError";
import { RoutesPagePending } from "src/routes/components/PagePending";

export function RoutesLayout(props: RouteSectionProps) {
  return (
    <>
      <RoutesGlobalPending />
      <RoutesNavBar />
      <main class="route-outlet">
        <ErrorBoundary
          fallback={(error, reset) => (
            <RoutesPageError
              error={error}
              reset={reset}
              title="Application error"
            />
          )}
        >
          <Suspense
            fallback={<RoutesPagePending />}
          >
            {props.children}
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
