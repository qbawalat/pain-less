import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { SupplementPlanResponse } from "@/types";
import { GeneratedSupplementPlan } from "./GeneratedSupplementPlan";

interface SupplementPlanSectionProps {
  supplementPlan: SupplementPlanResponse | null;
  isLoading: boolean;
  onRequestSupplementPlan: () => Promise<SupplementPlanResponse>;
  onApprove?: () => void;
}

export function SupplementPlanSection({
  supplementPlan,
  isLoading,
  onRequestSupplementPlan,
  onApprove,
}: SupplementPlanSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Supplement Plan</h3>
        {!supplementPlan && !isLoading && (
          <Button onClick={onRequestSupplementPlan} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              "Generate Plan"
            )}
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Generating your personalized supplement plan...</span>
            </div>
          </CardContent>
        </Card>
      ) : supplementPlan ? (
        <GeneratedSupplementPlan supplementPlan={supplementPlan} onApprove={onApprove} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Click the button above to generate a personalized supplement plan based on your health analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
