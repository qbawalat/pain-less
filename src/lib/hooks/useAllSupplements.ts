import { useState, useEffect } from "react";
import type { SupplementResponse } from "@/types";
import { toast } from "sonner";

export function useAllSupplements() {
  const [supplements, setSupplements] = useState<SupplementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSupplements();
  }, []);

  async function fetchSupplements() {
    try {
      const response = await fetch("/api/supplements");
      if (!response.ok) {
        throw new Error("Failed to fetch supplements");
      }
      const data = await response.json();

      // Handle both paginated and direct array responses
      if (data.data && Array.isArray(data.data)) {
        setSupplements(data.data);
      } else if (Array.isArray(data)) {
        setSupplements(data);
      } else {
        setSupplements([]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      toast.error("Failed to load supplement options");
    } finally {
      setIsLoading(false);
    }
  }

  async function createSupplement(name: string, description?: string) {
    try {
      const response = await fetch("/api/supplements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || `User-added supplement: ${name}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create supplement");
      }

      const newSupplement = await response.json();
      setSupplements((prev) => [...prev, newSupplement]);
      return newSupplement;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to create supplement");
      throw error;
    }
  }

  return {
    supplements,
    isLoading,
    error,
    createSupplement,
    refetch: fetchSupplements,
  };
}
