import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Filter, RotateCcw } from "lucide-react";
import type { ViewType, SupplementFilterOptions, DateRange } from "@/types";

interface CalendarHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  filters: SupplementFilterOptions;
  onFilterChange: (filters: Partial<SupplementFilterOptions>) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarHeader({
  currentView,
  onViewChange,
  filters,
  onFilterChange,
  selectedDate,
  onDateChange,
}: CalendarHeaderProps) {
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);

    switch (currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
    }

    onDateChange(newDate);
  };

  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions = {};

    switch (currentView) {
      case "month":
        options.year = "numeric";
        options.month = "long";
        break;
      case "week":
        const weekStart = new Date(selectedDate);
        const weekEnd = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
      case "day":
        options.year = "numeric";
        options.month = "long";
        options.day = "numeric";
        options.weekday = "long";
        break;
    }

    return selectedDate.toLocaleDateString("en-US", options);
  };

  const resetFilters = () => {
    onFilterChange({
      supplementIds: [],
      status: [],
      search: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Supplement Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium min-w-[200px] text-center">{formatDateDisplay()}</div>
            <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={currentView} onValueChange={(value: ViewType) => onViewChange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => onDateChange(new Date())}>
              Today
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Input
            placeholder="Search supplements..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="max-w-xs"
          />

          <Select
            value={filters.status.length > 0 ? filters.status[0] : "all"}
            onValueChange={(value) =>
              onFilterChange({
                status: value === "all" ? [] : [value],
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="taken">Taken</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
