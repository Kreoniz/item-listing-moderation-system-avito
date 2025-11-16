import { Button } from "@/components/ui/button";
import type { SortByField, SortOrder } from "@/shared/types";
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from "lucide-react";

interface SortFilterProps {
  sortBy: SortByField;
  sortOrder: SortOrder;
  onChange: (sortBy: SortByField, sortOrder: SortOrder) => void;
}

const OPTIONS = [
  { key: "createdAt", label: "Дата" },
  { key: "price", label: "Цена" },
  { key: "priority", label: "Приоритет" },
] as const;

export function SortFilter({ sortBy, sortOrder, onChange }: SortFilterProps) {
  const toggleOrder = () => {
    onChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        Сортировка
      </label>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          {OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              type="button"
              variant={sortBy === opt.key ? "default" : "outline"}
              size="sm"
              className={`${sortBy === opt.key ? "border-transparent" : ""} h-8 border px-3 hover:cursor-pointer`}
              onClick={() => onChange(opt.key, sortOrder)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 hover:cursor-pointer"
          onClick={toggleOrder}
        >
          {sortOrder === "asc" ? (
            <ArrowUpWideNarrowIcon className="h-4 w-4" />
          ) : (
            <ArrowDownWideNarrowIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
