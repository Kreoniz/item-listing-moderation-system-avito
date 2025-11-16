import { render, screen } from "@testing-library/react";
import { TrendingUp } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("отображает заголовок и значение", () => {
    render(
      <StatCard title="Всего объявлений" value={100} icon={<TrendingUp />} />,
    );

    expect(screen.getByText("Всего объявлений")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("отображает строковое значение", () => {
    render(<StatCard title="Статус" value="Активно" icon={<TrendingUp />} />);

    expect(screen.getByText("Активно")).toBeInTheDocument();
  });

  it("отображает skeleton при loading=true", () => {
    const { container } = render(
      <StatCard
        title="Загрузка"
        value={0}
        icon={<TrendingUp />}
        loading={true}
      />,
    );

    const skeleton = container.querySelector(".h-8");
    expect(skeleton).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("отображает badge когда передан", () => {
    render(
      <StatCard
        title="Тест"
        value={50}
        icon={<TrendingUp />}
        badge={<span data-testid="custom-badge">Badge</span>}
      />,
    );

    expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
  });

  it("отображает trend с направлением 'up'", () => {
    render(
      <StatCard
        title="Тест"
        value={50}
        icon={<TrendingUp />}
        trend={{ direction: "up", value: "+10%" }}
      />,
    );

    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/\+10%/)).toBeInTheDocument();
  });

  it("отображает trend с направлением 'down'", () => {
    render(
      <StatCard
        title="Тест"
        value={50}
        icon={<TrendingUp />}
        trend={{ direction: "down", value: "-5%" }}
      />,
    );

    expect(screen.getByText(/↓/)).toBeInTheDocument();
    expect(screen.getByText(/-5%/)).toBeInTheDocument();
  });

  it("отображает trend с направлением 'neutral'", () => {
    render(
      <StatCard
        title="Тест"
        value={50}
        icon={<TrendingUp />}
        trend={{ direction: "neutral", value: "0%" }}
      />,
    );

    expect(screen.getByText(/→/)).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });
});
