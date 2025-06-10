# Environment Variables Configuration

## Required Environment Variables

### Supabase Configuration

```env
# Server-side only variables
SUPABASE_URL="your-project-url"
SUPABASE_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-role-key"

# Client-side variables
PUBLIC_SUPABASE_URL="your-project-url"
PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Feature Flags Configuration

```env
# Global feature flags - enable/disable features
PUBLIC_FEATURE_FLAG_CALENDAR="true"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS="true"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS="false"

# Percentage rollouts (0-100)
PUBLIC_FEATURE_FLAG_CALENDAR_PERCENTAGE="50"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE="25"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE="10"

# Force enable for specific users (comma-separated user IDs)
PUBLIC_FEATURE_FLAG_CALENDAR_FORCE_ENABLE_FOR_USERS="dev1,tester1,beta1"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS_FORCE_ENABLE_FOR_USERS="admin1,beta-tester1"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS_FORCE_ENABLE_FOR_USERS="admin1,poweruser1"
```

### Application Configuration

```env
# Environment type (server-side only)
NODE_ENV="development" # or "production" or "e2e"

# Application URLs
PUBLIC_APP_URL="http://localhost:3000"
PUBLIC_API_URL="http://localhost:3000/api"

# Session configuration (server-side only)
SESSION_SECRET="your-session-secret"
COOKIE_DOMAIN="localhost"
```

### External Services

```env
# OpenAI for AI Health Analysis (server-side only)
OPENAI_API_KEY="your-openai-key"

# Email service (server-side only)
EMAIL_SERVICE_API_KEY="your-email-service-key"
EMAIL_FROM="noreply@your-domain.com"
```

## Environment-Specific Configurations

### Development (.env.development)

```env
NODE_ENV="development"
PUBLIC_APP_URL="http://localhost:3000"
PUBLIC_API_URL="http://localhost:3000/api"
DEBUG="true"
ENABLE_DETAILED_LOGGING="true"

# Feature Flags - Development Defaults
PUBLIC_FEATURE_FLAG_CALENDAR="true"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS="true"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS="true"
PUBLIC_FEATURE_FLAG_CALENDAR_PERCENTAGE="100"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE="100"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE="100"
```

### E2E Testing (.env.e2e)

```env
NODE_ENV="e2e"
PUBLIC_APP_URL="http://localhost:3000"
PUBLIC_API_URL="http://localhost:3000/api"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="test-password"
ENABLE_MOCKS="true"

# Feature Flags - E2E Testing
PUBLIC_FEATURE_FLAG_CALENDAR="true"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS="true"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS="true"
```

### Production (.env.production)

```env
NODE_ENV="production"
PUBLIC_APP_URL="https://your-domain.com"
PUBLIC_API_URL="https://your-domain.com/api"
DEBUG="false"
ENABLE_DETAILED_LOGGING="false"

# Feature Flags - Production Defaults
PUBLIC_FEATURE_FLAG_CALENDAR="false"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS="false"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS="false"
PUBLIC_FEATURE_FLAG_CALENDAR_PERCENTAGE="0"
PUBLIC_FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE="0"
PUBLIC_FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE="0"
```

## Notes

1. **Security**:
   - Never commit `.env` files to version control
   - Use different keys for different environments
   - Rotate secrets regularly
   - Use strong, unique values for secrets
   - Keep server-side variables secret by NOT using the PUBLIC_ prefix

2. **Feature Flags**:
   - All feature flag variables must have the PUBLIC_ prefix to be accessible in client-side code
   - Values should be "true" or "false" (string)
   - Percentage values should be 0-100 (number)
   - Force enable lists should be comma-separated user IDs without spaces
   - Force enable overrides both global flag and percentage rollout
   - Use force enable sparingly, mainly for testing and beta users

3. **Type Safety**:
   - All environment variables are validated at startup
   - Use `src/env.d.ts` for TypeScript type definitions
   - Access via `import.meta.env` in Astro
   - Use environment helper functions for type-safe access
   - Client-side code can only access PUBLIC_ prefixed variables

4. **Local Development**:
   - Copy `.env.example` to `.env.local`
   - Never use production secrets in development
   - Use mock services when possible
   - All feature flags are enabled by default in development

5. **Deployment**:
   - Set all required variables in your deployment platform
   - Verify all variables before deploying
   - Use secrets management for sensitive values
   - Double-check PUBLIC_ prefixes for client-side variables

## Validation

The application validates environment variables at startup. Missing or invalid variables will cause the application to fail fast with clear error messages.

Example validation in `src/env.ts`:

```typescript
// Server-side validation
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required");
}

// Client-side validation
if (!import.meta.env.PUBLIC_FEATURE_FLAG_CALENDAR) {
  console.warn("PUBLIC_FEATURE_FLAG_CALENDAR is not set, defaulting to false");
}
```
