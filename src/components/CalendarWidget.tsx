import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserSupplementResponse, HealthAlertResponse } from "@/types";

interface CalendarWidgetProps {
  supplements: UserSupplementResponse[];
  alerts: HealthAlertResponse[];
}

export default function CalendarWidget({
  supplements = [], // Provide default empty array
  alerts = [], // Provide default empty array
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getEventsForDate = (date: Date) => {
    const events = [];

    // Add supplements if they exist
    if (Array.isArray(supplements)) {
      supplements.forEach((supplement) => {
        const startDate = new Date(supplement.start_date);
        const endDate = supplement.end_date ? new Date(supplement.end_date) : null;

        if (date.toDateString() === startDate.toDateString() || (endDate && date >= startDate && date <= endDate)) {
          events.push({
            type: "supplement",
            title: supplement.supplement.name,
            dosage: supplement.dosage,
          });
        }
      });
    }

    // Add alerts if they exist
    if (Array.isArray(alerts)) {
      alerts.forEach((alert) => {
        const alertDate = new Date(alert.created_at);
        if (date.toDateString() === alertDate.toDateString()) {
          events.push({
            type: "alert",
            title: alert.message,
            status: alert.status,
          });
        }
      });
    }

    return events;
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const weekDates = getWeekDates();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {weekDates.map((date, index) => {
            const events = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div key={index} className={`min-h-[100px] p-1 border rounded-sm ${isToday ? "bg-muted" : ""}`}>
                <div className="text-sm font-medium">{date.getDate()}</div>
                <div className="space-y-1">
                  {events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded ${
                        event.type === "supplement" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
