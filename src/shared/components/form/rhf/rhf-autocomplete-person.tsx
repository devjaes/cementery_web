import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useSearchPersonsQuery } from "@/features/person/presentation/hooks/use-person-queries";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/shared/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface RHFAutocompletePersonProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  vivos?: boolean; // true para personas vivas, false para fallecidas, undefined para todas
}

export default function RHFAutocompletePerson({ name, label, placeholder, disabled, vivos }: RHFAutocompletePersonProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { data: persons, isLoading } = useSearchPersonsQuery(debouncedSearch, vivos);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedPerson = persons?.find(p => p.id_persona === field.value);
        return (
          <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={disabled}
                >
                  {selectedPerson 
                    ? `${selectedPerson.nombres} ${selectedPerson.apellidos} (${selectedPerson.cedula})`
                    : placeholder || "Seleccionar persona..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar por nombre o cédula..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    {isLoading ? (
                      <div className="p-2 text-center text-muted-foreground">Cargando...</div>
                    ) : (
                      <>
                        {persons && persons.length > 0 ? (
                          persons.map(person => (
                            <CommandItem
                              key={person.id_persona}
                              value={`${person.nombres} ${person.apellidos} ${person.cedula}`}
                              onSelect={() => {
                                field.onChange(person.id_persona);
                                setSearch("");
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === person.id_persona ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {person.nombres} {person.apellidos} ({person.cedula})
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No se encontraron personas</CommandEmpty>
                        )}
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    />
  );
} 