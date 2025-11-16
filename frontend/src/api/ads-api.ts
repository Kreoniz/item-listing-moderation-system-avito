import type {
  AdsListQuery,
  AdsListResponse,
  Advertisement,
} from "@/shared/types";
import { api } from "./api-client";

export async function getAds(
  params?: Partial<AdsListQuery>,
  signal?: AbortSignal,
) {
  const { data } = await api.get<AdsListResponse>("ads", { params, signal });
  // Замедление для просмотра скелетонов
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data;
}

export async function getAllAdsIds(
  params?: Omit<Partial<AdsListQuery>, "page" | "limit">,
  signal?: AbortSignal,
) {
  // Fetch all matching ads with a large limit to get all IDs
  const { data } = await api.get<AdsListResponse>("ads", {
    params: { ...params, page: 1, limit: 10000 },
    signal,
  });
  return data.ads.map((ad) => String(ad.id));
}

export async function getAd(id: number | string, signal?: AbortSignal) {
  const { data } = await api.get<Advertisement>(`ads/${id}`, { signal });
  console.log(data);
  return data;
}

export async function approveAd(id: number | string, signal?: AbortSignal) {
  const { data } = await api.post<{ message: string; ad: Advertisement }>(
    `ads/${id}/approve`,
    undefined,
    { signal },
  );
  return data;
}

export async function rejectAd(
  id: number | string,
  body: { reason: string; comment?: string },
  signal?: AbortSignal,
) {
  const { data } = await api.post<{ message: string; ad: Advertisement }>(
    `ads/${id}/reject`,
    body,
    { signal },
  );
  return data;
}

export async function requestChangesAd(
  id: number | string,
  body: { reason: string; comment?: string },
  signal?: AbortSignal,
) {
  const { data } = await api.post<{ message: string; ad: Advertisement }>(
    `ads/${id}/request-changes`,
    body,
    { signal },
  );
  return data;
}
