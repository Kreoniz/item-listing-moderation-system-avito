import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatTimeString } from "@/lib/utils";
import type { AdsListQuery, Advertisement } from "@/shared/types";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router";

interface ItemCardProps extends Partial<Advertisement> {
  adsIds?: string[];
  currentIndex?: number;
  filters?: Omit<Partial<AdsListQuery>, "page" | "limit">;
}

export function ItemCard({
  id,
  title,
  price,
  category,
  createdAt,
  status,
  priority,
  images,
  adsIds,
  currentIndex,
  filters,
}: ItemCardProps) {
  const navigate = useNavigate();
  const image = images?.[0] || "/placeholder-view.svg";

  const handleClick = () => {
    // Build URL with filter params
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status && filters.status.length > 0)
      params.set("status", filters.status.join(","));
    if (filters?.categoryId !== undefined)
      params.set("category", String(filters.categoryId));
    if (filters?.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters?.sortBy && filters.sortBy !== "createdAt")
      params.set("sortBy", filters.sortBy);
    if (filters?.sortOrder && filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/item/${id}${queryString ? `?${queryString}` : ""}`;

    navigate(url, {
      state: {
        adsIds,
        currentIndex,
        filters,
      },
    });
  };

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
          {createdAt && formatTimeString(createdAt)}
        </div>
      </div>

      <Button
        className="flex items-center gap-2 self-end justify-self-end"
        onClick={handleClick}
      >
        <span>Открыть</span> <ArrowRightIcon />
      </Button>
    </Card>
  );
}
