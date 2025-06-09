import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserSupplementResponse, UserSupplementCreate } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface SupplementListProps {
  supplements: UserSupplementResponse[];
  onAdd: (supplement: UserSupplementCreate) => Promise<void>;
  onEdit: (id: string, supplement: UserSupplementCreate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function SupplementList({
  supplements = [], // Provide default empty array
  onAdd,
  onEdit,
  onDelete,
}: SupplementListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserSupplementCreate>({
    supplement_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: null,
    dosage: "",
    frequency: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await onEdit(isEditing, formData);
      } else {
        await onAdd(formData);
      }
      setIsEditing(null);
      setFormData({
        supplement_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        dosage: "",
        frequency: "",
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEdit = (supplement: UserSupplementResponse) => {
    setIsEditing(supplement.id);
    setFormData({
      supplement_id: supplement.supplement.id,
      start_date: supplement.start_date.split("T")[0],
      end_date: supplement.end_date?.split("T")[0] || null,
      dosage: supplement.dosage,
      frequency: supplement.frequency,
    });
  };

  // Ensure supplements is an array
  const supplementsList = Array.isArray(supplements) ? supplements : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Supplements</CardTitle>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
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
                <Select
                  value={formData.supplement_id}
                  onValueChange={(value) => setFormData({ ...formData, supplement_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplement" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplementsList.map((sup) => (
                      <SelectItem key={sup.supplement.id} value={sup.supplement.id}>
                        {sup.supplement.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
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
                      end_date: e.target.value || null,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  required
                />
              </div>

              <Button type="submit">{isEditing ? "Update Supplement" : "Add Supplement"}</Button>
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
                <TableRow key={supplement.id}>
                  <TableCell>{supplement.supplement.name}</TableCell>
                  <TableCell>{supplement.dosage}</TableCell>
                  <TableCell>{supplement.frequency}</TableCell>
                  <TableCell>{new Date(supplement.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {supplement.end_date ? new Date(supplement.end_date).toLocaleDateString() : "Ongoing"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(supplement)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(supplement.id)}>
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
