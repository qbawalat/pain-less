import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SupplementCombobox } from "./supplement-combobox";
import type { SupplementResponse } from "@/types";

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock data
const mockSupplements: SupplementResponse[] = [
  { id: "1", name: "Vitamin D", description: "Essential for bone health", interactions: [] },
  { id: "2", name: "Vitamin C", description: "Supports immune system", interactions: [] },
  { id: "3", name: "Magnesium", description: "Important for muscle function", interactions: [] },
];

// Mock handlers
const mockOnValueChange = vi.fn();
const mockOnCreateSupplement = vi.fn();

describe("SupplementCombobox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <SupplementCombobox
        supplements={mockSupplements}
        value=""
        onValueChange={mockOnValueChange}
        onCreateSupplement={mockOnCreateSupplement}
        {...props}
      />
    );
  };

  describe("Rendering", () => {
    it("renders with default placeholder", () => {
      renderComponent();
      expect(screen.getByRole("combobox")).toHaveTextContent("Select supplement...");
    });

    it("renders with custom placeholder", () => {
      renderComponent({ placeholder: "Choose a supplement..." });
      expect(screen.getByRole("combobox")).toHaveTextContent("Choose a supplement...");
    });

    it("displays selected supplement name", () => {
      renderComponent({ value: "1" });
      expect(screen.getByRole("combobox")).toHaveTextContent("Vitamin D");
    });

    it("renders in disabled state", () => {
      renderComponent({ disabled: true });
      expect(screen.getByRole("combobox")).toBeDisabled();
    });
  });

  describe("Search functionality", () => {
    it("filters supplements based on search input", async () => {
      renderComponent();
      const user = userEvent.setup();

      // Open the combobox
      await user.click(screen.getByRole("combobox"));

      // Type in search
      const searchInput = screen.getByPlaceholderText("Search supplements...");
      await user.type(searchInput, "vitamin");

      // Wait for the filtered results
      await waitFor(() => {
        expect(screen.getByText("Vitamin D")).toBeInTheDocument();
        expect(screen.getByText("Vitamin C")).toBeInTheDocument();
        expect(screen.queryByText("Magnesium")).not.toBeInTheDocument();
      });
    });
  });

  describe("Selection handling", () => {
    it("calls onValueChange when selecting existing supplement", async () => {
      renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => {
        expect(screen.getByText("Vitamin D")).toBeInTheDocument();
      });
      await user.click(screen.getByRole("option", { name: "Vitamin D" }));

      expect(mockOnValueChange).toHaveBeenCalledWith("1");
    });

    it("shows create option for new supplement", async () => {
      renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByPlaceholderText("Search supplements..."), "New Supplement");

      await waitFor(() => {
        expect(screen.getByRole("option", { name: 'Create "New Supplement"' })).toBeInTheDocument();
      });
    });

    it("creates new supplement when selecting create option", async () => {
      const newSupplement = { id: "4", name: "New Supplement", description: "", interactions: [] };
      mockOnCreateSupplement.mockResolvedValueOnce(newSupplement);

      renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByPlaceholderText("Search supplements..."), "New Supplement");
      await waitFor(() => {
        expect(screen.getByRole("option", { name: 'Create "New Supplement"' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole("option", { name: 'Create "New Supplement"' }));

      expect(mockOnCreateSupplement).toHaveBeenCalledWith("New Supplement");
      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("4");
      });
    });
  });

  describe("Error handling", () => {
    it("handles create supplement error gracefully", async () => {
      mockOnCreateSupplement.mockRejectedValueOnce(new Error("Failed to create"));

      renderComponent();
      const user = userEvent.setup();

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByPlaceholderText("Search supplements..."), "New Supplement");
      await waitFor(() => {
        expect(screen.getByRole("option", { name: 'Create "New Supplement"' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole("option", { name: 'Create "New Supplement"' }));

      expect(mockOnCreateSupplement).toHaveBeenCalledWith("New Supplement");
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      renderComponent();
      const combobox = screen.getByRole("combobox");

      expect(combobox).toHaveAttribute("aria-expanded", "false");
      expect(combobox).toHaveAttribute("role", "combobox");
    });

    it("updates aria-expanded when opened", async () => {
      renderComponent();
      const user = userEvent.setup();

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(combobox).toHaveAttribute("aria-expanded", "true");
      });
    });
  });
});
