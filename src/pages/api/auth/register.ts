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

    const emailRedirectTo = `${new URL(request.url).origin}/auth/verify-email`;
    console.log("[REGISTER] emailRedirectTo:", emailRedirectTo);
    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });

    console.log("Supabase Response:", {
      data,
      error,
      user: data?.user,
      identities: data?.user?.identities,
    });

    if (data?.user?.identities?.length === 0) {
      // For security reasons, this error message must be generic and should not reveal whether the email is registered or not.
      return new Response(
        JSON.stringify({
          error: "If you already have an account or requested a reset, please check your email.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (error) {
      console.error("Supabase Auth Error:", {
        status: error.status,
        message: error.message,
        name: error.name,
        error,
      });

      if (error.status === 400 && error.message?.toLowerCase().includes("email")) {
        return new Response(
          JSON.stringify({
            error: "An account with this email already exists",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!data.user) {
      return new Response(
        JSON.stringify({
          error: "An account with this email already exists",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        message: "Please check your email to verify your account",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
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
