import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";
import { authService } from "@/services/auth";
import { toast } from "sonner";

// Mocki specyficzne dla komponentu
vi.mock("@/services/auth", () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginForm", () => {
  const mockCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render form elements correctly", () => {
    render(<LoginForm />);

    const emailInput = screen.getByTestId("login-email-input");
    const passwordInput = screen.getByTestId("login-password-input");
    const submitButton = screen.getByTestId("login-submit-button");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "you@example.com");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(submitButton).toHaveTextContent("Sign in");
  });

  it("should handle successful login", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockResolvedValueOnce();
    render(<LoginForm />);

    await user.type(screen.getByTestId("login-email-input"), mockCredentials.email);
    await user.type(screen.getByTestId("login-password-input"), mockCredentials.password);
    await user.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(mockCredentials);
      expect(toast.success).toHaveBeenCalledWith("Successfully signed in!");
      expect(window.location.href).toBe("/");
    });
  });

  it("should show validation errors", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Kliknij submit i poczekaj na walidację
    const submitButton = screen.getByTestId("login-submit-button");
    await user.click(submitButton);

    // Poczekaj na zakończenie walidacji i pojawienie się komunikatów
    expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();

    // Upewnij się, że nie próbowano się zalogować
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("should handle login error", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid credentials";
    vi.mocked(authService.login).mockRejectedValueOnce(new Error(errorMessage));
    render(<LoginForm />);

    await user.type(screen.getByTestId("login-email-input"), mockCredentials.email);
    await user.type(screen.getByTestId("login-password-input"), mockCredentials.password);
    await user.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("should disable form during submission", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<LoginForm />);

    await user.type(screen.getByTestId("login-email-input"), mockCredentials.email);
    await user.type(screen.getByTestId("login-password-input"), mockCredentials.password);
    await user.click(screen.getByTestId("login-submit-button"));

    expect(screen.getByTestId("login-email-input")).toBeDisabled();
    expect(screen.getByTestId("login-password-input")).toBeDisabled();
    expect(screen.getByTestId("login-submit-button")).toBeDisabled();
    expect(screen.getByTestId("login-submit-button")).toHaveTextContent("Signing in...");
  });
});
