import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STATUS_MAP, StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("отображает правильный текст для статуса 'pending'", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText(STATUS_MAP.pending)).toBeInTheDocument();
  });

  it("отображает правильный текст для статуса 'approved'", () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText(STATUS_MAP.approved)).toBeInTheDocument();
  });

  it("отображает правильный текст для статуса 'rejected'", () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText(STATUS_MAP.rejected)).toBeInTheDocument();
  });

  it("отображает правильный текст для статуса 'draft'", () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText(STATUS_MAP.draft)).toBeInTheDocument();
  });

  it("применяет правильные классы для статуса 'approved'", () => {
    const { container } = render(<StatusBadge status="approved" />);
    const badge = container.querySelector(".bg-green-100");
    expect(badge).toBeInTheDocument();
  });

  it("применяет правильные классы для статуса 'rejected'", () => {
    const { container } = render(<StatusBadge status="rejected" />);
    const badge = container.querySelector(".bg-red-100");
    expect(badge).toBeInTheDocument();
  });

  it("применяет правильные классы для статуса 'pending'", () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.querySelector(".bg-yellow-100");
    expect(badge).toBeInTheDocument();
  });

  it("применяет правильные классы для статуса 'draft'", () => {
    const { container } = render(<StatusBadge status="draft" />);
    const badge = container.querySelector(".bg-gray-100");
    expect(badge).toBeInTheDocument();
  });
});
