import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useFindAllNichosQuery } from "@/features/nichos/presentation/hooks/use-nicho-queries";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/shared/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface RHFAutocompleteNichoProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function RHFAutocompleteNicho({
  name,
  label,
  placeholder,
  disabled,
}: RHFAutocompleteNichoProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: nichos, isLoading } = useFindAllNichosQuery();

  // Filtrar por texto de búsqueda
  const filtered = (nichos ?? []).filter(n =>
    `${n.sector} ${n.fila} ${n.numero} ${n.tipo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = (nichos ?? []).find(n => n.idNicho === field.value);
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
                  disabled={disabled || isLoading}
                >
                  {selected ? (
                    <span className="font-normal">
                      {`${selected.sector} - Fila: ${selected.fila} - Número: ${selected.numero} - Tipo: ${selected.tipo}`}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal">
                      {placeholder || "Selecciona un nicho"}
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar sector, fila, número, tipo..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    {isLoading ? (
                      <div className="p-2 text-center text-muted-foreground">Cargando...</div>
                    ) : (
                      <>
                        {filtered.length > 0 ? (
                          filtered.map(n => (
                            <CommandItem
                              key={n.idNicho}
                              value={`${n.sector} ${n.fila} ${n.numero} ${n.tipo}`}
                              onSelect={() => {
                                field.onChange(n.idNicho);
                                setSearch("");
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === n.idNicho ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="font-normal">
                                {n.sector} - Fila: {n.fila} - Número: {n.numero} - Tipo: {n.tipo}
                              </span>
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No se encontraron nichos</CommandEmpty>
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