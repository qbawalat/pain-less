# Plan Refaktoryzacji pAIN-less

## 0. Testy Przed Refaktoryzacją

### 0.1 Testy E2E

```typescript
// Testy dla głównych ścieżek użytkownika
describe("User Flows", () => {
  it("manages supplements lifecycle", () => {
    // E2E: Dodanie suplementu -> Edycja -> Usunięcie
  });

  it("handles health alerts workflow", () => {
    // E2E: Generowanie alertu -> Wyświetlenie -> Potwierdzenie
  });

  it("performs AI health analysis", () => {
    // E2E: Kliknięcie analizy -> Generowanie -> Wyświetlenie wyników
  });
});

// Testy dla integracji komponentów
describe("Component Integration", () => {
  it("synchronizes calendar with supplements and alerts", () => {
    // E2E: Sprawdzenie czy kalendarz poprawnie wyświetla suplementy i alerty
  });

  it("updates dashboard after profile changes", () => {
    // E2E: Zmiana profilu -> Odświeżenie dashboardu
  });
});
```

### 0.2 Testy Jednostkowe Komponentów UI

```typescript
// Testy dla MainView
describe("MainView", () => {
  it("renders loading state when data is loading", () => {});
  it("renders create profile form when no profile exists", () => {});
  it("renders dashboard when profile exists", () => {});
  it("handles global error state", () => {});
  // refetch po AI analysis - przeniesiony do testów e2e
});

// Testy dla CalendarWidget
describe("CalendarWidget", () => {
  it("displays current week dates", () => {});
  it("shows supplements for correct dates", () => {});
  it("shows alerts for correct dates", () => {});
  it("handles navigation between weeks", () => {});
  it("limits events display to 5 per day", () => {});
});

// Testy dla SupplementList
describe("SupplementList", () => {
  it("displays list of supplements", () => {});
  it("validates form data correctly", () => {});
  // operacje CRUD przeniesione do testów e2e
});

// Testy dla AlertSystem
describe("AlertSystem", () => {
  it("displays list of alerts", () => {});
  it("shows correct alert status", () => {});
  it("handles empty alerts state", () => {});
  // acknowledge alert przeniesiony do testów e2e
});

// Testy dla CreateHealthProfile
describe("CreateHealthProfile", () => {
  it("validates required fields", () => {});
  it("prevents duplicate conditions", () => {});
  // operacje na warunkach medycznych przeniesione do testów e2e
});
```

### 0.3 Testy Hooków

```typescript
// Testy dla useHealthProfile
describe("useHealthProfile", () => {
  it("fetches profile data on mount", () => {});
  it("handles fetch error", () => {});
  it("handles empty profile state", () => {});
  // update profile przeniesiony do testów e2e
});

// Testy dla useAlerts
describe("useAlerts", () => {
  it("fetches alerts on mount", () => {});
  it("handles fetch error", () => {});
  it("handles empty alerts state", () => {});
  // acknowledge alert przeniesiony do testów e2e
});

// Testy dla useSupplements
describe("useSupplements", () => {
  it("fetches supplements on mount", () => {});
  it("handles fetch error", () => {});
  // operacje CRUD przeniesione do testów e2e
});

// Testy dla useCreateHealthProfile
describe("useCreateHealthProfile", () => {
  it("validates profile data", () => {});
  it("handles creation error", () => {});
  // create profile przeniesiony do testów e2e
});
```

### 0.4 Testy Serwisów

```typescript
// Testy dla HealthDataService
describe("HealthDataService", () => {
  it("calculates age correctly", () => {});
  it("transforms supplements data", () => {});
  it("handles service errors", () => {});
  // fetch complete health data przeniesiony do testów e2e
});
```

### 0.5 Testy Walidacji Formularzy

```typescript
// Testy dla useFormValidation
describe("useFormValidation", () => {
  it("validates form data correctly", () => {});
  it("shows validation errors", () => {});
  it("handles form submission", () => {});
  it("resets form state", () => {});
  it("handles async validation", () => {});
});
```

### 0.6 Testy Komponentów z Loading State

```typescript
// Testy dla withLoadingState HOC
describe("withLoadingState", () => {
  it("shows loading state", () => {});
  it("shows error state", () => {});
  it("renders children when loaded", () => {});
  it("handles retry functionality", () => {});
});
```

### 0.7 Testy Obsługi Odpowiedzi API

```typescript
// Testy dla apiResponseHandler
describe("apiResponseHandler", () => {
  it("handles successful response", () => {});
  it("handles paginated response", () => {});
  it("transforms data correctly", () => {});
  it("handles empty response", () => {});
  it("handles malformed response", () => {});
});
```

## 1. Identyfikacja Powtórzeń w Kodzie

### 1.1 Hooki Zarządzania Stanem API

```typescript
// Powtarzający się wzorzec w:
- useAlerts.ts
- useHealthProfile.ts
- useAllSupplements.ts
- useSupplementCalendar.ts

// Wspólny wzorzec:
- useState dla danych, loading i error
- useEffect do fetchowania
- podobna obsługa błędów
- podobna logika refetch

// Proponowane rozwiązanie:
const useApiResource = <T>(endpoint: string, options?: ApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Wspólna implementacja
  return { data, isLoading, error, refetch };
};
```

### 1.2 Obsługa Błędów i Toast

```typescript
// Powtarzający się wzorzec w:
- useLoginForm.ts
- useCreateHealthProfile.ts
- useAlerts.ts
- useHealthProfile.ts

// Wspólny wzorzec:
- try/catch z toast.error
- konwersja błędów na Error
- podobne komunikaty

// Proponowane rozwiązanie:
const useErrorHandler = (options: ErrorHandlerOptions) => {
  const handleError = (error: unknown) => {
    // Wspólna implementacja obsługi błędów
  };
  return { handleError };
};
```

### 1.3 Walidacja Formularzy

```typescript
// Powtarzający się wzorzec w:
- useLoginForm.ts
- useCreateHealthProfile.ts
- CreateHealthProfile.tsx

// Wspólny wzorzec:
- useForm z react-hook-form
- zodResolver
- podobna struktura walidacji

// Proponowane rozwiązanie:
const useFormValidation = <T>(schema: ZodSchema<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  return { form };
};
```

### 1.4 Obsługa Odpowiedzi API

```typescript
// Powtarzający się wzorzec w:
- useAlerts.ts
- useHealthProfile.ts
- useSupplementCalendar.ts

// Wspólny wzorzec:
- sprawdzanie response.ok
- obsługa paginacji
- transformacja danych

// Proponowane rozwiązanie:
const apiResponseHandler = {
  handleResponse: async <T>(response: Response): Promise<T> => {
    // Wspólna implementacja
  },
  handlePagination: <T>(data: any): T[] => {
    // Wspólna implementacja
  }
};
```

### 1.5 Komponenty UI z Loading State

```typescript
// Powtarzający się wzorzec w:
- MainView.tsx
- CreateHealthProfile.tsx
- LoginForm.tsx

// Wspólny wzorzec:
- isLoading state
- podobne komponenty loading
- podobne komponenty error

// Proponowane rozwiązanie:
const withLoadingState = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithLoadingState(props: P & LoadingStateProps) {
    // Wspólna implementacja
  };
};
```
