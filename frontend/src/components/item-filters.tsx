import { STATUS_MAP } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdStatus } from "@/shared/types";
import { FilterIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface StatusFilterProps {
  selectedStatuses: AdStatus[];
  onChange: (statuses: AdStatus[]) => void;
}

export function StatusFilter({
  selectedStatuses,
  onChange,
}: StatusFilterProps) {
  const availableStatuses: AdStatus[] = [
    "pending",
    "approved",
    "rejected",
    "draft",
  ];

  const handleCheckedChange = (status: AdStatus, checked: boolean) => {
    if (checked) {
      onChange([...selectedStatuses, status]);
    } else {
      onChange(selectedStatuses.filter((s) => s !== status));
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        Статус
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between hover:cursor-pointer"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FilterIcon className="h-4 w-4 shrink-0" />
              {selectedStatuses.length > 0 ? (
                <span className="truncate">
                  {selectedStatuses.length === 1
                    ? STATUS_MAP[selectedStatuses[0]]
                    : `${selectedStatuses.length} выбрано`}
                </span>
              ) : (
                <span className="text-muted-foreground">Все статусы</span>
              )}
            </div>
            {selectedStatuses.length > 0 && (
              <span className="bg-primary/10 text-primary ml-2 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="text-sm font-medium">
              Фильтр по статусу
            </DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          {availableStatuses.map((status) => (
            <DropdownMenuCheckboxItem
              className="hover:cursor-pointer"
              key={status}
              checked={selectedStatuses.includes(status)}
              onCheckedChange={(checked) =>
                handleCheckedChange(status, checked)
              }
            >
              <span className="font-medium">{STATUS_MAP[status]}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | undefined;
  onChange: (categoryId: number | undefined) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        Категория
      </label>
      <Select
        value={selectedCategoryId?.toString() || "all"}
        onValueChange={(value) =>
          onChange(value === "all" ? undefined : Number(value))
        }
      >
        <SelectTrigger className="w-full hover:cursor-pointer">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="hover:cursor-pointer" value="all">
            Все категории
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem
              className="hover:cursor-pointer"
              key={cat.id}
              value={cat.id.toString()}
            >
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface PriceRangeFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: PriceRangeFilterProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        Цена, ₽
      </label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="От"
          min={0}
          value={minPrice ?? ""}
          onChange={(e) =>
            onMinChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-24"
        />
        <span className="text-muted-foreground">—</span>
        <Input
          type="number"
          placeholder="До"
          min={0}
          value={maxPrice ?? ""}
          onChange={(e) =>
            onMaxChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-24"
        />
      </div>
    </div>
  );
}
