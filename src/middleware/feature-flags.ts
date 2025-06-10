import { defineMiddleware } from "astro:middleware";
import { FeatureFlagsStore } from "@/features";
import { getRequiredFeatureFlag } from "@/lib/constants/routes";

export const featureFlagsMiddleware = defineMiddleware(async (context, next) => {
  const store = FeatureFlagsStore.getInstance();
  const pathname = new URL(context.request.url).pathname;

  // Sprawdź czy dana ścieżka wymaga sprawdzenia flagi
  const requiredFlag = getRequiredFeatureFlag(pathname);

  if (requiredFlag) {
    const isFeatureEnabled = store.isEnabled(requiredFlag);

    if (!isFeatureEnabled) {
      return context.redirect("/404");
    }
  }

  return next();
});
