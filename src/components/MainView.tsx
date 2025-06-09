import { useState } from "react";
import NavigationBar from "./NavigationBar";
import HealthStats from "./HealthStats";
import CalendarWidget from "./CalendarWidget";
import SupplementList from "./SupplementList";
import AlertSystem from "./AlertSystem";
import { useHealthProfile } from "@/lib/hooks/useHealthProfile";
import { useSupplements } from "@/lib/hooks/useSupplements";
import { useAlerts } from "@/lib/hooks/useAlerts";
import type { HealthProfileResponse, UserSupplementResponse, HealthAlertResponse } from "@/types";

export default function MainView() {
  // State management using custom hooks
  const { profile, isLoading: isProfileLoading, error: profileError, updateProfile } = useHealthProfile();

  const {
    supplements,
    isLoading: isSupplementsLoading,
    error: supplementsError,
    addSupplement,
    editSupplement,
    deleteSupplement,
  } = useSupplements();

  const { alerts, isLoading: isAlertsLoading, error: alertsError, acknowledgeAlert } = useAlerts();

  if (isProfileLoading || isSupplementsLoading || isAlertsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (profileError || supplementsError || alertsError) {
    return <div className="flex items-center justify-center min-h-screen">Error loading data</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NavigationBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <HealthStats profile={profile} onUpdate={updateProfile} />

        <CalendarWidget supplements={supplements} alerts={alerts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <SupplementList
          supplements={supplements}
          onAdd={addSupplement}
          onEdit={editSupplement}
          onDelete={deleteSupplement}
        />

        <AlertSystem alerts={alerts} onAcknowledge={acknowledgeAlert} />
      </div>
    </div>
  );
}
