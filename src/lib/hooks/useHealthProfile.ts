import { useState, useEffect } from "react";
import type { HealthProfileResponse, HealthProfileUpdate } from "@/types";
import { toast } from "sonner";

export function useHealthProfile() {
  const [profile, setProfile] = useState<HealthProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/health-profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch health profile");
      }
      const data = await response.json();

      // Handle both paginated and direct responses
      if (data.data && !Array.isArray(data.data)) {
        // Single object in data property
        setProfile(data.data);
      } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Array in data property, take first item
        setProfile(data.data[0]);
      } else if (data.id) {
        // Direct object response
        setProfile(data);
      } else {
        setProfile(null);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      toast.error("Let's create your health profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile(update: HealthProfileUpdate) {
    try {
      const response = await fetch("/api/health-profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error("Failed to update health profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast.success("Health profile updated successfully");
      return updatedProfile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to update health profile");
      throw error;
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
