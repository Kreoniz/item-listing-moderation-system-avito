import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/shared/types";

export const STATUS_MAP = {
  pending: "На модерации",
  approved: "Одобрено",
  rejected: "Отклонено",
  draft: "Черновик",
};

export function StatusBadge({ status }: { status: Advertisement["status"] }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-2 py-1 text-xs",
        status === "approved" && "bg-green-100 text-green-700",
        status === "rejected" && "bg-red-100 text-red-700",
        status === "pending" && "bg-yellow-100 text-yellow-700",
        status === "draft" && "bg-gray-100 text-gray-600",
      )}
    >
      {STATUS_MAP[status]}
    </Badge>
  );
}
