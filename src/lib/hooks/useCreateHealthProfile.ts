import { useState } from "react";
import type { HealthProfileResponse } from "@/types";
import { toast } from "sonner";

export function useCreateHealthProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function createProfile(data: Omit<HealthProfileResponse, "id" | "user_id">) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/health-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create health profile");
      }

      const profile = await response.json();
      toast.success("Health profile created successfully");
      return profile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      toast.error("Failed to create health profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createProfile,
    isLoading,
    error,
  };
}
