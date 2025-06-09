import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, X } from "lucide-react";
import type { HealthAnalysisResponse } from "@/types";

interface AIAnalysisModalProps {
  analysis: HealthAnalysisResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AIAnalysisModal({ analysis, isOpen, onClose }: AIAnalysisModalProps) {
  if (!analysis) return null;

  const getAlertIcon = (type: "warning" | "info") => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadgeVariant = (type: "warning" | "info") => {
    switch (type) {
      case "warning":
        return "destructive" as const;
      case "info":
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">AI Health Analysis Results</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(analysis.analysis.generated_at).toLocaleDateString()}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {analysis.analysis.alerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Info className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-semibold text-green-700">Great Health Profile!</h3>
                  <p className="text-muted-foreground">
                    No immediate health concerns detected in your current supplement regimen and health profile.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Health Insights & Recommendations ({analysis.analysis.alerts.length})
                </h3>
                <div className="space-y-4">
                  {analysis.analysis.alerts.map((alert, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getAlertIcon(alert.type)}
                            <Badge variant={getAlertBadgeVariant(alert.type)} className="capitalize">
                              {alert.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {Math.round(alert.confidence_score * 100)}%
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{alert.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">📋 Next Steps:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Review the recommendations above carefully</li>
                  <li>• Consult with your healthcare provider for medical advice</li>
                  <li>• Consider adjusting your supplement regimen as suggested</li>
                  <li>• Monitor your health and update your profile regularly</li>
                </ul>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              This analysis is for informational purposes only and should not replace professional medical advice.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
