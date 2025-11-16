import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: number;
  name: string;
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

