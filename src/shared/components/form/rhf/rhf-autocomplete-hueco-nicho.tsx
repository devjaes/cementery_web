import { useState, useEffect } from "react";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
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
    ownerPersonId?: string;
}

export default function RHFAutocompleteHuecoNicho({
    name,
    label,
    placeholder,
    disabled,
    isAvailable,
    ownerPersonId,
}: RHFAutocompleteHuecoNichoProps) {
    const { control, setValue } = useFormContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const idCementerio = useWatch({ name: "idCementerio" });

    const { data: huecosNichos, isLoading } = useFindHuecosByCementerioQuery(idCementerio);
    const [allowedNichoIds, setAllowedNichoIds] = useState<string[] | null>(null);

    // When an owner is provided, resolve the nichos that belong to that person
    useEffect(() => {
        let cancelled = false;
        if (!ownerPersonId) {
            setAllowedNichoIds(null);
            return;
        }
        (async () => {
            try {
                // Resolve cedula for the selected person id, because backend endpoint
                // expects cedula for propietario lookups (por-persona/:cedula)
                const http = AxiosClient.getInstance();
                const personaResp = await http.get<any>(API_ROUTES.PERSONS.GET_BY_ID(ownerPersonId));
                const cedula: string | undefined = personaResp?.data?.data?.cedula;
                if (!cedula) {
                    setAllowedNichoIds([]);
                    return;
                }

                const propietarios = await PropietarioNichoRepositoryImpl.getInstance().findByPersonaCedula(cedula);
                if (cancelled) return;
                const nichoIds = (propietarios || []).map((p: any) => p.idNicho?.idNicho).filter(Boolean);
                setAllowedNichoIds(nichoIds);
            } catch (err) {
                console.warn("No se pudieron resolver propietarios para persona:", err);
                setAllowedNichoIds([]);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [ownerPersonId]);

    // Filtrar por texto de búsqueda
    const isAvailableState = (s: any) => String(s || "").toLowerCase() === "disponible";
    const baseList = (huecosNichos ?? []).filter(h => isAvailable ? isAvailableState(h.estado) : true);

    const filtered = baseList
        .filter(h => {
            if (!allowedNichoIds) return true; // no owner filter -> include all
            const id = h.idNicho?.idNicho;
            return id && allowedNichoIds.includes(id);
        })
        .filter(h =>
            `${h.idNicho?.fila ?? ""} ${h.idNicho?.columna ?? ""} ${h.numHueco ?? ""} ${h.idNicho?.tipo ?? ""}`
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
                                            {`Fila: ${selected.idNicho?.fila ?? "-"} - Columna: ${selected.idNicho?.columna ?? "-"} - Hueco: ${selected.numHueco} - Tipo: ${selected.idNicho?.tipo ?? "-"}`}
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
                                        placeholder="Buscar fila, columna, hueco, tipo..."
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
                                                            value={`${h.idNicho?.fila ?? ""} ${h.idNicho?.columna ?? ""} ${h.numHueco ?? ""} ${h.idNicho?.tipo ?? ""}`}
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

                                                                    // También rellenar el solicitante (`idSolicitante`) con el id de la persona propietaria
                                                                    try {
                                                                        const ownerPersonId = propietario?.idPersona?.id_persona || propietario?.idPersona?.id_persona;
                                                                        if (ownerPersonId) {
                                                                            setValue("idSolicitante", ownerPersonId, { shouldValidate: true, shouldDirty: true });
                                                                        }
                                                                    } catch (e) {
                                                                        // No bloquear si falla
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
                                                                Fila: {h.idNicho?.fila ?? "-"} - Columna: {h.idNicho?.columna ?? "-"} - Hueco: {h.numHueco} - Tipo: {h.idNicho?.tipo ?? "-"}
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