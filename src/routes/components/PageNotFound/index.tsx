import { A } from "@solidjs/router";

export function RoutesPageNotFound() {
  return (
    <section class="page">
      <h1 class="page-title">
        404
      </h1>
      <p class="card-meta">
        This route does not exist
      </p>
      <A
        class="control-button"
        href="/"
      >
        Back to test page
      </A>
    </section>
  );
}

export default RoutesPageNotFound;
