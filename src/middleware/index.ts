import { defineMiddleware, sequence } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import { featureFlagsMiddleware } from "./feature-flags";
import { routeNormalizerMiddleware } from "./route-normalizer";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/", "/calendar", "/profile", "/supplements", "/settings", "/medical-results"];

// Auth routes that should redirect to home if user is already authenticated
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_KEY as string;
export const onRequest = sequence(
  routeNormalizerMiddleware,
  featureFlagsMiddleware,
  defineMiddleware(async (context, next) => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    // Set supabase client in locals
    context.locals.supabase = supabase;

    // Get auth token from cookie
    const authToken = context.cookies.get("sb-auth-token")?.value;

    // If we have a token, set it in supabase
    if (authToken) {
      const {
        data: { session },
      } = await supabase.auth.setSession({
        access_token: authToken,
        refresh_token: authToken,
      });

      // Set user in locals
      context.locals.user = session?.user ?? null;
    } else {
      context.locals.user = null;
    }

    const pathname = new URL(context.request.url).pathname;

    // If user is authenticated and tries to access auth pages, redirect to home
    if (context.locals.user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
      return context.redirect("/");
    }

    // Check if route requires auth
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || (route !== "/" && pathname.startsWith(route))
    );

    // If route requires auth and user is not authenticated, redirect to login
    if (isProtectedRoute && !context.locals.user) {
      return context.redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }

    const response = await next();
    return response;
  })
);
