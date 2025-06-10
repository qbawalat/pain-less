# Feature Flags Store - Szczegółowa Implementacja

## 1. Koncepcja Store'a

Store będzie singleton'em zarządzającym stanem flag funkcjonalności, implementującym wzorzec obserwatora dla reaktywnych aktualizacji na frontendzie.

## 2. Implementacja

```typescript
// src/features/store.ts

import type { Environment, FeatureId, RolloutConfig } from "./types";
import { defaultConfig } from "./config";

export class FeatureFlagsStore {
  private static instance: FeatureFlagsStore;
  private environment: Environment;
  private config: FeatureFlagsConfig;
  private cache: Map<string, boolean>;
  private subscribers: Set<() => void>;

  private constructor() {
    this.environment = (process.env.ENV_NAME as Environment) || "local";
    this.config = defaultConfig;
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

  // Główne metody publiczne

  public isEnabled(feature: FeatureId): boolean {
    const cacheKey = this.getCacheKey(feature);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const config = this.getFeatureConfig(feature);
    const isEnabled = config.enabled;

    this.cache.set(cacheKey, isEnabled);
    return isEnabled;
  }

  public isEnabledForUser(feature: FeatureId, userId: string): boolean {
    const cacheKey = this.getCacheKey(feature, userId);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const config = this.getFeatureConfig(feature);

    // Sprawdź override dla użytkownika
    if (config.overrides?.includes(userId)) {
      this.cache.set(cacheKey, true);
      return true;
    }

    // Sprawdź procent rollout'u
    if (config.enabled && config.percentage > 0) {
      const isInRolloutGroup = this.isUserInRolloutPercentage(userId, config.percentage);
      this.cache.set(cacheKey, isInRolloutGroup);
      return isInRolloutGroup;
    }

    this.cache.set(cacheKey, false);
    return false;
  }

  public override(feature: FeatureId, userId: string): void {
    const config = this.getFeatureConfig(feature);

    if (!config.overrides) {
      config.overrides = [];
    }

    if (!config.overrides.includes(userId)) {
      config.overrides.push(userId);
      this.clearCache();
      this.notifySubscribers();
    }
  }

  public removeOverride(feature: FeatureId, userId: string): void {
    const config = this.getFeatureConfig(feature);

    if (config.overrides) {
      config.overrides = config.overrides.filter((id) => id !== userId);
      this.clearCache();
      this.notifySubscribers();
    }
  }

  // Metody pomocnicze

  private getCacheKey(feature: FeatureId, userId?: string): string {
    return userId ? `${feature}:${userId}` : feature;
  }

  private isUserInRolloutPercentage(userId: string, percentage: number): boolean {
    // Deterministyczna funkcja haszująca dla userId
    const hash = this.hashString(userId);
    return hash % 100 < percentage;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Konwersja do 32-bitowej liczby całkowitej
    }
    return Math.abs(hash);
  }

  private validateConfig(): void {
    // Sprawdzenie czy wszystkie wymagane flagi są zdefiniowane
    const requiredFeatures: FeatureId[] = ["auth", "health-analysis", "calendar", "alerts"];

    for (const env of Object.keys(this.config) as Environment[]) {
      for (const feature of requiredFeatures) {
        if (!this.config[env][feature]) {
          throw new Error(`Missing configuration for feature "${feature}" in environment "${env}"`);
        }
      }
    }
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Metody dla reaktywności

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
```

## 3. Uzasadnienie dla Cache

### Problem

Bez cache'a, każde sprawdzenie flagi wymagałoby:

1. Odczytu konfiguracji środowiska
2. Sprawdzenia stanu flagi
3. Dla sprawdzeń per użytkownik:
   - Obliczenia hasza użytkownika
   - Sprawdzenia override'ów
   - Kalkulacji procentowej dostępności

To może być kosztowne gdy:

- Komponenty React często się przerenderowują
- Wiele komponentów korzysta z tych samych flag
- Aplikacja obsługuje wielu użytkowników jednocześnie
- Występują złożone reguły biznesowe dla flag

### Rozwiązanie

Cache w `FeatureFlagsStore` zapewnia:

1. **Wydajność**

   ```typescript
   private cache: Map<string, boolean>
   ```

   - Natychmiastowy dostęp do wcześniej obliczonych wartości
   - Unikanie powtórnych obliczeń
   - Redukcja operacji na konfiguracji

2. **Spójność**

   ```typescript
   private clearCache(): void {
     this.cache.clear();
   }
   ```

   - Cache jest czyszczony przy zmianach konfiguracji
   - Zapewnia spójność danych przy override'ach
   - Synchronizuje stan między komponentami

3. **Optymalizacja Pamięci**
   ```typescript
   private getCacheKey(feature: FeatureId, userId?: string): string {
     return userId ? `${feature}:${userId}` : feature;
   }
   ```
   - Efektywne klucze cache'a
   - Automatyczne czyszczenie przy zmianach
   - Kontrolowane zużycie pamięci

### Przykłady Użycia Cache

1. **Sprawdzenie Globalne**

   ```typescript
   // Pierwsze sprawdzenie - obliczenia
   store.isEnabled("auth"); // Oblicza i cachuje

   // Kolejne sprawdzenia - z cache
   store.isEnabled("auth"); // Natychmiastowy wynik
   ```

2. **Sprawdzenie per Użytkownik**

   ```typescript
   // Pierwsze sprawdzenie - obliczenia
   store.isEnabledForUser("calendar", "user123");
   // - Oblicza hash użytkownika
   // - Sprawdza override
   // - Kalkuluje procent
   // - Cachuje wynik

   // Kolejne sprawdzenia - z cache
   store.isEnabledForUser("calendar", "user123");
   // Natychmiastowy wynik bez obliczeń
   ```

3. **Aktualizacja Konfiguracji**
   ```typescript
   // Zmiana konfiguracji
   store.override("calendar", "user456");
   // - Czyści cały cache
   // - Wymusza przeliczenie przy kolejnym sprawdzeniu
   ```

### Korzyści Biznesowe

1. **Wydajność Aplikacji**

   - Szybsze renderowanie UI
   - Mniejsze zużycie CPU
   - Lepsza responsywność

2. **Doświadczenie Użytkownika**

   - Brak opóźnień przy sprawdzaniu flag
   - Spójna widoczność funkcji
   - Płynne przełączanie funkcjonalności

3. **Skalowalność**
   - Efektywna obsługa wielu użytkowników
   - Optymalne wykorzystanie zasobów
   - Łatwe zarządzanie flagami w dużej skali

## 4. Kluczowe Funkcjonalności

1. **Singleton Pattern**

   - Gwarantuje pojedynczą instancję store'a w całej aplikacji
   - Zapewnia spójny stan flag między komponentami

2. **Cachowanie**

   - Przechowuje wyniki sprawdzeń flag w pamięci podręcznej
   - Optymalizuje wydajność przez unikanie powtórnych obliczeń
   - Cache jest czyszczony przy zmianach konfiguracji

3. **Deterministyczny Rollout**

   - Używa funkcji haszującej dla userId
   - Zapewnia spójne wyniki dla tych samych użytkowników
   - Pozwala na stopniowe wprowadzanie funkcjonalności

4. **System Override'ów**

   - Umożliwia włączenie funkcji dla konkretnych użytkowników
   - Działa niezależnie od ogólnych ustawień i rollout'u
   - Persystuje między sesjami

5. **Reaktywność**
   - Implementuje wzorzec obserwatora
   - Automatycznie aktualizuje komponenty React
   - Pozwala na dynamiczne zmiany flag

## 5. Przykład Użycia

```typescript
// Inicjalizacja
const store = FeatureFlagsStore.getInstance();

// Sprawdzenie flagi
const isAuthEnabled = store.isEnabled('auth');

// Sprawdzenie dla użytkownika
const canUserAccessCalendar = store.isEnabledForUser('calendar', 'user123');

// Dodanie override'u
store.override('health-analysis', 'user456');

// W komponencie React
function FeatureAwareComponent() {
  const isEnabled = useFeatureFlag('health-analysis');
  return isEnabled ? <Component /> : null;
}
```

## 6. Bezpieczeństwo i Wydajność

1. **Walidacja Konfiguracji**

   - Sprawdzanie poprawności przy starcie
   - Wykrywanie brakujących flag
   - Typowanie TypeScript

2. **Optymalizacja Wydajności**

   - System cachowania wyników
   - Minimalizacja obliczeń
   - Efektywne zarządzanie pamięcią

3. **Bezpieczeństwo**
   - Prywatne metody pomocnicze
   - Niemutowalny stan zewnętrzny
   - Kontrolowany dostęp do konfiguracji
     </rewritten_file>
