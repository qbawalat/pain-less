import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, AlertCircle } from "lucide-react";
import { AIAnalysisModal } from "@/components/AIAnalysisModal";
import { toast } from "sonner";
import type { HealthAnalysisResponse, SupplementPlanResponse } from "@/types";

interface AIHealthAnalysisButtonProps {
  className?: string;
  onAnalysisComplete?: () => void;
}

export function AIHealthAnalysisButton({ className, onAnalysisComplete }: AIHealthAnalysisButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysisResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/kindly-ask-for/health-analysis");

      if (!response.ok) {
        throw new Error("Failed to generate health analysis");
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
      setIsModalOpen(true);

      toast.success("Health analysis completed!");

      // Call the onAnalysisComplete callback to trigger alerts refetch
      onAnalysisComplete?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error("Failed to generate health analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSupplementPlan = async (): Promise<SupplementPlanResponse> => {
    const response = await fetch("/api/kindly-ask-for/supplement-plan");

    if (!response.ok) {
      throw new Error("Failed to generate supplement plan");
    }

    const plan = await response.json();
    toast.success("Supplement plan generated!");
    return plan;
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
          Analyzing Your Health...
        </>
      );
    }

    if (error) {
      return (
        <>
          <AlertCircle className="mr-3 h-6 w-6" />
          Try Again
        </>
      );
    }

    return (
      <>
        <Brain className="mr-3 h-6 w-6" />
        Ask AI for Health Analysis
      </>
    );
  };

  const getButtonVariant = () => {
    if (error) return "destructive";
    if (isLoading) return "secondary";
    return "default";
  };

  return (
    <>
      <div className={`flex flex-col items-center space-y-4 p-8 ${className || ""}`}>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">Get Personalized Health Insights</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Let our AI analyze your health profile and supplement regimen to provide personalized recommendations and
            insights.
          </p>
        </div>

        <Button
          onClick={handleAnalysis}
          disabled={isLoading}
          variant={getButtonVariant()}
          size="lg"
          className="h-16 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {getButtonContent()}
        </Button>

        {error && (
          <p className="text-sm text-destructive text-center max-w-md">
            {error}. Please try again or check your internet connection.
          </p>
        )}
      </div>

      <AIAnalysisModal
        analysis={analysis}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAnalysis(null);
        }}
        onRequestSupplementPlan={handleRequestSupplementPlan}
        onApprove={onAnalysisComplete}
      />
    </>
  );
}
