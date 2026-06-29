import type { StatsFilter } from "src/stats/types/filter";

const STATS_FILTERS: readonly StatsFilter[] = ["played", "finished"];

export function statsFilterParse(value: undefined | string): StatsFilter {
  return isFilter(value) ? value : "played";
}

function isFilter(value: unknown): value is StatsFilter {
  return typeof value === "string" && STATS_FILTERS.some((filter) => filter === value);
}
