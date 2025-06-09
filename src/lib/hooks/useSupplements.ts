import { useState, useEffect } from "react";
import type { UserSupplementResponse, UserSupplementCreate } from "@/types";
import { toast } from "sonner";

export function useSupplements() {
  const [supplements, setSupplements] = useState<UserSupplementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSupplements();
  }, []);

  async function fetchSupplements() {
    try {
      const response = await fetch("/api/user-supplements");
      if (!response.ok) {
        throw new Error("Failed to fetch supplements");
      }
      const data = await response.json();
      setSupplements(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      toast.error("Failed to load supplements");
    } finally {
      setIsLoading(false);
    }
  }

  async function addSupplement(supplement: UserSupplementCreate) {
    try {
      const response = await fetch("/api/user-supplements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplement),
      });

      if (!response.ok) {
        throw new Error("Failed to add supplement");
      }

      const newSupplement = await response.json();
      setSupplements((prev) => [...prev, newSupplement]);
      toast.success("Supplement added successfully");
      return newSupplement;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to add supplement");
      throw error;
    }
  }

  async function editSupplement(id: string, update: UserSupplementCreate) {
    try {
      const response = await fetch(`/api/user-supplements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error("Failed to update supplement");
      }

      const updatedSupplement = await response.json();
      setSupplements((prev) => prev.map((sup) => (sup.id === id ? updatedSupplement : sup)));
      toast.success("Supplement updated successfully");
      return updatedSupplement;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to update supplement");
      throw error;
    }
  }

  async function deleteSupplement(id: string) {
    try {
      const response = await fetch(`/api/user-supplements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplement");
      }

      setSupplements((prev) => prev.filter((sup) => sup.id !== id));
      toast.success("Supplement deleted successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      toast.error("Failed to delete supplement");
      throw error;
    }
  }

  return {
    supplements,
    isLoading,
    error,
    addSupplement,
    editSupplement,
    deleteSupplement,
    refetch: fetchSupplements,
  };
}
