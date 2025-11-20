import { useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useFindHuecosByCementerioQuery } from "@/features/huecos/presentation/hooks/use-hueco-queries";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/shared/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { PropietarioNichoRepositoryImpl } from "@/features/propietarios-nichos/infrastructure/repositories/propietario-nicho.repository.impl";

interface RHFAutocompleteHuecoNichoProps {
    name: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    isAvailable?: boolean;
}

export default function RHFAutocompleteHuecoNicho({
    name,
    label,
    placeholder,
    disabled,
    isAvailable,
}: RHFAutocompleteHuecoNichoProps) {
    const { control, setValue } = useFormContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const idCementerio = useWatch({ name: "idCementerio" });

    const { data: huecosNichos, isLoading } = useFindHuecosByCementerioQuery(idCementerio);

    // Filtrar por texto de búsqueda
    const filtered = (huecosNichos ?? []).filter(h => isAvailable ? h.estado === "Disponible" : true).filter(h =>
        `${h.idNicho?.sector} ${h.idNicho?.fila} ${h.idNicho?.numero} ${h.numHueco} ${h.idNicho?.tipo}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const selected = (huecosNichos ?? []).find(h => h.idDetalleHueco === field.value);
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
                                    disabled={disabled || isLoading || !idCementerio}
                                >
                                    {selected ? (
                                        <span className="font-normal">
                                            {`Sector: ${selected.idNicho?.sector} - Fila: ${selected.idNicho?.fila} - Número: ${selected.idNicho?.numero} - Hueco: ${selected.numHueco} - Tipo: ${selected.idNicho?.tipo}`}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 font-normal">
                                            {placeholder || "Selecciona un hueco"}
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
                                                    filtered.map(h => (
                                                        <CommandItem
                                                            key={h.idDetalleHueco}
                                                            value={`${h.idNicho?.sector} ${h.idNicho?.fila} ${h.idNicho?.numero} ${h.numHueco} ${h.idNicho?.tipo}`}
                                                            onSelect={async () => {
                                                                    field.onChange(h.idDetalleHueco);
                                                                    // Intentar obtener el propietario del nicho (si existe) desde el propio objeto
                                                                    let propietarios = h.idNicho?.propietarios;
                                                                    // Si no vienen propietarios embebidos, consultar al repositorio por idNicho
                                                                    if ((!propietarios || propietarios.length === 0) && h.idNicho?.idNicho) {
                                                                        try {
                                                                            propietarios = await PropietarioNichoRepositoryImpl.getInstance().findByNicho(h.idNicho.idNicho);
                                                                        } catch (err) {
                                                                            propietarios = [];
                                                                            console.warn("No se pudieron obtener propietarios del nicho:", err);
                                                                        }
                                                                    }

                                                                    const propietario = propietarios && propietarios.length > 0
                                                                        ? propietarios.find((p: any) => p.activo) ?? propietarios[0]
                                                                        : undefined;

                                                                    const ownerName = propietario?.idPersona
                                                                        ? [propietario.idPersona.nombres ?? propietario.idPersona.nombres, propietario.idPersona.apellidos ?? propietario.idPersona.apellidos].filter(Boolean).join(" ")
                                                                        : "";

                                                                    // Rellenar el campo nombreAdministradorNicho en el formulario
                                                                    try {
                                                                        setValue("nombreAdministradorNicho", ownerName, { shouldValidate: true, shouldDirty: true });
                                                                    } catch (e) {
                                                                        // En caso de que el formulario no tenga ese campo, no interrumpir
                                                                    }

                                                                    setSearch("");
                                                                    setOpen(false);
                                                                }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === h.idDetalleHueco ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <span className="font-normal">
                                                                Sector: {h.idNicho?.sector} - Fila: {h.idNicho?.fila} - Número: {h.idNicho?.numero} - Hueco: {h.numHueco} - Tipo: {h.idNicho?.tipo}
                                                            </span>
                                                        </CommandItem>
                                                    ))
                                                ) : (
                                                    <CommandEmpty>No se encontraron huecos</CommandEmpty>
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