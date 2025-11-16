import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { Advertisement } from "@/shared/types";
import { ArrowRightIcon } from "lucide-react";
import { NavLink } from "react-router";

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
  const image = images?.[0] || "/placeholder-view.svg";

  return (
    <Card className="rounded-(--card-radius) p-(--card-padding) [--card-padding:--spacing(3)] [--card-radius:var(--radius-3xl)] sm:flex-row">
      <div className="aspect-3/2 h-full w-full overflow-hidden rounded-[calc(var(--card-radius)-var(--card-padding))] sm:aspect-5/4 md:aspect-3/2 lg:basis-1/2">
        <img
          className="bg-image-placeholder h-full w-full object-cover"
          src={image}
          alt={title}
        />
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
        <NavLink
          prefetch="intent"
          to={`/item/${id}`}
          className="flex items-center gap-2"
        >
          <span>Открыть</span> <ArrowRightIcon />
        </NavLink>
      </Button>
    </Card>
  );
}
