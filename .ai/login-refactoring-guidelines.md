# Wytyczne Refaktoryzacji Komponentów Logowania

## 1. Struktura i Organizacja

### 1.1 Podział Odpowiedzialności

- Komponenty UI w `src/components/auth`
- Custom hooki w `src/hooks`
- Serwisy w `src/services`
- Typy i interfejsy w `src/types`
- Stałe i konfiguracja w `src/config`

### 1.2 Nazewnictwo

```typescript
// Komponenty
LoginForm.tsx;
LoginEmailField.tsx;
LoginPasswordField.tsx;
LoginSubmitButton.tsx;

// Hooki
useLoginForm.ts;
useAuth.ts;

// Serwisy
AuthService.ts;
```

## 2. Dobre Praktyki React

### 2.1 Komponenty

- Używać wyłącznie komponentów funkcyjnych
- Dzielić duże komponenty na mniejsze, reużywalne części
- Unikać props drilling poprzez Context API
- Implementować Suspense dla komponentów ładowanych lazy
- Nie używać dyrektyw Next.js (np. "use client") w Astro

```typescript
// Przykład podziału komponentu
function LoginForm() {
  const { form, isLoading, error } = useLoginForm();

  return (
    <Form {...form}>
      <LoginEmailField />
      <LoginPasswordField />
      <LoginSubmitButton isLoading={isLoading} />
      {error && <LoginErrorMessage message={error} />}
    </Form>
  );
}
```

### 2.2 Hooki

- Wydzielać logikę biznesową do custom hooków
- Używać useCallback dla event handlerów
- Implementować useId dla dostępności
- Stosować useTransition dla nieblokujących aktualizacji UI

```typescript
// Przykład custom hooka
const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, handleSubmit };
};
```

### 2.3 Context API

- Używać dla współdzielenia stanu między komponentami
- Implementować custom hooki dla dostępu do kontekstu
- Zapewniać typowanie dla wartości kontekstu

```typescript
const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

## 3. Integracja z Astro

### 3.1 Hydratacja

- Używać odpowiednich dyrektyw client:\*
- Implementować lazy loading dla komponentów React
- Zapewniać fallback podczas ładowania

```typescript
---
const LoginForm = lazy(() => import('@/components/auth/LoginForm'));
---

<Suspense fallback={<LoadingSpinner />}>
  <LoginForm client:idle />
</Suspense>
```

### 3.2 SEO i Wydajność

- Implementować meta tagi dla SEO
- Optymalizować ładowanie komponentów
- Używać preload dla krytycznych zasobów

## 4. Obsługa Formularzy

### 4.1 Walidacja

- Implementować walidację przy użyciu Zod
- Wydzielać schematy walidacji do osobnych plików
- Zapewniać spójne komunikaty błędów

```typescript
const loginSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres email"),
  password: z.string().min(8, "Hasło musi mieć min. 8 znaków"),
});
```

### 4.2 Obsługa Błędów

- Implementować spójną strategię obsługi błędów
- Używać toast notifications dla feedbacku
- Zapewniać przyjazne dla użytkownika komunikaty

```typescript
try {
  await AuthService.login(data);
  toast.success("Zalogowano pomyślnie!");
} catch (err) {
  toast.error(err.message);
}
```

## 5. Typowanie (TypeScript)

### 5.1 Interfejsy i Typy

- Definiować interfejsy dla props komponentów
- Używać type inference gdzie to możliwe
- Implementować strict typing

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

type LoginFormValues = z.infer<typeof loginSchema>;
```

### 5.2 Dobre Praktyki TypeScript

- Używać strict mode
- Implementować type guards
- Unikać any
- Wykorzystywać utility types

## 6. Testowanie

### 6.1 Struktura Testów

- Testy jednostkowe dla hooków
- Testy integracyjne dla formularzy
- Testy e2e dla flow logowania

### 6.2 Dobre Praktyki Testowania

- Używać React Testing Library
- Implementować user-centric testing
- Testować edge cases i obsługę błędów

```typescript
test('displays error message on invalid login', async () => {
  render(<LoginForm />);
  // ... implementacja testu
});
```

## 7. Dostępność (A11y)

### 7.1 Wymagania

- Implementować ARIA labels
- Zapewniać nawigację klawiaturą
- Używać semantycznego HTML

### 7.2 Dobre Praktyki

- Testować z czytnikami ekranowymi
- Zapewniać wystarczający kontrast
- Implementować komunikaty o stanie (loading, error)

## 8. Unikanie Overengineering (KISS & YAGNI)

### 8.1 Zasada KISS (Keep It Simple, Stupid)

- Preferować proste rozwiązania nad złożonymi
- Unikać nadmiernych abstrakcji
- Zachować czytelność kodu

#### Przykłady Nadmiernej Złożoności:

```typescript
// ❌ Nadmiarowe - osobne pliki dla każdego pola
// LoginEmailField.tsx
export const LoginEmailField = () => {
  return <FormField name="email" />;
};

// LoginPasswordField.tsx
export const LoginPasswordField = () => {
  return <FormField name="password" />;
};

// ✅ Lepsze - wszystko w jednym komponencie
// LoginForm.tsx
export const LoginForm = () => {
  return (
    <Form>
      <FormField name="email" />
      <FormField name="password" />
      <Button type="submit">Login</Button>
    </Form>
  );
};
```

### 8.2 Zasada YAGNI (You Aren't Gonna Need It)

- Implementować tylko to, co jest aktualnie potrzebne
- Unikać spekulacyjnych abstrakcji
- Nie dodawać funkcjonalności "na wszelki wypadek"

#### Przykłady Niepotrzebnych Abstrakcji:

```typescript
// ❌ Nadmiarowe - zbyt wczesna abstrakcja
const useAuthContext = () => {
  const context = useContext(AuthContext);
  const actions = useMemo(
    () => ({
      login: () => {},
      logout: () => {},
      resetPassword: () => {},
      updateProfile: () => {}, // niepotrzebne na tym etapie
      changeEmail: () => {}, // niepotrzebne na tym etapie
      twoFactorAuth: () => {}, // niepotrzebne na tym etapie
    }),
    []
  );
  return { ...context, ...actions };
};

// ✅ Lepsze - tylko niezbędne funkcje
const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      await AuthService.login(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login };
};
```

### 8.3 Kiedy Nie Stosować Zaawansowanych Wzorców

#### Context API

- Używać tylko gdy props drilling staje się rzeczywistym problemem
- Nie wprowadzać na wczesnym etapie rozwoju aplikacji
- Rozważyć prostsze alternatywy (np. kompozycja komponentów)

```typescript
// ❌ Nadmiarowe - zbyt wczesne użycie Context
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  // złożona logika stanu
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

// ✅ Lepsze - props drilling jest OK dla małej liczby poziomów
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
};
```

#### Lazy Loading

- Stosować tylko dla dużych, rzadko używanych komponentów
- Nie używać dla krytycznych funkcjonalności (jak logowanie)
- Rozważyć wpływ na UX przed implementacją

```typescript
// ❌ Nadmiarowe - lazy loading dla małego komponentu
const LoginForm = lazy(() => import("./LoginForm"));

// ✅ Lepsze - bezpośredni import
import { LoginForm } from "./LoginForm";
```

### 8.4 Wskazówki Dotyczące Refaktoryzacji

1. **Rozpoczynaj Prosto**

   - Implementuj najprostsze rozwiązanie, które działa
   - Dodawaj złożoność tylko gdy jest potrzebna
   - Unikaj przedwczesnej optymalizacji

2. **Refaktoryzuj Stopniowo**

   - Wprowadzaj abstrakcje gdy wzorce stają się widoczne
   - Refaktoryzuj kod, który się powtarza (Rule of Three)
   - Zachowaj balans między czystością kodu a praktycznością

3. **Monitoruj Złożoność**
   - Regularnie przeglądaj kod pod kątem nadmiarowych abstrakcji
   - Usuwaj nieużywany kod i funkcjonalności
   - Upraszczaj skomplikowane rozwiązania

### 8.5 Czerwone Flagi

1. **Zbyt Wczesna Abstrakcja**

   - Tworzenie interfejsów bez konkretnych implementacji
   - Nadmierne używanie wzorców projektowych
   - Zbyt ogólne rozwiązania dla specyficznych problemów

2. **Nadmierna Elastyczność**

   - Dodawanie konfiguracji, która nie jest używana
   - Implementacja wariantów funkcjonalności "na przyszłość"
   - Zbyt ogólne typy TypeScript

3. **Złożoność Organizacyjna**
   - Zbyt głęboka struktura katalogów
   - Nadmierne dzielenie kodu na małe pliki
   - Skomplikowane systemy budowania

### 8.6 Praktyczne Podejście

```typescript
// Przykład zrównoważonego komponentu logowania
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.login(data);
      toast.success("Zalogowano pomyślnie!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          label="Email"
          type="email"
          required
        />
        <FormField
          name="password"
          label="Hasło"
          type="password"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logowanie..." : "Zaloguj"}
        </Button>
      </form>
    </Form>
  );
}
```

Ten przykład pokazuje:

- Minimalną, ale wystarczającą implementację
- Brak nadmiarowych abstrakcji
- Czytelny i maintainable kod
- Skupienie na konkretnych potrzebach
