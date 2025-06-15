# Feature Flags System - AI Implementation Guide

You are working on a feature flags system in a TypeScript/React/Astro application. Here's what you need to know:

## Current Implementation

The system uses:

- Singleton pattern for global state management
- Astro's environment variables (must use PUBLIC\_ prefix)
- React hooks for component-level feature gating
- In-memory caching for performance
- Percentage-based rollouts and user overrides

Key files:

- `src/features/store.ts` - Main FeatureFlagsStore implementation
- `src/features/types.ts` - TypeScript types and interfaces
- `src/components/**/Fallback.tsx` - Fallback components for disabled features

## Making Changes

When implementing feature flag changes, ALWAYS:

1. Use the correct environment variable format:

   ```env
   PUBLIC_FEATURE_FLAG_[FEATURE_NAME]="true"
   PUBLIC_FEATURE_FLAG_[FEATURE_NAME]_PERCENTAGE="50"
   PUBLIC_FEATURE_FLAG_[FEATURE_NAME]_FORCE_ENABLE_FOR_USERS="user1,user2"
   ```

2. Update TypeScript types in `types.ts`:

   ```typescript
   export type FeatureId = "existing_feature" | "your_new_feature";
   ```

3. Provide fallback components for disabled states

4. Use the React hook for component-level checks:
   ```typescript
   const isEnabled = useFeatureFlag("feature_name");
   ```

## Available Features

Currently implemented features:

- calendar
- ai_analysis
- advanced_stats

## Common Tasks

### Adding a New Feature Flag

1. Add environment variables with PUBLIC\_ prefix
2. Add feature ID to FeatureId type
3. Create fallback component
4. Update environment variables documentation

### Modifying Existing Flags

1. Check store.ts for any logic changes
2. Update environment variables if needed
3. Test both enabled and disabled states
4. Verify percentage rollouts work

### Debugging Feature Flags

1. Verify environment variable names (must have PUBLIC\_ prefix)
2. Check boolean string values (must be "true" or "false")
3. Validate percentage values (0-100)
4. Test force-enable user lists

## Example Prompts

Use these formats when asking for changes:

1. Adding new feature:
   "Add a new feature flag for [feature_name] with [specific requirements]. Include percentage rollout of [X]% and fallback component showing [message]."

2. Modifying existing:
   "Update the [feature_name] flag to include [new behavior/requirement]. The flag should [specific behavior details]."

3. Debugging:
   "Debug the [feature_name] flag which is not working when [specific condition]. Current environment variables are: [list variables]"

## Implementation Rules

When implementing changes:

1. ALWAYS use PUBLIC\_ prefix for environment variables
2. ALWAYS update TypeScript types
3. ALWAYS implement proper fallback states
4. ALWAYS consider both enabled and disabled states
5. NEVER remove existing feature flags without migration plan
6. NEVER hardcode feature flag values
7. NEVER skip type updates
8. NEVER leave fallback components without proper UI

## Testing Changes

After implementation:

1. Verify environment variables work
2. Test percentage rollouts
3. Check force-enable lists
4. Verify fallback components
5. Test React hook integration
6. Validate TypeScript types

## Current Architecture

```typescript
// Core store pattern
class FeatureFlagsStore {
  private static instance: FeatureFlagsStore;
  private config: Record<FeatureId, FeatureConfig>;
  private cache: Map<string, boolean>;

  public isEnabled(featureId: FeatureId, userId?: string): boolean {
    // Implementation handles:
    // 1. Global enable/disable
    // 2. User overrides
    // 3. Percentage rollouts
    // 4. Caching
  }
}

// React hook pattern
function useFeatureFlag(feature: FeatureId) {
  const [isEnabled, setIsEnabled] = useState(() => FeatureFlagsStore.getInstance().isEnabled(feature));
  // Includes subscription for updates
}
```

## Error Messages

Use these formats for error messages:

1. Fallback UI: Friendly, informative messages about feature availability
2. Development: Technical details for debugging
3. Production: Generic messages without implementation details

## Need Help?

When asking for help, provide:

1. The specific feature flag name
2. Current environment variables
3. Expected vs actual behavior
4. Any error messages
5. Relevant component code
