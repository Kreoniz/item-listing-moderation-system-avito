import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriorityBadge } from "./priority-badge";

describe("PriorityBadge", () => {
  it("отображает правильный текст для приоритета 'urgent'", () => {
    render(<PriorityBadge priority="urgent" />);
    expect(screen.getByText("Срочно")).toBeInTheDocument();
  });

  it("отображает правильный текст для приоритета 'normal'", () => {
    render(<PriorityBadge priority="normal" />);
    expect(screen.getByText("Обычное")).toBeInTheDocument();
  });

  it("применяет правильные классы для приоритета 'urgent'", () => {
    const { container } = render(<PriorityBadge priority="urgent" />);
    const badge = container.querySelector(".bg-red-200");
    expect(badge).toBeInTheDocument();
  });

  it("применяет правильные классы для приоритета 'normal'", () => {
    const { container } = render(<PriorityBadge priority="normal" />);
    const badge = container.querySelector(".bg-blue-100");
    expect(badge).toBeInTheDocument();
  });
});
