import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { HealthAlertResponse } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AlertSystemProps {
  alerts: HealthAlertResponse[];
  onAcknowledge: (id: string) => Promise<void>;
}

export default function AlertSystem({
  alerts = [], // Provide default empty array
  onAcknowledge,
}: AlertSystemProps) {
  // Ensure alerts is an array
  const alertsList = Array.isArray(alerts) ? alerts : [];

  const sortedAlerts = [...alertsList].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getAlertColor = (type: "warning" | "info") => {
    return type === "warning"
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Health Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAlerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No active alerts</p>
          ) : (
            sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${getAlertColor(
                  alert.alert_type as "warning" | "info"
                )}`}
                role="alert"
              >
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
                {alert.status === "pending" && (
                  <Button variant="outline" size="sm" onClick={() => onAcknowledge(alert.id)} className="shrink-0">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Acknowledge
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
