import type { FeatureId } from "@/features";

// Definicja wszystkich ścieżek w aplikacji
export const APP_ROUTES = {
  HOME: "/",
  CALENDAR: "/calendar",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

// Type dla wszystkich możliwych ścieżek
export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

// Mapowanie ścieżek do flag funkcji
export const ROUTE_FEATURE_FLAGS: Partial<Record<AppRoute, FeatureId>> = {
  [APP_ROUTES.CALENDAR]: "calendar",
} as const;

// Helper do sprawdzania czy ścieżka wymaga flagi
export function getRequiredFeatureFlag(path: string): FeatureId | undefined {
  const route = Object.values(APP_ROUTES).find((route) => path === route || (route !== "/" && path.startsWith(route)));

  if (!route) return undefined;
  return ROUTE_FEATURE_FLAGS[route];
}
