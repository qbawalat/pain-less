# System Feature Flags - Plan Implementacji

## 1. Struktura Modułu

```typescript
// Lokalizacja: src/features/
├── types.ts              // Typy i interfejsy
├── config.ts             // Konfiguracja flag dla środowisk
├── store.ts             // Store do zarządzania stanem flag
└── index.ts             // Główny punkt wejścia i eksport API
```

## 2. Definicja Typów (types.ts)

```typescript
export type Environment = "local" | "e2e" | "prod";
export type FeatureId = "auth" | "health-analysis" | "calendar" | "alerts";

interface RolloutConfig {
  percentage: number; // % użytkowników z dostępem
  enabled: boolean; // Globalne włączenie/wyłączenie
  overrides?: string[]; // Lista ID użytkowników z wymuszonym dostępem
}

interface EnvironmentConfig {
  [feature: FeatureId]: RolloutConfig;
}

interface FeatureFlagsConfig {
  [env: Environment]: EnvironmentConfig;
}
```

## 3. Konfiguracja (config.ts)

```typescript
const defaultConfig: FeatureFlagsConfig = {
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
```

## 4. API Modułu (index.ts)

```typescript
export interface FeatureFlagsAPI {
  isEnabled(feature: FeatureId): boolean;
  isEnabledForUser(feature: FeatureId, userId: string): boolean;
  getFeatureConfig(feature: FeatureId): RolloutConfig;
  override(feature: FeatureId, userId: string): void;
  removeOverride(feature: FeatureId, userId: string): void;
}
```

## 5. Integracja

### 5.1. Backend (API Endpoints)

```typescript
// Middleware dla API routes
import { isEnabled } from "@/features";

export const apiMiddleware = (feature: FeatureId) => {
  return (req, res, next) => {
    if (!isEnabled(feature)) {
      return res.status(404).json({ error: "Not Found" });
    }
    next();
  };
};
```

### 5.2. Frontend (Components)

```typescript
// Hook dla komponentów React
import { useFeatureFlag } from "@/features";

export const FeatureGate: React.FC<{
  feature: FeatureId;
  children: React.ReactNode;
}> = ({ feature, children }) => {
  const isEnabled = useFeatureFlag(feature);
  return isEnabled ? children : null;
};
```

### 5.3. Astro Pages

```typescript
// Middleware dla stron Astro
import { isEnabled } from "@/features";

export const checkFeatureFlag = (feature: FeatureId) => {
  return () => {
    if (!isEnabled(feature)) {
      return Response.redirect("/404");
    }
  };
};
```

## 6. Przykłady Użycia

### 6.1. W API Endpoint

```typescript
// /api/health-analysis/index.ts
export const GET = apiMiddleware("health-analysis")(async (req, res) => {
  // implementacja
});
```

### 6.2. W Komponencie React

```typescript
// MainView.tsx
<FeatureGate feature="health-analysis">
  <AIHealthAnalysisButton />
</FeatureGate>
```

### 6.3. W Stronie Astro

```typescript
// calendar.astro
export const prerender = false;
export const middleware = checkFeatureFlag("calendar");
```

## 7. Zmienne Środowiskowe

```env
ENV_NAME=local|e2e|prod
FEATURE_FLAGS_OVERRIDE=true|false  # Czy zezwalać na override
```

## 8. Następne Kroki

1. Implementacja podstawowych typów i konfiguracji
2. Stworzenie store'a do zarządzania stanem flag
3. Implementacja API modułu
4. Dodanie middleware dla API i stron
5. Stworzenie komponentów pomocniczych
6. Testy jednostkowe i integracyjne
7. Dokumentacja użycia

## 9. Uwagi Implementacyjne

- Użyć wzorca Singleton dla store'a flag
- Dodać walidację konfiguracji przy starcie
- Logowanie zmian stanu flag
- Dodać TypeScript strict mode
- Przygotować narzędzia do debugowania
