# Plan Testów dla Projektu pAIn-less (POC)

## 1. Wprowadzenie i Cele Testowania

### 1.1. Cel Dokumentu

Niniejszy dokument przedstawia plan testów dla POC aplikacji pAIn-less, systemu zarządzania suplementacją i zdrowiem z wykorzystaniem sztucznej inteligencji.

### 1.2. Cele Testowania

- Weryfikacja poprawności działania kluczowych funkcjonalności MVP
- Walidacja integracji z zewnętrznymi usługami (Supabase, OpenRouter.ai)
- Potwierdzenie użyteczności interfejsu użytkownika
- Weryfikacja podstawowej wydajności aplikacji
- Zapewnienie stabilności systemu AI i jakości rekomendacji

## 2. Zakres Testów

### 2.1. Komponenty Podlegające Testowaniu

- System zarządzania profilami zdrowotnymi
- Moduł suplementacji i kalendarza
- System alertów zdrowotnych i AI
- Integracje z zewnętrznymi API
- Podstawowa autentykacja
- Interfejs użytkownika i responsywność

### 2.2. Komponenty Wyłączone z Testowania

- Zaawansowane testy bezpieczeństwa (OWASP)
- Compliance testing (GDPR/HIPAA)
- Penetration testing
- Wewnętrzna infrastruktura Supabase
- Modele AI dostarczane przez OpenRouter.ai

## 3. Strategia i Narzędzia Testowe

### 3.1. Unified Testing Strategy z Playwright

#### **Playwright jako główne narzędzie**

- **Uzasadnienie**: Lepsze wsparcie dla Astro 5 + React 19, szybszy rozwój POC
- **Pokrycie**: E2E, testy integracyjne, API testing
- **Konfiguracja**: Focus na Chrome/Firefox, basic mobile testing

```typescript
// Uproszczona konfiguracja Playwright dla POC
export default defineConfig({
  testDir: "./tests",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
});
```

#### **Pozostałe narzędzia**

- **Vitest**: Testy jednostkowe (lightweight, fast)
- **@axe-core/playwright**: Podstawowe testy dostępności
- **Lighthouse CI**: Monitoring wydajności

### 3.2. Hierarchia Testów

#### **Poziom 1: Testy Jednostkowe (Vitest)**

- **Pokrycie**: 70% minimum (POC standard)
- **Focus**:
  - Kluczowa logika biznesowa
  - Hooki React w krytycznych komponentach
  - Utility functions

#### **Poziom 2: Testy Integracyjne (Playwright)**

- **API Testing**: Podstawowe endpointy Supabase
- **Component Integration**: Kluczowe React komponenty
- **Database Operations**: CRUD operacje

#### **Poziom 3: Testy E2E (Playwright)**

- **Happy Path**: Główne scenariusze użytkownika
- **Critical Flows**: Rejestracja → Profil → Suplementy → AI

## 4. Szczegółowe Scenariusze Testowe

### 4.1. Profil Zdrowotny i Autentykacja

#### **Podstawowe scenariusze**

```typescript
test("user registration and profile creation", async ({ page }) => {
  // Basic registration flow
  // Profile creation with validation
  // Login/logout functionality
});
```

### 4.2. Zarządzanie Suplementami

#### **Core functionality testing**

```typescript
test("supplement management flow", async ({ page, request }) => {
  // Add supplement
  // Edit dosage
  // View in calendar
  // Basic validation
});
```

### 4.3. Kalendarz i Scheduling

#### **Essential E2E Testing**

```typescript
test("calendar basic functionality", async ({ page }) => {
  // View calendar
  // Add supplement schedule
  // Basic synchronization
});
```

### 4.4. Integracja z AI

#### **AI Proof of Concept Testing**

```typescript
test("AI recommendation basic flow", async ({ page }) => {
  // Request health analysis
  // Display results
  // Handle loading states
  // Basic error handling
});
```

## 5. Podstawowe Bezpieczeństwo

### 5.1. Essential Security Testing

- **Basic authentication**: Login/logout flows
- **Input validation**: Form sanitization
- **Basic access control**: User can only see own data
- **HTTPS enforcement**: SSL/TLS validation

```typescript
test("basic security checks", async ({ page }) => {
  // Test authentication flow
  // Verify user isolation
  // Check HTTPS redirects
});
```

## 6. Performance & Reliability

### 6.1. Performance Benchmarks (POC)

- **First Contentful Paint**: < 2.0s
- **Time to Interactive**: < 4.0s
- **Basic functionality**: Works smoothly
- **Bundle Size**: Reasonable for POC

### 6.2. Basic Reliability Testing

```typescript
test("app stability under normal use", async ({ page }) => {
  // Navigate through all pages
  // Perform CRUD operations
  // Check for console errors
  // Memory usage acceptable
});
```

## 7. Accessibility & UX

### 7.1. Basic Accessibility

```typescript
test("essential accessibility", async ({ page }) => {
  await injectAxe(page);
  const results = await checkA11y(page, null, {
    rules: {
      "color-contrast": { enabled: true },
      "keyboard-navigation": { enabled: true },
    },
  });
});
```

### 7.2. Core UX Requirements

- **Responsive design**: Works on mobile/desktop
- **Intuitive navigation**: Clear user flows
- **Loading states**: Proper feedback
- **Error messages**: User-friendly

## 8. CI/CD Integration

### 8.1. Simplified GitHub Actions Pipeline

```yaml
name: POC Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npx playwright install chromium
      - run: npm run test:e2e:essential
```

### 8.2. Quality Gates (POC)

- **Unit tests**: 70% coverage
- **E2E tests**: Critical paths working
- **No blocking console errors**
- **Basic performance acceptable**

## 9. Harmonogram i Fazy

### 9.1. Faza 1: Core Functionality (Sprint 1)

- **Priority**: MVP features working
- **Deliverables**:
  - Basic E2E for main flows
  - Unit tests for core logic
  - Simple CI pipeline

### 9.2. Faza 2: Polish & Stability (Sprint 2)

- **Priority**: Smooth user experience
- **Deliverables**:
  - AI integration tests
  - Responsive design validation
  - Error handling improvement

### 9.3. Faza 3: Demo Ready (Sprint 3)

- **Priority**: Demo preparation
- **Deliverables**:
  - Performance optimization
  - User feedback integration
  - Demo scenario testing

## 10. Kryteria Akceptacji (POC)

### 10.1. Must-Have (Demo Blockers)

- ✅ 70% unit test coverage
- ✅ Critical user flows working
- ✅ No major bugs in demo scenarios
- ✅ Acceptable performance
- ✅ Works on Chrome/Firefox

### 10.2. Nice-to-Have

- 🔄 Mobile responsiveness
- 🔄 Advanced error handling
- 🔄 Performance optimization
- 🔄 Accessibility improvements

## 11. Zarządzanie Ryzykiem (POC)

### 11.1. Kluczowe Ryzyka

| Ryzyko                 | Prawdopodobieństwo | Mitygacja                 |
| ---------------------- | ------------------ | ------------------------- |
| AI service instability | Średnie            | Mock responses for demo   |
| Performance issues     | Średnie            | Basic monitoring          |
| Integration problems   | Wysokie            | Early integration testing |
| UX confusion           | Średnie            | User testing sessions     |

## 12. Narzędzia i Konfiguracja

### 12.1. Development Tools

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "vitest": "^1.0.0",
    "@axe-core/playwright": "^4.8.0",
    "lighthouse": "^11.0.0"
  },
  "scripts": {
    "test:unit": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:essential": "playwright test --grep=\"@critical\""
  }
}
```

### 12.2. Struktura Testów (Uproszczona)
