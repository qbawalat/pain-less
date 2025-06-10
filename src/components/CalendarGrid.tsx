import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SupplementTooltip } from "@/components/SupplementTooltip";
import { LoadingSkeletons } from "@/components/LoadingSkeletons";
import { cn } from "@/lib/utils";
import type { SupplementCalendarEvent, ViewType } from "@/types";

interface CalendarGridProps {
  supplements: SupplementCalendarEvent[];
  viewType: ViewType;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
}

export function CalendarGrid({ supplements, viewType, selectedDate, onDateSelect, isLoading }: CalendarGridProps) {
  const [hoveredSupplement, setHoveredSupplement] = useState<SupplementCalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (isLoading) {
    return <LoadingSkeletons.CalendarSkeleton />;
  }

  const getSupplementsForDate = (date: Date) => {
    return supplements.filter((supplement) => supplement.scheduledDate.toDateString() === date.toDateString());
  };

  const handleSupplementHover = (supplement: SupplementCalendarEvent, event: React.MouseEvent) => {
    setHoveredSupplement(supplement);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleSupplementLeave = () => {
    setHoveredSupplement(null);
  };

  const renderDayCell = (date: Date, isCurrentMonth = true) => {
    const daySupplements = getSupplementsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    return (
      <button
        key={date.toISOString()}
        type="button"
        aria-label={`Select ${date.toLocaleDateString()}`}
        className={cn(
          "min-h-[120px] p-2 border border-border cursor-pointer hover:bg-muted/50 transition-colors w-full text-left",
          !isCurrentMonth && "text-muted-foreground bg-muted/20",
          isToday && "bg-primary/10 border-primary/30",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => onDateSelect(date)}
      >
        <div className={cn("text-sm font-medium mb-2", isToday && "text-primary font-bold")}>{date.getDate()}</div>

        <div className="space-y-1">
          {daySupplements.slice(0, 3).map((supplement) => (
            <div
              key={supplement.id}
              className={cn(
                "text-xs p-1 rounded truncate cursor-pointer",
                supplement.status === "taken" && "bg-green-100 text-green-800 border border-green-200",
                supplement.status === "missed" && "bg-red-100 text-red-800 border border-red-200",
                supplement.status === "scheduled" && "bg-blue-100 text-blue-800 border border-blue-200"
              )}
              onMouseEnter={(e) => handleSupplementHover(supplement, e)}
              onMouseLeave={handleSupplementLeave}
            >
              {supplement.supplementName}
            </div>
          ))}
          {daySupplements.length > 3 && (
            <div className="text-xs text-muted-foreground">+{daySupplements.length - 3} more</div>
          )}
        </div>
      </button>
    );
  };

  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Get first day of month and calculate calendar start
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Go back to Sunday

    // Generate 6 weeks of days (42 days)
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <Card>
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-sm bg-muted">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">{days.map((date) => renderDayCell(date, date.getMonth() === month))}</div>
        </CardContent>
      </Card>
    );
  };

  const renderWeekView = () => {
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-sm bg-muted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">{days.map((date) => renderDayCell(date, true))}</div>
        </CardContent>
      </Card>
    );
  };

  const renderDayView = () => {
    const daySupplements = getSupplementsForDate(selectedDate);

    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {daySupplements.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No supplements scheduled for this day</div>
          ) : (
            <div className="space-y-3">
              {daySupplements.map((supplement) => (
                <div
                  key={supplement.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer",
                    supplement.status === "taken" && "bg-green-50 border-green-200",
                    supplement.status === "missed" && "bg-red-50 border-red-200",
                    supplement.status === "scheduled" && "bg-blue-50 border-blue-200"
                  )}
                  onMouseEnter={(e) => handleSupplementHover(supplement, e)}
                  onMouseLeave={handleSupplementLeave}
                >
                  <div className="font-medium">{supplement.supplementName}</div>
                  <div className="text-sm text-muted-foreground">
                    {supplement.dosage} • {supplement.frequency}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-2 capitalize",
                      supplement.status === "taken" && "text-green-700",
                      supplement.status === "missed" && "text-red-700",
                      supplement.status === "scheduled" && "text-blue-700"
                    )}
                  >
                    {supplement.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative">
      {viewType === "month" && renderMonthView()}
      {viewType === "week" && renderWeekView()}
      {viewType === "day" && renderDayView()}

      {hoveredSupplement && (
        <SupplementTooltip supplement={hoveredSupplement} position={tooltipPosition} isOpen={true} />
      )}
    </div>
  );
}
