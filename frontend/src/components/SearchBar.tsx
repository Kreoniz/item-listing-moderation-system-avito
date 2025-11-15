import { Input } from "@/components/ui/input";
import type { DebouncedCallback } from "@/hooks";

interface SearchBarProps {
  onChange?: DebouncedCallback<[string]>;
  placeholder?: string;
}

export function SearchBar({
  onChange,
  placeholder = "Поиск...",
}: SearchBarProps) {
  return (
    <Input
      onChange={(e) => onChange?.(e.target.value)}
      type="search"
      placeholder={placeholder}
      aria-label="Поиск"
    />
  );
}
