import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/shared/hooks";
import { forwardRef, useEffect, useState } from "react";

interface SearchBarProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ name, value, onChange, placeholder = "Поиск..." }, ref) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const debouncedOnChange = useDebounceCallback(onChange, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      debouncedOnChange(newValue);
    };

    return (
      <Input
        ref={ref}
        name={name}
        type="search"
        placeholder={placeholder}
        aria-label="Поиск"
        value={inputValue}
        onChange={handleChange}
      />
    );
  },
);
