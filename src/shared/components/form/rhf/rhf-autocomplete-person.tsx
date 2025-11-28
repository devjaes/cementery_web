import { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useFindPersonByIdQuery, useSearchPersonsQuery, useFindAllPersonsQuery } from "@/features/person/presentation/hooks/use-person-queries";
import { useSearchRequisitoInhumacionFallecidosQuery, useFindAllRequisitosInhumacionQuery } from "@/features/requisitos-inhumacion/presentation/hooks/use-requisito-inhumacion-queries";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { PropietarioNichoRepositoryImpl } from "@/features/propietarios-nichos/infrastructure/repositories/propietario-nicho.repository.impl";
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
  onlyNotInhumed?: boolean; // cuando es fallecido, mostrar solo los fallecidos que NO están inhumados
  cementerioId?: string; // optional filter: show only persons who are propietarios in this cementerio
}

export default function RHFAutocompletePerson({ name, label, placeholder, disabled, vivos, onlyNotInhumed, cementerioId }: RHFAutocompletePersonProps) {
  const { control, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: persons, isLoading: isLoadingPersons } = useSearchPersonsQuery(debouncedSearch, vivos);
  // fallback list of all persons
  const allPersonsQuery = useFindAllPersonsQuery();
  const allPersons = allPersonsQuery.data ?? [];
  const isLoadingAllPersons = allPersonsQuery.isLoading;
  // secondary explicit deceased persons list
  const deceasedPersonsQuery = useSearchPersonsQuery("", false);
  const deceasedPersons = deceasedPersonsQuery.data ?? [];
  const isLoadingDeceasedPersons = deceasedPersonsQuery.isLoading;

  // requisitos queries to determine which persons already have a requisito/codigo
  const searchRequisitosQuery = useSearchRequisitoInhumacionFallecidosQuery(debouncedSearch);
  const allRequisitosQuery = useFindAllRequisitosInhumacionQuery();

  const selectedValue = watch(name) as string | undefined;
  const selectedId = typeof selectedValue === "string" ? selectedValue : "";
  const { data: selectedPersonById } = useFindPersonByIdQuery(selectedId);
  const [allowedPersonIds, setAllowedPersonIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAllowed = async () => {
      if (!cementerioId) {
        setAllowedPersonIds(null);
        return;
      }
      try {
        const repo = PropietarioNichoRepositoryImpl.getInstance();
        const all = await repo.findAll();
        if (cancelled) return;
        const ids = new Set<string>();
        for (const p of all) {
          const nicho = (p as any)?.idNicho;
          const persona = (p as any)?.idPersona || (p as any)?.id_persona || (p as any)?.idPersona?.id_persona;
          const nichoCementerioId = nicho?.idCementerio?.idCementerio || nicho?.idCementerio;
          if (nichoCementerioId && persona && String(nichoCementerioId) === String(cementerioId)) {
            ids.add(String(persona?.id_persona || persona));
          }
        }
        setAllowedPersonIds(ids);
      } catch (e) {
        console.warn("Error loading propietarios for cementerio filter:", e);
        setAllowedPersonIds(new Set());
      }
    };

    loadAllowed();
    return () => { cancelled = true; };
  }, [cementerioId]);

  // Refetch helpful queries when popover opens to ensure fresh data
  useEffect(() => {
    if (open) {
      try {
        if (typeof allPersonsQuery?.refetch === 'function') allPersonsQuery.refetch();
      } catch (e) {}
      try {
        // Only refetch requisitos search when we have a minimum query length
        const q = (debouncedSearch || "").trim();
        if (q.length >= 2 && typeof searchRequisitosQuery?.refetch === 'function') {
          searchRequisitosQuery.refetch();
        }
      } catch (e) {}
    }
  }, [open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Build the available persons list according to the requested filtering mode
        const q = (debouncedSearch || "").trim();
        let availablePersons = persons ?? [];

        // Debug: log relevant data to help troubleshooting
        try {
          // eslint-disable-next-line no-console
          console.log('RHFAutocompletePerson debug:', {
            name,
            vivos,
            onlyNotInhumed,
            open,
            search,
            debouncedSearch: q,
            personsCount: (persons || []).length,
            allPersonsCount: (allPersons || []).length,
            deceasedPersonsCount: (deceasedPersons || []).length,
            requisitosSearch: (searchRequisitosQuery?.data as any) ?? null,
            allRequisitosCount: (allRequisitosQuery?.data || []).length,
          });
        } catch (e) {}

        if (onlyNotInhumed && vivos === false) {
          // collect person ids that already have requisitos / codigo de inhumacion
          const requisitoPersonIds = new Set<string>();
          if (q.length >= 2) {
            const sr = searchRequisitosQuery?.data as any;
            if (sr && Array.isArray(sr.fallecidos)) {
              sr.fallecidos.forEach((f: any) => {
                const pid = f?.fallecido?.id_persona;
                const requisitos = f?.requisitos ?? [];
                if (pid && requisitos.length > 0) requisitoPersonIds.add(pid);
              });
            }
            // use persons search but exclude those with fecha_inhumacion or with requisitos
            availablePersons = (persons || []).filter((p) => p.fallecido && !p.fecha_inhumacion && !requisitoPersonIds.has(p.id_persona));
          } else {
            // fallback: build set from all requisitos
            const allReqs = allRequisitosQuery?.data ?? [];
            if (Array.isArray(allReqs) && allReqs.length > 0) {
              allReqs.forEach((r: any) => {
                const pid = r?.idFallecido?.id_persona ?? r?.idFallecido;
                if (pid) requisitoPersonIds.add(pid);
              });
            }
            if (allPersons && allPersons.length > 0) {
              availablePersons = (allPersons || []).filter((p) => p.fallecido && !p.fecha_inhumacion && !requisitoPersonIds.has(p.id_persona));
            } else if (deceasedPersons && deceasedPersons.length > 0) {
              availablePersons = (deceasedPersons || []).filter((p) => p.fallecido && !p.fecha_inhumacion && !requisitoPersonIds.has(p.id_persona));
            } else {
              availablePersons = [];
            }
          }
        }

        // If after applying strict filters we have no results, as a pragmatic fallback
        // include deceased persons that do NOT appear in requisitos (ignore fecha_inhumacion)
        // This helps when the backend has fecha_inhumacion populated but no requisito record.
        try {
          if (onlyNotInhumed && vivos === false && (!availablePersons || availablePersons.length === 0)) {
            const fallbackPool = (persons && persons.length > 0) ? persons : (allPersons && allPersons.length > 0 ? allPersons : deceasedPersons || []);
            // Build requisitos set from search or all requisitos
            const requisitoPersonIdsFallback = new Set<string>();
            const sr = searchRequisitosQuery?.data as any;
            if (sr && Array.isArray(sr.fallecidos)) {
              sr.fallecidos.forEach((f: any) => {
                const pid = f?.fallecido?.id_persona;
                if (pid) requisitoPersonIdsFallback.add(pid);
              });
            } else {
              const allReqs = allRequisitosQuery?.data ?? [];
              if (Array.isArray(allReqs)) {
                allReqs.forEach((r: any) => {
                  const pid = r?.idFallecido?.id_persona ?? r?.idFallecido;
                  if (pid) requisitoPersonIdsFallback.add(pid);
                });
              }
            }

            const fallbackResults = (fallbackPool || []).filter((p: any) => p.fallecido && !requisitoPersonIdsFallback.has(p.id_persona));
            availablePersons = fallbackResults;
          }
        } catch (e) {
          // ignore any fallback errors
        }

        // Apply cemetery-owner filter if active: if allowedPersonIds is non-null we restrict to those ids
        if (allowedPersonIds !== null) {
          availablePersons = (availablePersons || []).filter((p: any) => allowedPersonIds.has(p.id_persona));
        }

        const selectedPerson = availablePersons?.find(p => p.id_persona === field.value) ?? selectedPersonById;
        const loading = onlyNotInhumed && vivos === false
          ? (q.length >= 2 ? isLoadingPersons : (isLoadingAllPersons || isLoadingDeceasedPersons))
          : isLoadingPersons;
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
                    ? [selectedPerson.nombres, selectedPerson.apellidos].filter(Boolean).join(" ") + ` (${selectedPerson.cedula})`
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
                    {loading ? (
                      <div className="p-2 text-center text-muted-foreground">Cargando...</div>
                    ) : (
                      <>
                        {availablePersons && availablePersons.length > 0 ? (
                          availablePersons.map(person => {
                            const fullName = [person.nombres, person.apellidos].filter(Boolean).join(" ");
                            return (
                              <CommandItem
                                key={person.id_persona}
                                value={`${fullName} ${person.cedula}`}
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
                                {fullName} ({person.cedula})
                              </CommandItem>
                            );
                          })
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