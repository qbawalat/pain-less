import type { LoginFormValues } from "@/types/auth";

interface ForgotPasswordFormValues {
  email: string;
}

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

  async forgotPassword(data: ForgotPasswordFormValues): Promise<void> {
    await this.request("forgot-password", data);
  }
}

export const authService = new AuthService();
