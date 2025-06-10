import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    auth: {
      persistSession: true,
    },
  });

  // Set supabase client in locals
  context.locals.supabase = supabase;

  // Get session from supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Set user in locals
  context.locals.user = session?.user ?? null;

  // Check if route requires auth
  const protectedRoutes = ["/calendar", "/profile", "/supplements"];
  const isProtectedRoute = protectedRoutes.some((route) => context.url.pathname.startsWith(route));

  if (isProtectedRoute && !context.locals.user) {
    return context.redirect(`/auth/login?redirect=${encodeURIComponent(context.url.pathname)}`);
  }

  const response = await next();

  // Set cookie if we have a session
  if (session) {
    response.headers.set("Set-Cookie", `sb-token=${session.access_token}; Path=/; HttpOnly; SameSite=Strict`);
  }

  return response;
});
