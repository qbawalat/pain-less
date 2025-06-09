import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HealthProfileResponse, HealthProfileUpdate } from "@/types";

interface HealthStatsProps {
  profile: HealthProfileResponse | null;
  onUpdate: (update: HealthProfileUpdate) => Promise<void>;
}

export default function HealthStats({ profile, onUpdate }: HealthStatsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<HealthProfileUpdate>({
    birth_date: profile?.birth_date || "",
    height: profile?.height || 0,
    weight: profile?.weight || 0,
    medical_conditions: profile?.medical_conditions || [],
    family_conditions: profile?.family_conditions || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Health Stats</CardTitle>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Health Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Birth Date</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date.split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p className="text-2xl font-bold">{calculateAge(profile.birth_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Height</p>
              <p className="text-2xl font-bold">{profile.height} cm</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <p className="text-2xl font-bold">{profile.weight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">BMI</p>
              <p className="text-2xl font-bold">
                {(profile.weight / ((profile.height / 100) * (profile.height / 100))).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Medical Conditions</h3>
            {profile.medical_conditions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {profile.medical_conditions.map((condition, index) => (
                  <li key={index} className="text-sm">
                    {condition}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No conditions listed</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Family History</h3>
            {profile.family_conditions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {profile.family_conditions.map((condition, index) => (
                  <li key={index} className="text-sm">
                    {condition}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No family history listed</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
