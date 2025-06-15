# Plan implementacji widoku weryfikacji emaila

## 1. Przegląd

Widok weryfikacji emaila jest stroną, do której użytkownik jest przekierowywany po kliknięciu w link weryfikacyjny wysłany na jego adres email po rejestracji. Widok obsługuje proces weryfikacji konta poprzez token dostarczony w URL i wyświetla odpowiedni komunikat w zależności od statusu weryfikacji.

## 2. Routing widoku

- Ścieżka: `/auth/verify-email`
- Parametry URL: `token` - token weryfikacyjny dostarczony przez Supabase

## 3. Struktura komponentów

```
AuthLayout
└── AuthCard
    ├── StatusIcon (warunkowy)
    └── FooterLink (warunkowy)
```

## 4. Szczegóły komponentów

### AuthLayout

- Opis komponentu: Layout zawierający wspólne elementy dla wszystkich widoków autoryzacji
- Główne elementy: Kontener z tłem i wycentrowaną zawartością
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: Brak

### AuthCard

- Opis komponentu: Karta zawierająca główną zawartość widoku weryfikacji
- Główne elementy:
  - Tytuł
  - Opis
  - StatusIcon (warunkowy)
  - FooterLink (warunkowy)
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy:
  ```typescript
  interface AuthCardProps {
    title: string;
    description: string;
    footer?: {
      type: "link";
      text: string;
      href: string;
    };
  }
  ```
- Propsy: title, description, footer

## 5. Typy

```typescript
type VerificationStatus = "initial" | "success" | "error";

interface VerificationContent {
  title: string;
  description: string;
}

interface VerificationContentMap {
  [key in VerificationStatus]: VerificationContent;
}
```

## 6. Zarządzanie stanem

- Stan weryfikacji jest zarządzany na poziomie strony poprzez zmienną `verificationStatus`
- Możliwe wartości: 'initial', 'success', 'error'
- Stan jest aktualizowany po próbie weryfikacji tokenu

## 7. Integracja API

- Endpoint: Supabase Auth API
- Metoda: `verifyOtp`
- Parametry:
  ```typescript
  {
    token_hash: string;
    type: "email";
  }
  ```
- Obsługa odpowiedzi: Aktualizacja stanu weryfikacji na podstawie wyniku

## 8. Interakcje użytkownika

1. Użytkownik klika w link weryfikacyjny w emailu
2. System próbuje zweryfikować token
3. W zależności od wyniku:
   - Sukces: Wyświetlenie komunikatu o pomyślnej weryfikacji i link do logowania
   - Błąd: Wyświetlenie komunikatu o błędzie i link do ponownej rejestracji
   - Brak tokenu: Wyświetlenie komunikatu o konieczności sprawdzenia emaila

## 9. Warunki i walidacja

- Sprawdzenie obecności tokenu w URL
- Walidacja tokenu przez Supabase
- Obsługa przypadków:
  - Brak tokenu
  - Nieprawidłowy token
  - Wygasły token
  - Pomyślna weryfikacja

## 10. Obsługa błędów

- Wyświetlanie odpowiednich komunikatów dla różnych scenariuszy błędów
- Przekierowanie do odpowiednich stron w przypadku błędu
- Obsługa wyjątków podczas weryfikacji tokenu

## 11. Kroki implementacji

1. Utworzenie pliku `verify-email.astro` w katalogu `src/pages/auth/`
2. Implementacja logiki weryfikacji tokenu
3. Stworzenie mapy komunikatów dla różnych statusów
4. Implementacja komponentu AuthCard z odpowiednimi propsami
5. Dodanie ikon statusu dla różnych stanów
6. Implementacja warunkowego renderowania elementów
7. Dodanie linków nawigacyjnych w zależności od statusu
8. Testowanie różnych scenariuszy:
   - Pomyślna weryfikacja
   - Nieprawidłowy token
   - Brak tokenu
   - Wygasły token
