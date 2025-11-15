import type { Seller } from "./moderator";
import type { ID, Pagination } from "./shared";

export type AdStatus = "pending" | "approved" | "rejected" | "draft";
export type AdPriority = "normal" | "urgent";

export type ModerationAction = "approved" | "rejected" | "requestChanges";

export type ModerationReason =
  | "Запрещенный товар"
  | "Неверная категория"
  | "Некорректное описание"
  | "Проблемы с фото"
  | "Подозрение на мошенничество"
  | "Другое";

export interface ModerationHistory {
  id: ID;
  moderatorId: ID;
  moderatorName: string;
  action: ModerationAction;
  reason: string | null;
  comment: string;
  timestamp: string;
}

export interface Advertisement {
  id: ID;
  title: string;
  description: string;
  price: number;

  category: string;
  categoryId: number;

  status: AdStatus;
  priority: AdPriority;

  createdAt: string;
  updatedAt: string;

  images: string[];
  seller: Seller;

  characteristics: Record<string, string>;
  moderationHistory: ModerationHistory[];
}

export interface AdsListQuery {
  page?: number;
  limit?: number;
  status?: AdStatus[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;

  sortBy?: "createdAt" | "price" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface AdsListResponse {
  ads: Advertisement[];
  pagination: Pagination;
}

export interface RejectAdRequest {
  reason: ModerationReason;
  comment?: string;
}

export interface RequestChangesRequest {
  reason: ModerationReason;
  comment?: string;
}

export interface AdMutationResponse {
  message: string;
  ad: Advertisement;
}
