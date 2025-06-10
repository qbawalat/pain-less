import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SupplementResponse } from "@/types";

interface SupplementComboboxProps {
  supplements: SupplementResponse[];
  value: string;
  onValueChange: (value: string) => void;
  onCreateSupplement: (name: string) => Promise<SupplementResponse>;
  placeholder?: string;
  disabled?: boolean;
}

export function SupplementCombobox({
  supplements,
  value,
  onValueChange,
  onCreateSupplement,
  placeholder = "Select supplement...",
  disabled = false,
}: SupplementComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedSupplement = supplements.find((sup) => sup.id === value);

  const handleSelect = async (currentValue: string) => {
    if (currentValue === value) {
      onValueChange("");
    } else {
      // Check if this is an existing supplement or a new one
      const existingSupplement = supplements.find(
        (sup) => sup.id === currentValue || sup.name.toLowerCase() === currentValue.toLowerCase()
      );

      if (existingSupplement) {
        onValueChange(existingSupplement.id);
      } else if (search.trim()) {
        // Create new supplement
        try {
          const newSupplement = await onCreateSupplement(search.trim());
          onValueChange(newSupplement.id);
        } catch {
          // Error is handled by the parent component
          return;
        }
      }
    }
    setOpen(false);
    setSearch("");
  };

  const filteredSupplements = supplements.filter((supplement) =>
    supplement.name.toLowerCase().includes(search.toLowerCase())
  );

  const showCreateOption = search.trim() && !supplements.some((sup) => sup.name.toLowerCase() === search.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedSupplement ? selectedSupplement.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search supplements..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{search.trim() ? "No supplements found." : "Type to search supplements..."}</CommandEmpty>
            {filteredSupplements.length > 0 && (
              <CommandGroup heading="Existing Supplements">
                {filteredSupplements.map((supplement) => (
                  <CommandItem key={supplement.id} value={supplement.id} onSelect={handleSelect}>
                    <Check className={cn("mr-2 h-4 w-4", value === supplement.id ? "opacity-100" : "opacity-0")} />
                    {supplement.name}
                    {supplement.description && (
                      <span className="ml-2 text-sm text-muted-foreground">- {supplement.description}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {showCreateOption && (
              <CommandGroup heading="Create New">
                <CommandItem value={search} onSelect={handleSelect}>
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  Create &quot;{search}&quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
