import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "../auth";
import type { LoginFormValues } from "@/types/auth";

describe("AuthService", () => {
  const mockCredentials: LoginFormValues = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should make correct API call for login", async () => {
    // Arrange
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
    vi.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse as Response);

    // Act
    await authService.login(mockCredentials);

    // Assert
    expect(fetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockCredentials),
      credentials: "include",
    });
  });

  it("should handle failed login", async () => {
    // Arrange
    const mockError = "Invalid credentials";
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: mockError }),
    };
    vi.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse as Response);

    // Act & Assert
    await expect(authService.login(mockCredentials)).rejects.toThrow(mockError);
  });

  it("should handle network errors", async () => {
    // Arrange
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

    // Act & Assert
    await expect(authService.login(mockCredentials)).rejects.toThrow("Network error");
  });
});
