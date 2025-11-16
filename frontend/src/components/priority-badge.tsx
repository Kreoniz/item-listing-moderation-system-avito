import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/shared/types";

const PRIORITY_MAP = {
  urgent: "Срочно",
  normal: "Обычное",
};

export function PriorityBadge({
  priority,
}: {
  priority: Advertisement["priority"];
}) {
  return (
    <Badge
      className={cn(
        "rounded-full px-2 py-1 text-xs",
        priority === "urgent"
          ? "bg-red-200 text-red-800"
          : "bg-blue-100 text-blue-700",
      )}
    >
      {PRIORITY_MAP[priority]}
    </Badge>
  );
}
