# Plan Refaktoryzacji pAIN-less

## 1. Krytyczne Obszary do Refaktoryzacji

### 1.1 System Autentykacji

- Złożony przepływ autentykacji rozproszony w wielu plikach
- Hardcodowane ID użytkowników w serwisach
- Niespójna obsługa błędów w przepływach autentykacji

### 1.2 System Feature Flags

- Złożona implementacja wzorca singleton
- Ścisłe powiązanie między flagami a routingiem
- Nieefektywny mechanizm cachowania

### 1.3 Komponent MainView

- Wiele hooków zarządzania stanem z podobnymi wzorcami
- Złożona logika renderowania warunkowego
- Brak właściwej implementacji granic błędów

## 2. Główne Problemy Jakościowe

### 2.1 Duplikacja Kodu

- Podobne wzorce zarządzania stanem w komponentach
- Powtarzająca się logika obsługi błędów
- Zduplikowana logika walidacji

### 2.2 Złożoność

- Nadmiernie złożony łańcuch middleware
- Złożona logika ewaluacji flag
- Zagnieżdżone renderowanie warunkowe w MainView

### 2.3 Stan Globalny

- Wzorzec singleton w FeatureFlagsStore
- Globalne zarządzanie stanem autentykacji
- Współdzielone instancje serwisów

## 3. Zapachy Kodu

### 3.1 Długie Metody

- `approveSupplementPlan` w SupplementPlanService (65 linii)
- Złożone funkcje middleware
- Długie metody renderowania komponentów

### 3.2 Primitive Obsession

- Używanie surowych stringów dla flag
- Bezpośrednia manipulacja stringami dat
- Surowa obsługa komunikatów błędów

### 3.3 Nieodpowiednia Intymność

- Ścisłe powiązanie między serwisami
- Bezpośredni dostęp do bazy danych w komponentach
- Współdzielony stan między niezwiązanymi komponentami

## 4. Priorytety i Metody Refaktoryzacji

### 4.1 Priorytet 1 - System Autentykacji

```typescript
// Obecnie:
const POC_USER = {
  id: "b8d7c922-9f3f-4796-9742-b1b39e0ac588",
  email: "diego@gmail.com",
};

// Proponowane:
interface AuthContext {
  user: User | null;
  session: Session | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthProvider: React.FC = ({ children }) => {
  // Implementacja
};
```

### 4.2 Priorytet 2 - Feature Flags

```typescript
// Obecnie:
export class FeatureFlagsStore {
  private static instance: FeatureFlagsStore;
  // ...

// Proponowane:
interface FeatureFlag {
  id: string;
  enabled: boolean;
  rules: FeatureRule[];
}

const useFeatureFlag = (featureId: string) => {
  // Implementacja używająca React Context
};
```

### 4.3 Priorytet 3 - Komponent MainView

```typescript
// Obecnie:
export default function MainView() {
  const { profile, isLoading, error } = useHealthProfile();
  const { supplements, isLoading, error } = useSupplements();
  // ...

// Proponowane:
const HealthProfileSection = () => {
  const { data, error } = useHealthProfile();
  return <ErrorBoundary>{/* Implementacja */}</ErrorBoundary>;
};

const SupplementsSection = () => {
  const { data, error } = useSupplements();
  return <ErrorBoundary>{/* Implementacja */}</ErrorBoundary>;
};
```

## 5. Natychmiastowe Ulepszenia

### 5.1 Ekstrakcja Logiki Autentykacji

```typescript
// src/lib/auth/auth-context.tsx
export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const login = async (credentials: Credentials) => {
    try {
      const { user, session } = await authService.login(credentials);
      setUser(user);
      setSession(session);
    } catch (error) {
      throw new AuthError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5.2 Refaktoryzacja Feature Flags

```typescript
// src/lib/features/feature-flags.ts
export const FeatureFlagsContext = createContext<FeatureFlagsContext | null>(null);

export const useFeatureFlag = (featureId: string) => {
  const context = useContext(FeatureFlagsContext);
  if (!context) throw new Error("useFeatureFlag must be used within FeatureFlagsProvider");
  return context.isEnabled(featureId);
};
```

### 5.3 Ulepszenie Obsługi Błędów

```typescript
// src/lib/errors/error-boundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## 6. Plan Implementacji

### 6.1 Faza 1 - Podstawowa Infrastruktura

1. Implementacja AuthContext i AuthProvider
2. Refaktoryzacja FeatureFlags
3. Implementacja ErrorBoundary

### 6.2 Faza 2 - Refaktoryzacja Komponentów

1. Podział MainView na mniejsze komponenty
2. Implementacja custom hooks dla zarządzania stanem
3. Wprowadzenie TypeScript interfaces dla props

### 6.3 Faza 3 - Optymalizacja

1. Implementacja memoizacji
2. Optymalizacja renderowania
3. Wprowadzenie lazy loading

## 7. Metryki Sukcesu

### 7.1 Jakość Kodu

- Redukcja duplikacji kodu o 50%
- Zwiększenie pokrycia testami do 80%
- Redukcja złożoności cyklomatycznej

### 7.2 Wydajność

- Szybsze pierwsze renderowanie
- Mniejsze zużycie pamięci
- Lepsza responsywność UI

### 7.3 Utrzymywalność

- Łatwiejsze dodawanie nowych funkcjonalności
- Prostsze debugowanie
- Lepsza dokumentacja kodu
