# GitHub Actions Workflows

## Pull Request Workflow

Plik `pull-request.yml` definiuje workflow CI/CD dla pull requestów.

### Wymagane sekrety

W ustawieniach repozytorium należy skonfigurować następujące sekrety dla środowiska `e2e`:

```bash
# Supabase Configuration
SUPABASE_URL=### 
SUPABASE_KEY=### 

# OpenRouter AI API Configuration
OPENROUTER_API_KEY=### 

# E2E Test User Configuration
TEST_USER_EMAIL=###for e2e 
TEST_USER_PASSWORD=###for e2e 
TEST_USER_UID=###for e2e
```

### Workflow

1. **Lint**: Lintowanie kodu
2. **Unit Tests** (równolegle): Testy jednostkowe z pokryciem kodu
3. **E2E Tests** (równolegle): Testy end-to-end z użyciem Playwright
4. **Status Comment**: Komentarz do PR z statusem (tylko przy sukcesie wszystkich kroków)

### Wymagania

- Node.js wg `.nvmrc`
- npm dla zarządzania zależnościami
- Playwright dla testów E2E
- Codecov dla raportowania pokrycia kodu 