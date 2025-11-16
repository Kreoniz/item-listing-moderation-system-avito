import type { Advertisement } from "@/shared/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ItemCard } from "./item-card";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockAd: Partial<Advertisement> = {
  id: 1,
  title: "Тестовое объявление",
  price: 1000,
  category: "Электроника",
  status: "pending",
  priority: "normal",
  createdAt: "2024-01-01T00:00:00Z",
  images: ["/test-image.jpg"],
};

describe("ItemCard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderItemCard = (props = {}) => {
    return render(
      <BrowserRouter>
        <ItemCard {...mockAd} {...props} />
      </BrowserRouter>,
    );
  };

  it("отображает все основные данные объявления", () => {
    renderItemCard();

    expect(screen.getByText("Тестовое объявление")).toBeInTheDocument();
    expect(screen.getByText("1000 ₽")).toBeInTheDocument();
    expect(screen.getByText("Электроника")).toBeInTheDocument();
    expect(screen.getByText("На модерации")).toBeInTheDocument();
    expect(screen.getByText("Обычное")).toBeInTheDocument();
  });

  it("отображает изображение с правильным src и alt", () => {
    renderItemCard();
    const image = screen.getByAltText("Тестовое объявление");
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("использует placeholder изображение, если images не предоставлены", () => {
    renderItemCard({ images: undefined });
    const image = screen.getByAltText("Тестовое объявление");
    expect(image).toHaveAttribute("src", "/placeholder-view.svg");
  });

  it("отображает кнопку 'Открыть'", () => {
    renderItemCard();
    expect(screen.getByText("Открыть")).toBeInTheDocument();
  });

  it("навигация при клике на кнопку 'Открыть'", async () => {
    const user = userEvent.setup();
    renderItemCard();

    const button = screen.getByText("Открыть").closest("button");
    if (button) {
      await user.click(button);
    }

    expect(mockNavigate).toHaveBeenCalledWith("/item/1", {
      state: {
        adsIds: undefined,
        currentIndex: undefined,
        filters: undefined,
      },
    });
  });

  it("передает фильтры в URL при навигации", async () => {
    const user = userEvent.setup();
    const filters = {
      search: "тест",
      status: ["pending"] as const,
      categoryId: 1,
      minPrice: 100,
      maxPrice: 2000,
      sortBy: "price" as const,
      sortOrder: "asc" as const,
    };

    renderItemCard({ filters });

    const button = screen.getByText("Открыть").closest("button");
    if (button) {
      await user.click(button);
    }

    expect(mockNavigate).toHaveBeenCalled();
    const callArgs = mockNavigate.mock.calls[0];
    expect(callArgs[0]).toContain("/item/1?");
    expect(callArgs[0]).toContain("search=");
    expect(callArgs[0]).toContain("status=pending");
    expect(callArgs[0]).toContain("category=1");
    expect(callArgs[0]).toContain("minPrice=100");
    expect(callArgs[0]).toContain("maxPrice=2000");
    expect(callArgs[0]).toContain("sortBy=price");
    expect(callArgs[0]).toContain("sortOrder=asc");
    expect(callArgs[1].state.filters).toEqual(filters);
  });

  it("отображает чекбокс когда передан onSelectChange", () => {
    const mockOnSelectChange = vi.fn();
    const { container } = renderItemCard({
      onSelectChange: mockOnSelectChange,
    });

    const checkboxButton = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    expect(checkboxButton).toBeInTheDocument();
    expect(checkboxButton.querySelector("svg")).toBeInTheDocument();
  });

  it("не отображает чекбокс когда onSelectChange не передан", () => {
    renderItemCard();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(1);
  });

  it("вызывает onSelectChange при клике на чекбокс", async () => {
    const user = userEvent.setup();
    const mockOnSelectChange = vi.fn();
    renderItemCard({
      onSelectChange: mockOnSelectChange,
      isSelected: false,
    });

    const checkboxButton = document.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;

    if (checkboxButton) {
      await user.click(checkboxButton);
      expect(mockOnSelectChange).toHaveBeenCalledWith("1", true);
    }
  });

  it("применяет класс ring-primary когда isSelected=true", () => {
    const { container } = renderItemCard({ isSelected: true });
    const card = container.querySelector(".ring-primary");
    expect(card).toBeInTheDocument();
  });

  it("не применяет класс ring-primary когда isSelected=false", () => {
    const { container } = renderItemCard({ isSelected: false });
    const card = container.querySelector(".ring-primary");
    expect(card).not.toBeInTheDocument();
  });

  it("отображает отформатированную дату создания", () => {
    renderItemCard();
    expect(screen.getByText(/1 января 2024/)).toBeInTheDocument();
  });

  it("не отображает StatusBadge когда status не передан", () => {
    renderItemCard({ status: undefined });
    expect(screen.queryByText("На модерации")).not.toBeInTheDocument();
  });

  it("не отображает PriorityBadge когда priority не передан", () => {
    renderItemCard({ priority: undefined });
    expect(screen.queryByText("Обычное")).not.toBeInTheDocument();
  });
});
