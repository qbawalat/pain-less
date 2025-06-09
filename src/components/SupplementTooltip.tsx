import { cn } from "@/lib/utils";
import type { SupplementCalendarEvent } from "@/types";

interface SupplementTooltipProps {
  supplement: SupplementCalendarEvent;
  position: { x: number; y: number };
  isOpen: boolean;
}

export function SupplementTooltip({ supplement, position, isOpen }: SupplementTooltipProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "text-green-700 bg-green-100";
      case "missed":
        return "text-red-700 bg-red-100";
      case "scheduled":
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div
      className="fixed z-50 bg-background border border-border rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: "translate(0, -100%)",
      }}
    >
      <div className="space-y-2">
        <div className="font-semibold text-sm">{supplement.supplementName}</div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dosage:</span>
            <span>{supplement.dosage}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Frequency:</span>
            <span>{supplement.frequency}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled:</span>
            <span>{supplement.scheduledDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-1 border-t border-border">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize",
              getStatusColor(supplement.status)
            )}
          >
            {supplement.status}
          </span>
        </div>
      </div>
    </div>
  );
}
