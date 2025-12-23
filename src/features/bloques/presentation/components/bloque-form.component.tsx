"use client";
import { FormProvider } from "react-hook-form";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import { Button } from "@/shared/components/ui/button";
import clsx from "clsx";
import { useBloqueForm } from "../hooks/use-bloque-form";
import { useActiveCemetery } from "@/features/cementery/presentation/hooks/use-active-cemetery";

export function BloqueForm() {
  const { getActiveCemeteryId } = useActiveCemetery();
  const idCementerio = getActiveCemeteryId();
  const { methods, onSubmit, isPending } = useBloqueForm(idCementerio || "", undefined);

  if (!idCementerio) {
    return (
      <div className="text-sm text-muted-foreground">
        Selecciona un cementerio para crear bloques
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFSelect name="tipoBloque" label="Tipo de Bloque" options={[{ value: 'Bloque', label: 'Bloque' }, { value: 'Mausoleo', label: 'Mausoleo' }]} />
          <RHFInput name="nombre" label="Nombre" placeholder="Nombre del bloque" required />
          <RHFInput name="descripcion" label="Descripción" placeholder="Descripción" />
          <RHFInput name="numeroFilas" label="Filas" type="number" required />
          <RHFInput name="numeroColumnas" label="Columnas" type="number" required />
        </div>
        <div className="flex justify-end">
          <Button type="submit" className={clsx(isPending && "opacity-50")} disabled={isPending}>
            {isPending ? "Creando..." : "Crear Bloque"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

