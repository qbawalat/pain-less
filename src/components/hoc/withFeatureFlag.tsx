import { type ComponentType } from "react";
import type { FeatureId } from "@/features";
import { useFeatureFlag } from "@/features/store";

export function withFeatureFlag<P extends object>(
  WrappedComponent: ComponentType<P>,
  featureId: FeatureId,
  FallbackComponent?: ComponentType<P>
) {
  return function WithFeatureFlagComponent(props: P) {
    const isEnabled = useFeatureFlag(featureId);

    if (!isEnabled) {
      return FallbackComponent ? <FallbackComponent {...props} /> : null;
    }

    return <WrappedComponent {...props} />;
  };
}
