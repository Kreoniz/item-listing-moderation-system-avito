import type { ActivityData, DecisionsData, StatsSummary } from "@/shared/types";
import { api } from "./api-client";

type StatsQuery = {
  period?: "today" | "week" | "month" | "custom";
  startDate?: string;
  endDate?: string;
};

export async function getStatsSummary(
  params?: StatsQuery,
  signal?: AbortSignal,
) {
  const { data } = await api.get<StatsSummary>("stats/summary", {
    params,
    signal,
  });
  return data;
}

export async function getActivityChart(
  params?: StatsQuery,
  signal?: AbortSignal,
) {
  const { data } = await api.get<ActivityData[]>("stats/chart/activity", {
    params,
    signal,
  });
  return data;
}

export async function getDecisionsChart(
  params?: StatsQuery,
  signal?: AbortSignal,
) {
  const { data } = await api.get<DecisionsData>("stats/chart/decisions", {
    params,
    signal,
  });
  return data;
}

export async function getCategoriesChart(
  params?: StatsQuery,
  signal?: AbortSignal,
) {
  const { data } = await api.get<Record<string, number>>(
    "stats/chart/categories",
    { params, signal },
  );
  return data;
}
