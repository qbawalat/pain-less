import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/db/database.types";
import type { SupplementPlanResponse } from "@/types";
import { SupplementService } from "./supplement.service";
import { UserSupplementService } from "./user-supplement.service";

export class SupplementPlanService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async approveSupplementPlan(plan: SupplementPlanResponse): Promise<void> {
    // First, find or create all supplements
    const supplementService = new SupplementService(this.supabase, this.userId);
    const supplements = await supplementService.bulkFindOrCreateSupplements(
      plan.plan.recommendations.map((rec) => ({
        name: rec.name,
        description: rec.description,
        interactions: rec.potential_interactions,
      }))
    );

    // Then create user supplements
    const userSupplementService = new UserSupplementService(this.supabase, this.userId);
    const startDate = new Date().toISOString();

    const userSupplements = plan.plan.recommendations.map((rec) => {
      const supplement = supplements.find((s) => s.name.toLowerCase() === rec.name.toLowerCase());
      if (!supplement) {
        throw new Error(`Supplement ${rec.name} not found or could not be created`);
      }

      // Validate end date if provided
      let endDate = rec.end_date;
      console.log(`Processing supplement ${rec.name}:`, {
        originalEndDate: rec.end_date,
        parsedEndDate: endDate,
      });

      if (endDate) {
        const proposedEndDate = new Date(endDate);
        const start = new Date(startDate);
        if (proposedEndDate <= start) {
          throw new Error(`Invalid end date for ${rec.name}: end date must be after start date`);
        }
        endDate = proposedEndDate.toISOString();
      }

      const userSupplement = {
        supplement_id: supplement.id,
        dosage: rec.dosage,
        frequency: rec.frequency,
        start_date: startDate,
        end_date: endDate,
      };

      console.log(`Created user supplement for ${rec.name}:`, userSupplement);
      return userSupplement;
    });

    console.log("Bulk adding user supplements:", userSupplements);
    await userSupplementService.bulkAddUserSupplements(userSupplements);
  }
}
