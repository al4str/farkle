import type { RouteSectionProps } from "@solidjs/router";

export function StatsLayout(props: RouteSectionProps) {
  return (
    <section class="page">
      <h1 class="page-title">
        Stats
      </h1>
      {props.children}
    </section>
  );
}

export default StatsLayout;
