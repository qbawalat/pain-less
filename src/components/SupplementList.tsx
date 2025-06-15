import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplementCombobox } from "@/components/ui/supplement-combobox";
import { useAllSupplements } from "@/lib/hooks/useAllSupplements";
import type { UserSupplementResponse, UserSupplementCreate } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface SupplementListProps {
  supplements: UserSupplementResponse[];
  onAdd: (supplement: UserSupplementCreate) => Promise<void>;
  onEdit: (id: string, supplement: UserSupplementCreate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "twice daily", label: "Twice daily" },
  { value: "every other day", label: "Every other day" },
  { value: "every 3 days", label: "Every 3 days" },
  { value: "weekly", label: "Weekly" },
  { value: "with meals", label: "With meals" },
  { value: "before breakfast", label: "Before breakfast" },
  { value: "before bed", label: "Before bed" },
  { value: "as needed", label: "As needed" },
  { value: "custom", label: "Custom" },
];

export default function SupplementList({
  supplements = [], // Provide default empty array
  onAdd,
  onEdit,
  onDelete,
}: SupplementListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customFrequency, setCustomFrequency] = useState("");
  const [formData, setFormData] = useState<UserSupplementCreate>({
    supplement_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: null,
    dosage: "",
    frequency: "",
  });

  // Use the new hook for all supplements
  const { supplements: allSupplements, isLoading: loadingSupplements, createSupplement } = useAllSupplements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalFormData = {
        ...formData,
        frequency: formData.frequency === "custom" ? customFrequency : formData.frequency,
      };

      if (isEditing) {
        await onEdit(isEditing, finalFormData);
      } else {
        await onAdd(finalFormData);
      }
      setIsEditing(null);
      setIsSheetOpen(false);
      setFormData({
        supplement_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        dosage: "",
        frequency: "",
      });
      setCustomFrequency("");
    } catch {
      // Error is handled by the hook
    }
  };

  const handleEdit = (supplement: UserSupplementResponse) => {
    setIsEditing(supplement.id);
    setIsSheetOpen(true);

    // Check if the frequency is a predefined option
    const predefinedFrequency = frequencyOptions.find((option) => option.value === supplement.frequency.toLowerCase());

    if (predefinedFrequency) {
      setFormData({
        supplement_id: supplement.supplement.id,
        start_date: supplement.start_date.split("T")[0],
        end_date: supplement.end_date?.split("T")[0] || null,
        dosage: supplement.dosage,
        frequency: predefinedFrequency.value,
      });
      setCustomFrequency("");
    } else {
      // Custom frequency
      setFormData({
        supplement_id: supplement.supplement.id,
        start_date: supplement.start_date.split("T")[0],
        end_date: supplement.end_date?.split("T")[0] || null,
        dosage: supplement.dosage,
        frequency: "custom",
      });
      setCustomFrequency(supplement.frequency);
    }
  };

  const handleFrequencyChange = (value: string) => {
    setFormData({ ...formData, frequency: value });
    if (value !== "custom") {
      setCustomFrequency("");
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(null);
      setFormData({
        supplement_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        dosage: "",
        frequency: "",
      });
      setCustomFrequency("");
    }
    setIsSheetOpen(open);
  };

  // Ensure supplements is an array
  const supplementsList = Array.isArray(supplements) ? supplements : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Supplements</CardTitle>
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button data-testid="add-supplement-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplement
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{isEditing ? "Edit Supplement" : "Add Supplement"}</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="supplement">Supplement</Label>
                <SupplementCombobox
                  supplements={allSupplements}
                  value={formData.supplement_id}
                  onValueChange={(value) => setFormData({ ...formData, supplement_id: value })}
                  onCreateSupplement={createSupplement}
                  placeholder="Select or create supplement..."
                  disabled={loadingSupplements}
                  data-testid="supplement-name-input"
                />
                {loadingSupplements && <p className="text-sm text-muted-foreground">Loading supplements...</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  data-testid="supplement-start-date-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end_date: e.target.value ? e.target.value : null,
                    })
                  }
                  data-testid="supplement-end-date-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g., 500mg, 1 tablet, 2 capsules"
                  required
                  data-testid="supplement-dosage-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger data-testid="supplement-frequency-input">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {formData.frequency === "custom" && (
                  <Input
                    placeholder="Enter custom frequency"
                    value={customFrequency}
                    onChange={(e) => setCustomFrequency(e.target.value)}
                    required
                    data-testid="supplement-custom-frequency-input"
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  !formData.supplement_id ||
                  !formData.frequency ||
                  (formData.frequency === "custom" && !customFrequency.trim()) ||
                  loadingSupplements
                }
                className="w-full"
                data-testid="save-supplement-button"
              >
                {isEditing ? "Update Supplement" : "Add Supplement"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplementsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No supplements added yet
                </TableCell>
              </TableRow>
            ) : (
              supplementsList.map((supplement) => (
                <TableRow key={supplement.id} data-testid="supplement-item" data-name={supplement.supplement.name}>
                  <TableCell data-testid="supplement-name">{supplement.supplement.name}</TableCell>
                  <TableCell data-testid="supplement-dosage">{supplement.dosage}</TableCell>
                  <TableCell data-testid="supplement-frequency">{supplement.frequency}</TableCell>
                  <TableCell data-testid="supplement-start-date">
                    {new Date(supplement.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell data-testid="supplement-end-date">
                    {supplement.end_date ? new Date(supplement.end_date).toLocaleDateString() : "Ongoing"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(supplement)}
                      data-testid="edit-supplement-button"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(supplement.id)}
                      data-testid="delete-supplement-button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
