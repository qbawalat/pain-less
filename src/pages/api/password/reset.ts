import { z } from "zod";
import type { APIRoute } from "astro";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  refresh_token: z.string(),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { password, refresh_token } = resetPasswordSchema.parse(data);

    // Get access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          error: "Authorization token is required",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const accessToken = authHeader.split(" ")[1];

    // Set the session with both tokens
    const { error: sessionError } = await locals.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token,
    });

    if (sessionError) {
      console.error("Session error:", sessionError);
      return new Response(
        JSON.stringify({
          error: "Invalid or expired reset token. Please request a new password reset link.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Update the user's password
    const { error: updateError } = await locals.supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to update password. Please try again.",
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
        message: "Password has been reset successfully. You can now sign in with your new password.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
