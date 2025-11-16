import { Input } from "@/components/ui/input";

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

