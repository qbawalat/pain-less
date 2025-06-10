import HealthStats from "./HealthStats";
import CalendarWidget from "./CalendarWidget";
import CalendarWidgetFallback from "./CalendarWidgetFallback";
import SupplementList from "./SupplementList";
import AlertSystem from "./AlertSystem";
import { AIHealthAnalysisButton } from "./AIHealthAnalysisButton";
import { ErrorBoundary } from "./ErrorBoundary";
import { HealthStatsSkeleton, CalendarSkeleton, SupplementListSkeleton, AlertSystemSkeleton } from "./LoadingSkeletons";
import { useHealthProfile } from "@/lib/hooks/useHealthProfile";
import { useSupplements } from "@/lib/hooks/useSupplements";
import { useAlerts } from "@/lib/hooks/useAlerts";
import CreateHealthProfile from "./CreateHealthProfile";
import { withFeatureFlag } from "./hoc/withFeatureFlag";

// Owijamy CalendarWidget w HOC
const FeatureFlaggedCalendar = withFeatureFlag(CalendarWidget, "calendar", CalendarWidgetFallback);

export default function MainView() {
  // State management using custom hooks
  const {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
    updateProfile,
    refetch: refetchProfile,
  } = useHealthProfile();

  const {
    supplements,
    isLoading: isSupplementsLoading,
    error: supplementsError,
    addSupplement,
    editSupplement,
    deleteSupplement,
  } = useSupplements();

  const {
    alerts,
    isLoading: isAlertsLoading,
    error: alertsError,
    acknowledgeAlert,
    refetch: refetchAlerts,
  } = useAlerts();

  // Show global error if all requests fail
  if (profileError && supplementsError && alertsError) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="global-error-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Unable to load data</h2>
            <p className="text-muted-foreground">Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show create profile form if no profile exists
  if (!isProfileLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="create-profile-container">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full max-w-2xl">
            <ErrorBoundary>
              <CreateHealthProfile
                onProfileCreated={() => {
                  refetchProfile();
                }}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="main-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ErrorBoundary>
          {isProfileLoading ? <HealthStatsSkeleton /> : <HealthStats profile={profile} onUpdate={updateProfile} />}
        </ErrorBoundary>

        <ErrorBoundary>
          {isSupplementsLoading || isAlertsLoading ? (
            <CalendarSkeleton />
          ) : (
            <FeatureFlaggedCalendar supplements={supplements} alerts={alerts} />
          )}
        </ErrorBoundary>
      </div>

      {/* AI Health Analysis CTA */}
      <div className="mt-12 mb-8">
        <ErrorBoundary>
          <AIHealthAnalysisButton
            className="bg-card border border-border rounded-lg shadow-sm"
            onAnalysisComplete={refetchAlerts}
          />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ErrorBoundary>
          {isSupplementsLoading ? (
            <SupplementListSkeleton />
          ) : (
            <SupplementList
              supplements={supplements}
              onAdd={addSupplement}
              onEdit={editSupplement}
              onDelete={deleteSupplement}
            />
          )}
        </ErrorBoundary>

        <ErrorBoundary>
          {isAlertsLoading ? <AlertSystemSkeleton /> : <AlertSystem alerts={alerts} onAcknowledge={acknowledgeAlert} />}
        </ErrorBoundary>
      </div>
    </div>
  );
}
