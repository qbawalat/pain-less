import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  SupplementPlanResponse,
  HealthAnalysisResponse,
  HealthProfileResponse,
  UserSupplementResponse,
} from "../../types";
import { OpenRouterService } from "./openrouter.service";
import { HealthDataService } from "./health-data.service";

export class AIService {
  private readonly openRouter: OpenRouterService;
  private readonly healthDataService: HealthDataService;
  public healthProfile: HealthProfileResponse | null = null;
  public supplements: UserSupplementResponse[] = [];

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
    // Get user's health data from the database
    const healthData = await this.healthDataService.getUserHealthData();
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const response = await this.openRouter.sendMessage({
      messages: [
        {
          role: "system",
          content: `You are a health AI assistant specialized in supplement recommendations. 
          Analyze the following health data and provide recommendations.
          Today's date is ${today}. Use this as the reference point for calculating end dates.
          You must respond with a valid JSON object following this exact structure:
          {
            "recommendations": [
              {
                "name": "string (just the supplement name, e.g. 'Lutein')",
                "description": "string (detailed explanation of benefits and reasoning)",
                "dosage": "string (specific dosage like '500mg', '1 tablet', '2 capsules')",
                "frequency": "string (one of: 'daily', 'twice daily', 'every other day', 'every 3 days', 'weekly', 'with meals', 'before breakfast', 'before bed', 'as needed')",
                "end_date": "string (ISO date format, e.g. '2024-12-31', or null for ongoing supplements)",
                "confidence_score": number,
                "potential_interactions": string[]
              }
            ]
          }
          
          Do not include any text before or after the JSON object.
          The response must be parseable as JSON.
          Keep supplement names short and simple, separate from their descriptions.
          Always provide specific dosages in standard formats like '500mg', '1 tablet', '2 capsules'.
          Use only the predefined frequency values listed above.
          For end_date:
          - Use today's date (${today}) as the reference point
          - For supplements with a specific duration, calculate the end date from today
          - For ongoing supplements, use null
          - Always use ISO date format (YYYY-MM-DD) for dates
          - Ensure end dates are in the future relative to today`,
        },
        {
          role: "user",
          content: `Analyze this health data and provide supplement recommendations in JSON format: ${JSON.stringify(healthData)}`,
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
                    name: { type: "string" },
                    description: { type: "string" },
                    dosage: { type: "string" },
                    frequency: {
                      type: "string",
                      enum: [
                        "daily",
                        "twice daily",
                        "every other day",
                        "every 3 days",
                        "weekly",
                        "with meals",
                        "before breakfast",
                        "before bed",
                        "as needed",
                      ],
                    },
                    end_date: {
                      type: ["string", "null"],
                      description: "ISO date format or null for ongoing supplements",
                    },
                    confidence_score: { type: "number" },
                    potential_interactions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "name",
                    "description",
                    "dosage",
                    "frequency",
                    "end_date",
                    "confidence_score",
                    "potential_interactions",
                  ],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      },
    });

    // The response from OpenRouter is already parsed JSON
    const recommendations = response.recommendations as {
      name: string;
      description: string;
      dosage: string;
      frequency: string;
      end_date: string | null;
      confidence_score: number;
      potential_interactions: string[];
    }[];

    if (!recommendations || !Array.isArray(recommendations)) {
      throw new Error("Invalid response format from AI service");
    }

    return {
      plan: {
        recommendations,
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
