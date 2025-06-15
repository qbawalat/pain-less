interface ForgotPasswordFormValues {
  email: string;
}

class PasswordService {
  private async request<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`/api/password/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Password operation failed");
    }

    return result;
  }

  async forgotPassword(data: ForgotPasswordFormValues): Promise<void> {
    await this.request("forgot", data);
  }
}

export const passwordService = new PasswordService();
