import type { FeatureFlagsConfig } from "./types";

export const defaultConfig: FeatureFlagsConfig = {
  local: {
    auth: { enabled: true, percentage: 100 },
    "health-analysis": { enabled: true, percentage: 100 },
    calendar: { enabled: true, percentage: 100 },
    alerts: { enabled: true, percentage: 100 },
  },
  e2e: {
    auth: { enabled: true, percentage: 100 },
    "health-analysis": { enabled: true, percentage: 50 },
    calendar: { enabled: true, percentage: 50 },
    alerts: { enabled: false, percentage: 0 },
  },
  prod: {
    auth: { enabled: true, percentage: 100 },
    "health-analysis": { enabled: true, percentage: 20 },
    calendar: { enabled: false, percentage: 0 },
    alerts: { enabled: false, percentage: 0 },
  },
};
