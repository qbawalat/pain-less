import { useState, useEffect } from "react";
import type { FeatureId, FeatureConfig } from "./types";

export class FeatureFlagsStore {
  private static instance: FeatureFlagsStore;
  private config: Record<FeatureId, FeatureConfig>;
  private cache: Map<string, boolean>;
  private subscribers: Set<() => void>;

  private constructor() {
    this.config = this.loadConfigFromEnv();
    this.cache = new Map();
    this.subscribers = new Set();

    // Walidacja konfiguracji przy starcie
    this.validateConfig();
  }

  public static getInstance(): FeatureFlagsStore {
    if (!FeatureFlagsStore.instance) {
      FeatureFlagsStore.instance = new FeatureFlagsStore();
    }
    return FeatureFlagsStore.instance;
  }

  private isTruthy(value: unknown): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const lowered = value.toLowerCase();
      return lowered === "true" || lowered === "1" || lowered === "yes";
    }
    return false;
  }

  private loadConfigFromEnv(): Record<FeatureId, FeatureConfig> {
    return {
      calendar: {
        enabled: this.isTruthy(import.meta.env.PUBLIC_FEATURE_FLAG_CALENDAR),
        percentage: parseInt(import.meta.env.PUBLIC_FEATURE_FLAG_CALENDAR_PERCENTAGE || "0"),
        forceEnabledUsers:
          import.meta.env.PUBLIC_FEATURE_FLAG_CALENDAR_FORCE_ENABLE_FOR_USERS?.split(",").filter(Boolean) || [],
      },
      ai_analysis: {
        enabled: this.isTruthy(import.meta.env.PUBLIC_FEATURE_FLAG_AI_ANALYSIS),
        percentage: parseInt(import.meta.env.PUBLIC_FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE || "0"),
        forceEnabledUsers:
          import.meta.env.PUBLIC_FEATURE_FLAG_AI_ANALYSIS_FORCE_ENABLE_FOR_USERS?.split(",").filter(Boolean) || [],
      },
      advanced_stats: {
        enabled: this.isTruthy(import.meta.env.PUBLIC_FEATURE_FLAG_ADVANCED_STATS),
        percentage: parseInt(import.meta.env.PUBLIC_FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE || "0"),
        forceEnabledUsers:
          import.meta.env.PUBLIC_FEATURE_FLAG_ADVANCED_STATS_FORCE_ENABLE_FOR_USERS?.split(",").filter(Boolean) || [],
      },
    };
  }

  private validateConfig(): void {
    const requiredFeatures: FeatureId[] = ["calendar", "ai_analysis", "advanced_stats"];

    for (const feature of requiredFeatures) {
      if (!this.config[feature]) {
        throw new Error(`Missing configuration for feature "${feature}"`);
      }
    }
  }

  public isEnabled(featureId: FeatureId, userId?: string): boolean {
    const cacheKey = `${featureId}:${userId || "anonymous"}`;

    // Sprawdź cache
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const config = this.config[featureId];

    // Jeśli flaga jest wyłączona globalnie
    if (!config.enabled) {
      this.cache.set(cacheKey, false);
      return false;
    }

    // Sprawdź czy użytkownik ma wymuszone włączenie flagi
    if (userId && config.forceEnabledUsers?.includes(userId)) {
      this.cache.set(cacheKey, true);
      return true;
    }

    // Sprawdź rollout procentowy dla zalogowanych użytkowników
    if (userId && config.percentage) {
      const hash = this.hashString(`${featureId}:${userId}`);
      const isInRollout = hash % 100 < config.percentage;
      this.cache.set(cacheKey, isInRollout);
      return isInRollout;
    }

    // Domyślnie zwróć wartość globalnej flagi
    this.cache.set(cacheKey, config.enabled);
    return config.enabled;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }
}

// Hook dla React
export function useFeatureFlag(feature: FeatureId) {
  const [isEnabled, setIsEnabled] = useState(() => FeatureFlagsStore.getInstance().isEnabled(feature));

  useEffect(() => {
    const unsubscribe = FeatureFlagsStore.getInstance().subscribe(() => {
      setIsEnabled(FeatureFlagsStore.getInstance().isEnabled(feature));
    });
    return unsubscribe;
  }, [feature]);

  return isEnabled;
}
