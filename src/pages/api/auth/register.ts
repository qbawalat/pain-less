import type { APIRoute } from "astro";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/verify-email`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return new Response(
          JSON.stringify({
            error: "An account with this email already exists",
          }),
          { status: 400 }
        );
      }

      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        message: "Please check your email to verify your account",
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: error.errors[0].message,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
