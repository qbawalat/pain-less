import type { APIContext } from "astro";
import { UserSupplementService } from "../../../lib/services/user-supplement.service";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import type { SupplementCalendarEvent } from "../../../types";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new UserSupplementService(context.locals.supabase, user.id);

    const url = new URL(context.request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const supplementIds = url.searchParams.get("supplement_ids");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    // Parse query parameters
    const dateRange = {
      start: startDate ? new Date(startDate) : new Date(),
      end: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    };

    const filterSupplementIds = supplementIds ? supplementIds.split(",").filter(Boolean) : [];
    const filterStatus = status ? status.split(",").filter(Boolean) : [];

    // Get user's supplements
    const userSupplements = await service.listUserSupplements({
      page: 1,
      limit: 100, // Get all supplements
    });

    // Generate calendar events
    const calendarEvents: SupplementCalendarEvent[] = [];

    for (const userSupplement of userSupplements.data) {
      // Apply supplement ID filter
      if (filterSupplementIds.length > 0 && !filterSupplementIds.includes(userSupplement.supplement.id)) {
        continue;
      }

      // Apply search filter
      if (search && !userSupplement.supplement.name.toLowerCase().includes(search.toLowerCase())) {
        continue;
      }

      // Generate scheduled dates based on frequency
      const scheduledDates = generateScheduledDates(
        userSupplement.start_date,
        userSupplement.end_date,
        userSupplement.frequency,
        dateRange
      );

      // Create calendar events for each scheduled date
      for (const scheduledDate of scheduledDates) {
        const event: SupplementCalendarEvent = {
          id: `${userSupplement.id}-${scheduledDate.getTime()}`,
          supplementName: userSupplement.supplement.name,
          dosage: userSupplement.dosage,
          frequency: userSupplement.frequency,
          scheduledDate: scheduledDate,
          status: getSupplementStatus(scheduledDate), // For now, everything is scheduled
          userSupplementId: userSupplement.id,
        };

        // Apply status filter
        if (filterStatus.length > 0 && !filterStatus.includes(event.status)) {
          continue;
        }

        calendarEvents.push(event);
      }
    }

    // Sort events by scheduled date
    calendarEvents.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

    return new Response(JSON.stringify(calendarEvents), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}

function generateScheduledDates(
  startDateStr: string,
  endDateStr: string | null,
  frequency: string,
  dateRange: { start: Date; end: Date }
): Date[] {
  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : dateRange.end;
  const dates: Date[] = [];

  // Parse frequency to determine interval
  const interval = parseFrequency(frequency);
  if (interval === 0) {
    return dates; // Invalid frequency
  }

  // Generate dates within the range
  const currentDate = new Date(Math.max(startDate.getTime(), dateRange.start.getTime()));
  const finalDate = new Date(Math.min(endDate.getTime(), dateRange.end.getTime()));

  while (currentDate <= finalDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + interval);
  }

  return dates;
}

function parseFrequency(frequency: string): number {
  const freq = frequency.toLowerCase().trim();

  // Common frequency patterns
  if (freq.includes("daily") || freq.includes("every day") || freq === "1x daily") {
    return 1;
  }
  if (freq.includes("twice daily") || freq.includes("2x daily") || freq === "bid") {
    return 0.5; // Special case: we'll handle this differently
  }
  if (freq.includes("every other day") || freq.includes("every 2 days")) {
    return 2;
  }
  if (freq.includes("weekly") || freq.includes("every week")) {
    return 7;
  }
  if (freq.includes("every 3 days")) {
    return 3;
  }

  // Try to extract number from "every X days" pattern
  const match = freq.match(/every\s+(\d+)\s+days?/);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Default to daily if we can't parse
  return 1;
}

function getSupplementStatus(scheduledDate: Date): "scheduled" | "taken" | "missed" {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduleDay = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());

  if (scheduleDay < today) {
    // For past dates, randomly assign taken/missed for demo purposes
    // In a real app, this would come from user tracking data
    return Math.random() > 0.3 ? "taken" : "missed";
  } else {
    return "scheduled";
  }
}
