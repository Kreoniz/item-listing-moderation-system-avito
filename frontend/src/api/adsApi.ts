import type { AdsListQuery, AdsListResponse } from "@/shared/types";
import { api } from "./apiClient";

export async function getAds(params?: Partial<AdsListQuery>) {
  const { data } = await api.get<AdsListResponse>("ads", { params: params });

  // Замедление для просмотра скелетонов
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return data;
}
