import type { AdsListQuery, AdsListResponse } from "@/types/ads";
import { api } from "./apiClient";

export async function getAds(params?: Partial<AdsListQuery>) {
  const { data } = await api.get<AdsListResponse>("ads", { params: params });

  return data;
}
