import type { Moderator } from "@/shared/types";
import { api } from "./api-client";

export async function getCurrentModerator(signal?: AbortSignal) {
  const { data } = await api.get<Moderator>("moderators/me", { signal });
  return data;
}
