import { defineMiddleware } from "astro:middleware";
import { APP_ROUTES } from "@/lib/constants/routes";

// Ścieżki, które nie wymagają normalizacji (np. API, assety)
const EXCLUDED_PATHS = [
  "/api/", // API endpoints
  "/assets/", // Static assets
  "/_astro/", // Astro internal routes
  "/favicon.", // Favicon files
];

export const routeNormalizerMiddleware = defineMiddleware(async (context, next) => {
  const pathname = new URL(context.request.url).pathname;

  // Pomiń sprawdzanie dla wykluczonych ścieżek
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return next();
  }

  // Specjalne traktowanie dla strony głównej
  if (pathname === "/") {
    return next();
  }

  // Znajdź pasujący route (dokładne dopasowanie lub prefix)
  const matchingRoute = Object.values(APP_ROUTES).find((route) => pathname.startsWith(route));

  if (matchingRoute) {
    // Jeśli ścieżka nie jest dokładnie taka jak zdefiniowana w APP_ROUTES
    // a jest to ścieżka podstawowa (nie podścieżka), przekieruj
    if (pathname !== matchingRoute && !pathname.slice(matchingRoute.length).includes("/")) {
      return context.redirect(matchingRoute);
    }
  } else {
    // Ścieżka nie pasuje do żadnego zdefiniowanego route'a
    // Przekieruj na 404 tylko jeśli to nie jest strona 404
    if (pathname !== "/404") {
      return context.redirect("/404");
    }
  }

  return next();
});
