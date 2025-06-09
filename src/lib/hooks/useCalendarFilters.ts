import { useState } from "react";
import type { SupplementFilterOptions, DateRange } from "@/types";

function getDefaultDateRange(): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
}

export function useCalendarFilters() {
  const [filters, setFilters] = useState<SupplementFilterOptions>({
    supplementIds: [],
    dateRange: getDefaultDateRange(),
    status: [],
    search: "",
  });

  const updateFilters = (newFilters: Partial<SupplementFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      supplementIds: [],
      dateRange: getDefaultDateRange(),
      status: [],
      search: "",
    });
  };

  const updateDateRange = (dateRange: DateRange) => {
    updateFilters({ dateRange });
  };

  const updateSearch = (search: string) => {
    updateFilters({ search });
  };

  const toggleSupplement = (supplementId: string) => {
    const newSupplementIds = filters.supplementIds.includes(supplementId)
      ? filters.supplementIds.filter((id) => id !== supplementId)
      : [...filters.supplementIds, supplementId];
    updateFilters({ supplementIds: newSupplementIds });
  };

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    updateFilters({ status: newStatus });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    updateDateRange,
    updateSearch,
    toggleSupplement,
    toggleStatus,
  };
}
