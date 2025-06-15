import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import { useState } from "react";
import type { SupplementPlanResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeneratedSupplementPlanProps {
  supplementPlan: SupplementPlanResponse;
  onApprove?: () => void;
}

export function GeneratedSupplementPlan({ supplementPlan, onApprove }: GeneratedSupplementPlanProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprovePlan = async () => {
    try {
      setIsApproving(true);
      const response = await fetch("/api/supplement-plan/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: {
            recommendations: supplementPlan.plan.recommendations,
            generated_at: supplementPlan.plan.generated_at,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve supplement plan");
      }

      toast.success("Supplement plan approved successfully!");
      onApprove?.(); // Call onApprove after successful approval
    } catch (error) {
      console.error("Failed to approve supplement plan:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve supplement plan. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-4">
      {supplementPlan.plan.recommendations.map((recommendation, index) => (
        <Card key={index} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">{recommendation.name}</h3>
                <Badge variant="secondary">Confidence: {Math.round(recommendation.confidence_score * 100)}%</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm leading-relaxed">{recommendation.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium">Dosage:</span>
                <span>{recommendation.dosage}</span>
                <span className="font-medium">Frequency:</span>
                <span className="capitalize">{recommendation.frequency}</span>
                <span className="font-medium">End Date:</span>
                <span>
                  {recommendation.end_date ? new Date(recommendation.end_date).toLocaleDateString() : "Ongoing"}
                </span>
              </div>
              {recommendation.potential_interactions.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Potential Interactions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {recommendation.potential_interactions.map((interaction, i) => (
                      <li key={i}>• {interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end mt-6">
        <Button onClick={handleApprovePlan} disabled={isApproving} className="bg-primary hover:bg-primary/90">
          {isApproving ? "Approving..." : "Approve Plan"}
        </Button>
      </div>
    </div>
  );
}
