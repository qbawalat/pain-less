import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import type { HealthAnalysisResponse, SupplementPlanResponse } from "@/types";
import { SupplementPlanSection } from "./SupplementPlanSection";

interface AIAnalysisModalProps {
  analysis: HealthAnalysisResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSupplementPlan: () => Promise<SupplementPlanResponse>;
  onApprove?: () => void;
}

export function AIAnalysisModal({
  analysis,
  isOpen,
  onClose,
  onRequestSupplementPlan,
  onApprove,
}: AIAnalysisModalProps) {
  const [supplementPlan, setSupplementPlan] = useState<SupplementPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRequestSupplementPlan = async () => {
    try {
      setIsLoading(true);
      const plan = await onRequestSupplementPlan();
      setSupplementPlan(plan);
    } catch (error) {
      console.error("Failed to generate supplement plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">AI Health Analysis Results</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(analysis.analysis.generated_at).toLocaleDateString()}
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Health Analysis Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Health Analysis</h3>
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
              </>
            )}
          </div>

          {/* Supplement Plan Section */}
          <SupplementPlanSection
            supplementPlan={supplementPlan}
            isLoading={isLoading}
            onRequestSupplementPlan={handleRequestSupplementPlan}
            onApprove={() => {
              console.log("Modal onApprove called"); // Debug log
              onApprove?.();
              onClose();
            }}
          />

          {/* Next Steps Section */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">📋 Next Steps:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Review all recommendations carefully</li>
              <li>• Consult with your healthcare provider for medical advice</li>
              <li>• Consider potential interactions with your current supplements</li>
              <li>• Start with one supplement at a time to monitor effects</li>
              <li>• Monitor your health and update your profile regularly</li>
            </ul>
          </div>

          <div className="flex justify-end items-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              This analysis is for informational purposes only and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
