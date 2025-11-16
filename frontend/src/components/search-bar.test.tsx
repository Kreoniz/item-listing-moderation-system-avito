import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "./search-bar";

describe("SearchBar", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("отображает input с правильным placeholder", () => {
    render(
      <SearchBar
        name="search"
        value=""
        onChange={mockOnChange}
        placeholder="Поиск..."
      />,
    );
    const input = screen.getByPlaceholderText("Поиск...");
    expect(input).toBeInTheDocument();
  });

  it("отображает начальное значение", () => {
    render(<SearchBar name="search" value="тест" onChange={mockOnChange} />);
    const input = screen.getByDisplayValue("тест");
    expect(input).toBeInTheDocument();
  });

  it("обновляет значение при вводе", () => {
    render(<SearchBar name="search" value="" onChange={mockOnChange} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "новый текст" } });

    expect(input).toHaveValue("новый текст");
  });

  it("вызывает onChange с задержкой (debounce)", () => {
    render(<SearchBar name="search" value="" onChange={mockOnChange} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "тест" } });

    expect(mockOnChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(mockOnChange).toHaveBeenCalledWith("тест");
  });

  it("обновляет значение при изменении пропса value", () => {
    const { rerender } = render(
      <SearchBar name="search" value="старое" onChange={mockOnChange} />,
    );
    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("старое");

    rerender(<SearchBar name="search" value="новое" onChange={mockOnChange} />);
    expect(input).toHaveValue("новое");
  });

  it("имеет правильный атрибут aria-label", () => {
    render(<SearchBar name="search" value="" onChange={mockOnChange} />);
    const input = screen.getByLabelText("Поиск");
    expect(input).toBeInTheDocument();
  });
});
