import { useState, useEffect } from "react";
import type { HealthAlertResponse, PaginationResponse } from "@/types";
import { toast } from "sonner";

export function useAlerts() {
  const [alerts, setAlerts] = useState<HealthAlertResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const response = await fetch("/api/health-alerts");
      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }
      const data = await response.json();

      // Handle both paginated and direct array responses
      if (data.data && Array.isArray(data.data)) {
        // Paginated response
        setAlerts(data.data);
      } else if (Array.isArray(data)) {
        // Direct array response
        setAlerts(data);
      } else {
        setAlerts([]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      toast.error("Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }

  async function acknowledgeAlert(id: string) {
    try {
      const response = await fetch(`/api/health-alerts/${id}/acknowledge`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "acknowledged" }),
      });

      if (!response.ok) {
        throw new Error("Failed to acknowledge alert");
      }

      const updatedAlert = await response.json();
      setAlerts((prev) => prev.map((alert) => (alert.id === id ? updatedAlert : alert)));
      toast.success("Alert acknowledged");
      return updatedAlert;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to acknowledge alert");
      throw error;
    }
  }

  return {
    alerts,
    isLoading,
    error,
    acknowledgeAlert,
    refetch: fetchAlerts,
  };
}
