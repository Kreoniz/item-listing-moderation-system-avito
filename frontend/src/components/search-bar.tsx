import { Input } from "@/components/ui/input";
import type { DebouncedCallback } from "@/shared/hooks";

interface SearchBarProps {
  name: string;
  onChange?: DebouncedCallback<[string]>;
  placeholder?: string;
}

export function SearchBar({
  name,
  onChange,
  placeholder = "Поиск...",
}: SearchBarProps) {
  return (
    <Input
      onChange={(e) => onChange?.(e.target.value)}
      name={name}
      type="search"
      placeholder={placeholder}
      aria-label="Поиск"
    />
  );
}
