import type { LoginFormValues, AuthError } from "@/types/auth";

class AuthService {
  private async request<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Authentication failed");
    }

    return result;
  }

  async login(credentials: LoginFormValues): Promise<void> {
    await this.request("login", credentials);
  }
}

export const authService = new AuthService();
