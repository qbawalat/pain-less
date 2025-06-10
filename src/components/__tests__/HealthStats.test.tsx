import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HealthStats from "../HealthStats";
import type { HealthProfileResponse } from "@/types";

const mockProfile: HealthProfileResponse = {
  id: "1",
  birth_date: "1990-01-01",
  height: 180,
  weight: 75,
  medical_conditions: ["Hypertension", "Diabetes"],
  family_conditions: ["Heart Disease"],
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockOnUpdate = vi.fn();

describe("HealthStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null when no profile is provided", () => {
    const { container } = render(<HealthStats profile={null} onUpdate={mockOnUpdate} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders health stats correctly", () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    expect(screen.getByText("Health Stats")).toBeInTheDocument();

    // Test age calculation
    const ageElement = screen.getByText(/^\d+$/); // Match any number
    const age = parseInt(ageElement.textContent || "0");
    expect(age).toBeGreaterThan(0);
    expect(age).toBeLessThan(100);

    expect(screen.getByText("180 cm")).toBeInTheDocument();
    expect(screen.getByText("75 kg")).toBeInTheDocument();
    expect(screen.getByText("23.1")).toBeInTheDocument(); // BMI
  });

  it("displays medical conditions and family history", () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    expect(screen.getByText("Medical Conditions")).toBeInTheDocument();
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
    expect(screen.getByText("Diabetes")).toBeInTheDocument();

    expect(screen.getByText("Family History")).toBeInTheDocument();
    expect(screen.getByText("Heart Disease")).toBeInTheDocument();
  });

  it("opens edit dialog when edit button is clicked", async () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    expect(screen.getByText("Edit Health Profile")).toBeInTheDocument();
  });

  it("allows adding new medical condition", async () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    // Open edit dialog
    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    // Type new condition
    const input = screen.getByPlaceholderText("Add a medical condition");
    await userEvent.type(input, "Asthma");
    await userEvent.keyboard("{Enter}");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(submitButton);

    // Verify update
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          medical_conditions: expect.arrayContaining(["Asthma"]),
        })
      );
    });
  });

  it("allows removing medical condition", async () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    // Open edit dialog
    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    // Find and click the first remove button
    const removeButtons = screen.getAllByRole("button", { name: "" });
    await userEvent.click(removeButtons[0]);

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(submitButton);

    // Verify update
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          medical_conditions: ["Diabetes"],
        })
      );
    });
  });

  it("submits form with updated data", async () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);

    // Open edit dialog
    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    // Update height
    const heightInput = screen.getByLabelText(/height/i);
    await userEvent.clear(heightInput);
    await userEvent.type(heightInput, "185");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(submitButton);

    // Verify update
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          height: 185,
        })
      );
    });
  });

  it("calculates BMI correctly", () => {
    render(<HealthStats profile={mockProfile} onUpdate={mockOnUpdate} />);
    expect(screen.getByText("23.1")).toBeInTheDocument();
  });

  it("handles empty medical conditions and family history", () => {
    const emptyProfile = {
      ...mockProfile,
      medical_conditions: [],
      family_conditions: [],
    };

    render(<HealthStats profile={emptyProfile} onUpdate={mockOnUpdate} />);

    expect(screen.getByText("No conditions listed")).toBeInTheDocument();
    expect(screen.getByText("No family history listed")).toBeInTheDocument();
  });
});
