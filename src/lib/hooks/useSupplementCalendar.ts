import { useState, useEffect } from "react";
import type { SupplementCalendarEvent, SupplementFilterOptions } from "@/types";
import { toast } from "sonner";

export function useSupplementCalendar(filters: SupplementFilterOptions) {
  const [supplements, setSupplements] = useState<SupplementCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSupplementCalendar();
  }, [filters]);

  async function fetchSupplementCalendar() {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams({
        start_date: filters.dateRange.start.toISOString(),
        end_date: filters.dateRange.end.toISOString(),
        supplement_ids: filters.supplementIds.join(","),
        status: filters.status.join(","),
        search: filters.search,
      });

      const response = await fetch(`/api/supplements/calendar?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch supplement calendar");
      }

      const data = await response.json();

      // Handle both paginated and direct array responses
      let supplementsData: SupplementCalendarEvent[] = [];
      if (data.data && Array.isArray(data.data)) {
        supplementsData = data.data;
      } else if (Array.isArray(data)) {
        supplementsData = data;
      }

      // Transform date strings to Date objects
      const transformedSupplements = supplementsData.map((supplement) => ({
        ...supplement,
        scheduledDate: new Date(supplement.scheduledDate),
      }));

      setSupplements(transformedSupplements);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      toast.error("Failed to load supplement calendar");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    supplements,
    isLoading,
    error,
    refetch: fetchSupplementCalendar,
  };
}
