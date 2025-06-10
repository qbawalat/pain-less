# Testowanie w projekcie pAIn-less

## Przegląd

Projekt wykorzystuje dwa rodzaje testów:

- **Testy jednostkowe** - Vitest z React Testing Library do testowania komponentów
- **Testy e2e** - Playwright do testowania pełnych scenariuszy użytkownika

## Testy jednostkowe (Vitest)

### Konfiguracja

- Framework: Vitest
- Środowisko: jsdom
- Biblioteki: React Testing Library, Jest DOM
- Lokalizacja: `src/**/*.{test,spec}.{ts,tsx}`

### Uruchamianie testów jednostkowych

```bash
# Uruchom testy w trybie watch
npm run test

# Uruchom testy w trybie UI
npm run test:ui

# Uruchom testy raz (CI)
npm run test:run

# Uruchom testy z pokryciem kodu
npm run test:coverage

# Uruchom testy w trybie watch z filtrem
npm run test:watch
```

### Struktura testów jednostkowych

```
src/
├── components/
│   ├── __tests__/
│   │   └── component.test.tsx
│   └── Component.tsx
├── lib/
│   ├── __tests__/
│   │   └── utility.test.ts
│   └── utility.ts
└── test/
    └── setup.ts
```

### Przykład testu komponentu

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = userEvent.setup()
    const mockFn = vi.fn()

    render(<MyComponent onClick={mockFn} />)
    await user.click(screen.getByRole('button'))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
```

## Testy e2e (Playwright)

### Konfiguracja

- Framework: Playwright
- Przeglądarka: Chromium (Desktop Chrome)
- Lokalizacja: `e2e/`

### Uruchamianie testów e2e

```bash
# Uruchom testy e2e
npm run e2e

# Uruchom testy w trybie UI
npm run e2e:ui

# Uruchom testy w trybie debug
npm run e2e:debug

# Pokaż raport z testów
npm run e2e:report
```

### Struktura testów e2e

```
e2e/
├── auth/
│   ├── login.spec.ts
│   └── register.spec.ts
├── pages/
│   ├── homepage.spec.ts
│   └── dashboard.spec.ts
└── utils/
    └── test-helpers.ts
```

### Przykład testu e2e

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('[data-testid="email"]', "user@example.com");
    await page.fill('[data-testid="password"]', "password123");
    await page.click('[data-testid="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="welcome"]')).toBeVisible();
  });
});
```

## Page Object Model

Dla złożonych testów e2e używamy Page Object Model:

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('[data-testid="submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Dobre praktyki

### Testy jednostkowe

- Używaj `data-testid` dla stabilnych selektorów
- Testuj zachowanie, nie implementację
- Mockuj zewnętrzne zależności
- Używaj `userEvent` zamiast `fireEvent`
- Pisz testy zgodnie z wzorcem Arrange-Act-Assert

### Testy e2e

- Używaj Page Object Model dla złożonych stron
- Testuj krytyczne ścieżki użytkownika
- Używaj `toHaveScreenshot()` dla testów wizualnych
- Implementuj odpowiednie czekanie na elementy
- Grupuj testy logicznie w `describe` blokach

## Konfiguracja IDE

### VSCode

Zainstaluj rozszerzenia:

- Vitest Runner
- Playwright Test for VSCode

### Uruchamianie w CI/CD

Przykład konfiguracji GitHub Actions dodany do `.github/workflows/tests.yml`

## Pokrycie kodu

Konfiguracja pokrycia znajduje się w `vitest.config.ts`:

- Raporty: text, json, html
- Lokalizacja raportów: `coverage/`
- Wykluczenia: pliki konfiguracyjne, typy, katalog test/
