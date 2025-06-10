import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NavigationBar from "@/components/NavigationBar";
import { CalendarHeader } from "@/components/CalendarHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { useSupplementCalendar } from "@/lib/hooks/useSupplementCalendar";
import { useCalendarFilters } from "@/lib/hooks/useCalendarFilters";
import type { ViewType } from "@/types";

export default function CalendarView() {
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { filters, updateFilters, updateDateRange } = useCalendarFilters();
  const { supplements, isLoading, error, refetch } = useSupplementCalendar(filters);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Unable to load supplement calendar</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <NavigationBar />
      </ErrorBoundary>

      <div className="container mx-auto p-6 space-y-6">
        <ErrorBoundary>
          <CalendarHeader
            currentView={currentView}
            onViewChange={setCurrentView}
            filters={filters}
            onFilterChange={updateFilters}
            selectedDate={selectedDate}
            onDateChange={(date: Date) => {
              setSelectedDate(date);
              // Update date range based on view when date changes
              const newRange = getDateRangeForView(date, currentView);
              updateDateRange(newRange);
            }}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <CalendarGrid
            supplements={supplements}
            viewType={currentView}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            isLoading={isLoading}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function getDateRangeForView(date: Date, view: ViewType) {
  const start = new Date(date);
  const end = new Date(date);

  switch (view) {
    case "month":
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
      break;
    case "week":
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      end.setDate(start.getDate() + 6);
      break;
    case "day":
      // For day view, start and end are the same day
      break;
  }

  return { start, end };
}
