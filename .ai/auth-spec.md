# Specyfikacja Techniczna: System Autentykacji pAIn-less

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Nowe strony i komponenty

#### 1.1.1 Strony autentykacji (Astro)

- **`src/pages/auth/login.astro`** - Dedykowana strona logowania
- **`src/pages/auth/register.astro`** - Dedykowana strona rejestracji
- **`src/pages/auth/forgot-password.astro`** - Strona odzyskiwania hasła
- **`src/pages/auth/reset-password.astro`** - Strona resetowania hasła (z tokenem)

Wszystkie strony autentykacji będą używać dedykowanego layoutu `AuthLayout.astro` bez nawigacji głównej aplikacji.

#### 1.1.2 Komponenty React dla formularzy

- **`src/components/auth/LoginForm.tsx`** - Formularz logowania
  - Pola: email (type="email", required), hasło (type="password", required)
  - Przycisk "Zaloguj się"
  - Link "Zapomniałeś hasła?"
  - Walidacja client-side: format email, minimalna długość hasła
- **`src/components/auth/RegisterForm.tsx`** - Formularz rejestracji
  - Pola: email, hasło, potwierdzenie hasła (wszystkie required)
  - Przycisk "Zarejestruj się"
  - Walidacja client-side: zgodność haseł, siła hasła, format email
- **`src/components/auth/ForgotPasswordForm.tsx`** - Formularz odzyskiwania hasła
  - Pole: email (required)
  - Przycisk "Wyślij link resetujący"
- **`src/components/auth/ResetPasswordForm.tsx`** - Formularz resetowania hasła
  - Pola: nowe hasło, potwierdzenie nowego hasła
  - Przycisk "Resetuj hasło"

#### 1.1.3 Komponenty UI wspólne

- **`src/components/auth/AuthCard.tsx`** - Wrapper dla formularzy autentykacji
- **`src/components/auth/AuthRedirect.tsx`** - Komponent przekierowania po autentykacji
- **`src/components/auth/ProtectedRoute.tsx`** - HOC zabezpieczający komponenty

### 1.2 Modyfikacje istniejących komponentów

#### 1.2.1 NavigationBar.tsx - Rozszerzenie o logikę autentykacji

```typescript
interface NavigationBarProps {
  user: User | null;
  isAuthenticated: boolean;
}
```

**Logika renderowania:**

- **Stan niezalogowany:** Przycisk "Zaloguj się" w prawym górnym rogu
- **Stan zalogowany:** Dropdown z awatarem zawierający opcje:
  - Profil
  - Ustawienia
  - Wyloguj się

**Odpowiedzialności:**

- Wyświetlanie odpowiedniego UI na podstawie stanu autentykacji
- Obsługa akcji wylogowania (wywołanie funkcji logout)
- Przekierowanie do strony logowania

#### 1.2.2 MainLayout.astro - Dodanie middleware autentykacji

- Sprawdzanie stanu autentykacji w frontmatter
- Przekazywanie danych użytkownika do komponentów
- Integracja z Navigation Bar

#### 1.2.3 Nowy AuthLayout.astro

```astro
---
// Minimalistyczny layout tylko dla stron autentykacji
// Bez nawigacji głównej, focus na formularzach
---
```

### 1.3 Przypadki walidacji i komunikaty błędów

#### 1.3.1 Walidacja client-side (React)

- **Email:** Format RFC 5322, komunikat "Wprowadź poprawny adres email"
- **Hasło:** Min. 8 znaków, komunikat "Hasło musi mieć co najmniej 8 znaków"
- **Potwierdzenie hasła:** Zgodność, komunikat "Hasła nie są identyczne"
- **Puste pola:** "To pole jest wymagane"

#### 1.3.2 Komunikaty błędów z serwera

- **Niepoprawne dane logowania:** "Niepoprawny email lub hasło"
- **Email już istnieje:** "Konto z tym adresem email już istnieje"
- **Token resetowania wygasł:** "Link resetowania hasła wygasł"
- **Email nie istnieje:** "Nie znaleźliśmy konta z tym adresem email"

#### 1.3.3 Komunikaty sukcesu

- **Rejestracja:** "Konto zostało utworzone. Sprawdź email w celu weryfikacji."
- **Reset hasła:** "Link resetowania hasła został wysłany na Twój email"
- **Zmiana hasła:** "Hasło zostało pomyślnie zmienione"

### 1.4 Scenariusze UX

#### 1.4.1 Przepływ rejestracji

1. Użytkownik klika "Zaloguj się" → przekierowanie na `/auth/login`
2. Klik "Nie masz konta?" → przekierowanie na `/auth/register`
3. Wypełnienie formularza → walidacja → wywołanie API
4. Sukces → komunikat o weryfikacji email → przekierowanie na `/auth/login`
5. Weryfikacja email → aktywacja konta

#### 1.4.2 Przepływ logowania

1. Wprowadzenie danych → walidacja → wywołanie API
2. Sukces → przekierowanie na poprzednią stronę lub `/` (dashboard)
3. Błąd → wyświetlenie komunikatu, focus na pierwszym błędnym polu

#### 1.4.3 Przepływ odzyskiwania hasła

1. Klik "Zapomniałeś hasła?" na stronie logowania
2. Wprowadzenie emaila → wywołanie API reset
3. Email z linkiem → przekierowanie na `/auth/reset-password?token=xxx`
4. Nowe hasło → sukces → przekierowanie na login

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów API

#### 2.1.1 Endpointy autentykacji

- **`POST /api/auth/register`** - Rejestracja nowego użytkownika
- **`POST /api/auth/login`** - Logowanie użytkownika
- **`POST /api/auth/logout`** - Wylogowanie użytkownika
- **`POST /api/auth/forgot-password`** - Żądanie resetowania hasła
- **`POST /api/auth/reset-password`** - Resetowanie hasła z tokenem
- **`GET /api/auth/verify-email`** - Weryfikacja adresu email
- **`GET /api/auth/me`** - Pobranie danych aktualnie zalogowanego użytkownika

#### 2.1.2 Struktury żądań i odpowiedzi

```typescript
// Rejestracja
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  message: string;
  requiresVerification: boolean;
}

// Logowanie
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
  session: AuthSession;
  redirectTo?: string;
}

// Reset hasła
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
```

### 2.2 Modele danych

#### 2.2.1 Typy użytkownika

```typescript
// src/types.ts - rozszerzenie o typy auth
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}
```

### 2.3 Walidacja danych wejściowych

#### 2.3.1 Schemat walidacji (Zod)

```typescript
// src/lib/auth/validation.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Niepoprawny format email"),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Niepoprawny format email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});
```

### 2.4 Obsługa wyjątków

#### 2.4.1 Klasy błędów

```typescript
// src/lib/auth/errors.ts
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string[]>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class EmailNotVerifiedError extends AuthenticationError {
  constructor() {
    super("Email nie został zweryfikowany", "EMAIL_NOT_VERIFIED");
  }
}
```

### 2.5 Renderowanie server-side

#### 2.5.1 Middleware autentykacji dla Astro

```typescript
// src/middleware/auth.ts - aktualizacja
export async function getAuthenticatedUser(context: APIContext): Promise<AuthUser | null> {
  const session = await getSession(context);
  if (!session) return null;

  const { data: user, error } = await context.locals.supabase.auth.getUser(session.access_token);
  return error ? null : transformSupabaseUser(user);
}

export function requireAuthentication(context: APIContext) {
  return async (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return context.redirect("/auth/login?redirect=" + encodeURIComponent(context.url.pathname));
    }
    return descriptor.value.apply(target, arguments);
  };
}
```

#### 2.5.2 Zabezpieczenie stron

Wszystkie strony aplikacji (poza `/auth/*` i `/`) będą wymagały autentykacji:

- `/calendar` - wymaga autentykacji
- `/profile` - wymaga autentykacji
- `/supplements` - wymaga autentykacji
- Wszystkie endpointy `/api/*` (poza `/api/auth/*`) - wymaga autentykacji

## 3. SYSTEM AUTENTYKACJI

### 3.1 Integracja z Supabase Auth

#### 3.1.1 Konfiguracja klienta

```typescript
// src/lib/auth/supabase-auth.ts
import { createServerClient } from "@supabase/ssr";

export function createAuthClient(context: APIContext) {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    cookies: {
      get: (name) => context.cookies.get(name)?.value,
      set: (name, value, options) => context.cookies.set(name, value, options),
      remove: (name, options) => context.cookies.delete(name, options),
    },
  });
}
```

#### 3.1.2 Serwis autentykacji

```typescript
// src/lib/auth/auth-service.ts
export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async register(email: string, password: string): Promise<RegisterResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.SITE_URL}/auth/verify-email`,
      },
    });

    if (error) throw new AuthenticationError(error.message, error.name);

    return {
      message: "Sprawdź email w celu weryfikacji konta",
      requiresVerification: true,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new AuthenticationError("Niepoprawny email lub hasło", "INVALID_CREDENTIALS");

    return {
      user: transformSupabaseUser(data.user),
      session: transformSupabaseSession(data.session),
    };
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new AuthenticationError(error.message, error.name);
  }

  async forgotPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.SITE_URL}/auth/reset-password`,
    });

    if (error) throw new AuthenticationError(error.message, error.name);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new AuthenticationError(error.message, error.name);
  }
}
```

### 3.2 Zarządzanie sesjami

#### 3.2.1 Session Management w Astro

```typescript
// src/lib/auth/session.ts
export async function getSession(context: APIContext): Promise<AuthSession | null> {
  const authClient = createAuthClient(context);
  const {
    data: { session },
    error,
  } = await authClient.auth.getSession();

  if (error || !session) return null;

  return transformSupabaseSession(session);
}

export async function setSession(context: APIContext, session: AuthSession): Promise<void> {
  const authClient = createAuthClient(context);
  await authClient.auth.setSession({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });
}

export async function clearSession(context: APIContext): Promise<void> {
  const authClient = createAuthClient(context);
  await authClient.auth.signOut();
}
```

### 3.3 Middleware i zabezpieczenia

#### 3.3.1 Aktualizacja middleware głównego

```typescript
// src/middleware/index.ts - aktualizacja
import { defineMiddleware } from "astro:middleware";
import { createAuthClient, getAuthenticatedUser } from "../lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  // Ustawienie klienta Supabase
  context.locals.supabase = createAuthClient(context);

  // Ustawienie użytkownika w kontekście
  context.locals.user = await getAuthenticatedUser(context);

  // Sprawdzenie czy strona wymaga autentykacji
  const protectedRoutes = ["/calendar", "/profile", "/supplements"];
  const isProtectedRoute = protectedRoutes.some((route) => context.url.pathname.startsWith(route));

  if (isProtectedRoute && !context.locals.user) {
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(context.url.pathname)}`;
    return context.redirect(redirectUrl);
  }

  return next();
});
```

#### 3.3.2 API Route Guards

```typescript
// src/lib/auth/guards.ts
export function withAuth(handler: (context: APIContext, user: AuthUser) => Promise<Response>) {
  return async (context: APIContext): Promise<Response> => {
    const user = context.locals.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(context, user);
  };
}
```

### 3.4 Konfiguracja środowiska

#### 3.4.1 Zmienne środowiskowe

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=http://localhost:3000
```

#### 3.4.2 Konfiguracja Supabase Auth

- Email templates dla weryfikacji i resetowania hasła
- Redirect URLs: `/auth/verify-email`, `/auth/reset-password`
- Session settings: JWT expiration, refresh token rotation
- Email provider configuration

### 3.5 Bezpieczeństwo

#### 3.5.1 Ochrona CSRF

- Wykorzystanie built-in CSRF protection w Astro
- Walidacja referer headers dla auth endpoints

#### 3.5.2 Rate Limiting

- Implementacja rate limiting dla endpointów auth
- Ograniczenia: 5 prób logowania na minutę na IP
- 3 żądania reset hasła na godzinę na email

#### 3.5.3 Walidacja danych

- Server-side walidacja wszystkich danych wejściowych
- Sanityzacja danych przed zapisem
- Sprawdzanie siły hasła na backendzie

## 4. PLAN IMPLEMENTACJI

### 4.1 Faza 1: Podstawowa infrastruktura

1. Konfiguracja Supabase Auth
2. Stworzenie typów i interfejsów
3. Implementacja AuthService
4. Aktualizacja middleware

### 4.2 Faza 2: Komponenty UI

1. Stworzenie AuthLayout
2. Implementacja formularzy autentykacji
3. Aktualizacja NavigationBar
4. Stylowanie z Tailwind + Shadcn

### 4.3 Faza 3: Endpointy API

1. Implementacja auth endpoints
2. Dodanie walidacji i error handling
3. Testy API endpoints

### 4.4 Faza 4: Integracja i zabezpieczenia

1. Zabezpieczenie istniejących stron
2. Aktualizacja istniejących API endpoints
3. Testy end-to-end przepływów auth

### 4.5 Faza 5: Optymalizacja i UX

1. Loading states w formularzach
2. Optymalizacja przekierowań
3. Error handling i komunikaty
4. Responsive design

## 5. TESTOWANIE

### 5.1 Testy jednostkowe

- AuthService methods
- Validation schemas
- Error handling

### 5.2 Testy integracyjne

- Auth endpoints
- Middleware functionality
- Session management

### 5.3 Testy E2E

- Przepływ rejestracji
- Przepływ logowania
- Reset hasła
- Zabezpieczenie stron

Specyfikacja zapewnia pełną implementację systemu autentykacji zgodną z wymaganiami US-006, wykorzystując zalecany stack technologiczny i zachowując kompatybilność z istniejącą architekturą aplikacji.
