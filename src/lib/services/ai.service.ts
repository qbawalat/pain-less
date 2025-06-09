import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { SupplementPlanResponse, HealthAnalysisResponse } from "../../types";
import { OpenRouterService } from "./openrouter.service";
import { HealthDataService } from "./health-data.service";

export class AIService {
  private readonly openRouter: OpenRouterService;
  private readonly healthDataService: HealthDataService;
  public healthProfile: any = null;
  public supplements: any[] = [];

  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {
    this.openRouter = new OpenRouterService({
      defaultModel: "anthropic/claude-3-opus",
    });
    this.healthDataService = new HealthDataService(supabase, userId);
  }

  async generateSupplementPlan(): Promise<SupplementPlanResponse> {
    // Get user's health profile and current supplements
    const { data: healthProfile } = await this.supabase
      .from("health_profiles")
      .select("*")
      .eq("user_id", this.userId)
      .single();

    const { data: currentSupplements } = await this.supabase
      .from("user_supplements")
      .select("*")
      .eq("user_id", this.userId);

    // Prepare context for the AI
    const context = {
      healthProfile,
      currentSupplements,
    };

    const response = await this.openRouter.sendMessage({
      messages: [
        {
          role: "system",
          content: `You are a health AI assistant specialized in supplement recommendations. 
          Analyze the user's health profile and current supplements to provide personalized recommendations.
          Consider potential interactions and contraindications.
          Format your response as a JSON object with the following structure:
          {
            "recommendations": [
              {
                "supplement_id": "string",
                "confidence_score": number,
                "reasoning": "string",
                "potential_interactions": string[]
              }
            ]
          }`,
        },
        {
          role: "user",
          content: `Please analyze this health data and provide supplement recommendations: ${JSON.stringify(context)}`,
        },
      ],
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "supplement_plan",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    supplement_id: { type: "string" },
                    confidence_score: { type: "number" },
                    reasoning: { type: "string" },
                    potential_interactions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["supplement_id", "confidence_score", "reasoning", "potential_interactions"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      },
    });

    return {
      plan: {
        recommendations: response.recommendations as {
          supplement_id: string;
          confidence_score: number;
          reasoning: string;
          potential_interactions: string[];
        }[],
        generated_at: new Date().toISOString(),
      },
    };
  }

  async generateHealthAnalysis(): Promise<HealthAnalysisResponse> {
    // Get user's health data from the database
    const healthData = await this.healthDataService.getUserHealthData();

    const response = await this.openRouter.sendMessage({
      messages: [
        {
          role: "system",
          content: `You are a health AI assistant specialized in health analysis. 
          Analyze the following health data and provide recommendations.
          You must respond with a valid JSON object following this exact structure:
          {
            "alerts": [
              {
                "type": "warning" | "info",
                "message": "string",
                "confidence_score": number
              }
            ]
          }
          
          Do not include any text before or after the JSON object.
          The response must be parseable as JSON.`,
        },
        {
          role: "user",
          content: `Analyze this health data and provide health alerts in JSON format: ${JSON.stringify(healthData)}`,
        },
      ],
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "health_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              alerts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["warning", "info"] },
                    message: { type: "string" },
                    confidence_score: { type: "number" },
                  },
                  required: ["type", "message", "confidence_score"],
                },
              },
            },
            required: ["alerts"],
          },
        },
      },
    });

    // The response from OpenRouter is already parsed JSON
    const alerts = response.alerts as {
      type: "warning" | "info";
      message: string;
      confidence_score: number;
    }[];

    if (!alerts || !Array.isArray(alerts)) {
      throw new Error("Invalid response format from AI service");
    }

    return {
      analysis: {
        alerts,
        generated_at: new Date().toISOString(),
      },
    };
  }
}
