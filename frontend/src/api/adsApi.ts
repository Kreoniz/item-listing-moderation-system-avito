import { api } from "./apiClient";
import type { Sorting, SortingOrder, Status } from "./types";

interface GetAdsParams {
  page: number;
  limit: number;
  status: Status;
  categoryId: number;
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: Sorting;
  sortOrder: SortingOrder;
}

export async function getAds(params?: Partial<GetAdsParams>) {
  const response = await api.get("ads", { params: params });

  return response;
}
