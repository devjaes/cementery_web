import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useFindAllCementeriesQuery } from "@/features/cementery/presentation/hooks/use-cementery-queries";
import { useActiveCemetery } from "@/features/cementery/presentation/hooks/use-active-cemetery";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";

interface RHFCementerySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  useActiveCemeteryAsDefault?: boolean;
}

export default function RHFCementerySelect({
  name = "idCementerio",
  label,
  placeholder,
  disabled,
  useActiveCemeteryAsDefault = true,
}: RHFCementerySelectProps) {
  const { data: cemeteries, isLoading } = useFindAllCementeriesQuery();
  const { activeCemetery } = useActiveCemetery();
  const { setValue, getValues } = useFormContext();
  const initializedRef = useRef(false);

  const activeCemeteryId = activeCemetery?.idCementerio;

  useEffect(() => {
    // Esperar a que:
    // 1. useActiveCemeteryAsDefault esté habilitado
    // 2. Haya un cementerio activo
    // 3. Los cementerios estén cargados (importante!)
    if (
      !useActiveCemeteryAsDefault ||
      !activeCemeteryId ||
      isLoading ||
      !cemeteries?.length
    ) {
      return;
    }

    // Obtener el valor actual dentro del useEffect
    const currentValue = getValues(name);

    // Establecer el valor si:
    // 1. No se ha inicializado aún, O
    // 2. El valor actual está vacío/null/undefined
    if (!initializedRef.current || !currentValue) {
      setValue(name, activeCemeteryId, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false,
      });
      initializedRef.current = true;
    }
  }, [
    useActiveCemeteryAsDefault,
    activeCemeteryId,
    isLoading,
    cemeteries,
    setValue,
    name,
    getValues,
  ]);

  const options =
    cemeteries?.map((c) => ({
      value: c.idCementerio,
      label: c.nombre,
    })) ?? [];

  return (
    <RHFSelect
      name={name}
      label={label}
      options={options}
      placeholder={
        isLoading
          ? "Cargando cementerios..."
          : placeholder || "Selecciona un cementerio"
      }
      disabled={isLoading || disabled}
    />
  );
}
