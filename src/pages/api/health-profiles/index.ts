import type { APIContext } from "astro";
import { HealthProfileService } from "../../../lib/services/health-profile.service";
import { healthProfileCreateSchema, healthProfileUpdateSchema } from "../../../lib/validation";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import { validate } from "../../../lib/validation";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new HealthProfileService(context.locals.supabase, user.id);

    const profile = await service.getProfile();
    if (!profile) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}

export async function POST(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new HealthProfileService(context.locals.supabase, user.id);

    const body = await context.request.json();
    const validatedData = validate(healthProfileCreateSchema, body);

    const profile = await service.createProfile(validatedData);

    return new Response(JSON.stringify(profile), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}

export async function PUT(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new HealthProfileService(context.locals.supabase, user.id);

    const body = await context.request.json();
    const validatedData = validate(healthProfileUpdateSchema, body);

    const profile = await service.updateProfile(validatedData);

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
