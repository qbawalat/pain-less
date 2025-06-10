import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// Przykładowy komponent do testowania
const TestButton = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
};

describe("TestButton Component", () => {
  it("should render button with correct text", () => {
    render(<TestButton>Click me</TestButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<TestButton onClick={mockOnClick}>Click me</TestButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct CSS classes", () => {
    render(<TestButton>Click me</TestButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "bg-blue-500", "text-white", "rounded");
  });

  it("should be accessible", () => {
    render(<TestButton>Click me</TestButton>);

    const button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).not.toHaveAttribute("disabled");
  });
});
