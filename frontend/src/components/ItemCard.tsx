import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/ads";
import { ArrowRightIcon } from "lucide-react";
import { NavLink } from "react-router";

const statusMap = {
  pending: "На модерации",
  approved: "Одобрено",
  rejected: "Отклонено",
  draft: "Черновик",
};

const priorityMap = {
  urgent: "Срочно",
  normal: "Обычное",
};

export function ItemCard({
  id,
  title,
  price,
  category,
  createdAt,
  status,
  priority,
  images,
}: Partial<Advertisement>) {
  const image = images?.[0];

  return (
    <Card className="rounded-(--card-radius) p-(--card-padding) [--card-padding:--spacing(3)] [--card-radius:var(--radius-3xl)] md:flex-row">
      <div className="overflow-hidden rounded-[calc(var(--card-radius)-var(--card-padding))]">
        <img className="h-full w-full object-cover" src={image} alt={title} />
      </div>

      <div className="w-full space-y-2 py-1">
        <CardTitle className="font-semibold">{title}</CardTitle>
        <div className="text-lg">{price} ₽</div>

        <Badge>{category}</Badge>

        <div className="space-x-1">
          {status && <StatusBadge status={status} />}
          {priority && <PriorityBadge priority={priority} />}
        </div>

        <div className="text-muted-foreground text-xs">
          {createdAt &&
            new Date(createdAt).toLocaleString("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
        </div>
      </div>

      <Button asChild className="self-end justify-self-end">
        <NavLink to={`/item/${id}`} className="flex items-center gap-2">
          <span>Открыть</span> <ArrowRightIcon />
        </NavLink>
      </Button>
    </Card>
  );
}

function StatusBadge({ status }: { status: Advertisement["status"] }) {
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
      {statusMap[status]}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Advertisement["priority"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs",
        priority === "urgent"
          ? "bg-red-200 text-red-800"
          : "bg-blue-100 text-blue-700",
      )}
    >
      {priorityMap[priority]}
    </span>
  );
}
