import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { HealthProfileResponse } from "@/types";
import { useCreateHealthProfile } from "@/lib/hooks/useCreateHealthProfile";

const SUGGESTED_CONDITIONS = [
  "Eye strain",
  "Carpal tunnel syndrome",
  "Back pain",
  "Neck tension",
  "Chronic fatigue",
  "Computer vision syndrome",
  "Tech neck",
  "Insomnia",
  "Migraine",
  "RSI (Repetitive Strain Injury)",
  "Digital eye fatigue",
  "Poor posture",
] as const;

interface CreateHealthProfileProps {
  onProfileCreated: (profile: HealthProfileResponse) => void;
}

export default function CreateHealthProfile({ onProfileCreated }: CreateHealthProfileProps) {
  const { createProfile, isLoading } = useCreateHealthProfile();
  const [formData, setFormData] = useState({
    birth_date: "",
    height: 0,
    weight: 0,
    medical_conditions: [] as string[],
    family_conditions: [] as string[],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [newMedicalCondition, setNewMedicalCondition] = useState("");
  const [newFamilyCondition, setNewFamilyCondition] = useState("");

  // Calculate maximum date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profile = await createProfile(formData);
      onProfileCreated(profile);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const addCondition = (type: "medical_conditions" | "family_conditions", value: string) => {
    if (!value.trim()) return;
    if (formData[type].includes(value.trim())) return; // Prevent duplicates
    setFormData({
      ...formData,
      [type]: [...(formData[type] || []), value.trim()],
    });
    if (type === "medical_conditions") {
      setNewMedicalCondition("");
    } else {
      setNewFamilyCondition("");
    }
  };

  const removeCondition = (type: "medical_conditions" | "family_conditions", index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type]?.filter((_, i) => i !== index) || [],
    });
  };

  const inputClasses = "border-2 border-primary/20 focus:border-primary/50 transition-colors";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Health Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <div className="space-y-1">
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                max={maxDateString}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                required
                className={inputClasses}
              />
              <p className="text-sm text-muted-foreground">You must be at least 18 years old</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              min="0"
              value={formData.height || ""}
              onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight || ""}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Common programmer health conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_CONDITIONS.map((condition) => (
                    <Button
                      key={condition}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`group ${formData.medical_conditions.includes(condition) ? "bg-primary/10" : ""}`}
                      onClick={() => addCondition("medical_conditions", condition)}
                      disabled={formData.medical_conditions.includes(condition)}
                    >
                      <Plus
                        className={`h-4 w-4 mr-1 transition-transform ${
                          formData.medical_conditions.includes(condition) ? "rotate-45" : "group-hover:scale-125"
                        }`}
                      />
                      {condition}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMedicalCondition}
                  onChange={(e) => setNewMedicalCondition(e.target.value)}
                  placeholder="Add a custom medical condition"
                  className={inputClasses}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCondition("medical_conditions", newMedicalCondition);
                    }
                  }}
                />
                <Button type="button" onClick={() => addCondition("medical_conditions", newMedicalCondition)}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.medical_conditions?.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 bg-primary/5 p-2 rounded-md">
                    <span className="flex-1">{condition}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition("medical_conditions", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Family History</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newFamilyCondition}
                  onChange={(e) => setNewFamilyCondition(e.target.value)}
                  placeholder="Add a family condition"
                  className={inputClasses}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCondition("family_conditions", newFamilyCondition);
                    }
                  }}
                />
                <Button type="button" onClick={() => addCondition("family_conditions", newFamilyCondition)}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.family_conditions?.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 bg-primary/5 p-2 rounded-md">
                    <span className="flex-1">{condition}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition("family_conditions", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
