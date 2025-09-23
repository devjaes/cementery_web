"use client";
import { FormProvider } from "react-hook-form";
import { NichoEntity } from "../../domain/entities/nicho.entity";
import { Button } from "@/shared/components/ui/button";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import RHFCementerySelect from "@/shared/components/form/rhf/rhf-cementery-select";
import { useNichoForm } from "../hooks/use-nicho-form";
import clsx from "clsx";
// import RHFCalendar from "@/shared/components/form/rhf/rhf-calendar";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";

const tipoOptions = [
  { value: "Nicho", label: "Nicho" },
  { value: "Mausoleo", label: "Mausoleo" },
  { value: "Fosa", label: "Fosa" },
];

interface NichoFormProps {
  nicho?: NichoEntity;
}

export function NichoForm({ nicho }: NichoFormProps) {
  const { methods, onSubmit, isPending } = useNichoForm(nicho);

  const tipo = useWatch({ control: methods.control, name: "tipo" });

  useEffect(() => {
    if (tipo === "Nicho" || tipo === "Fosa") {
      methods.setValue("numHuecos", 1);
    } else if (tipo === "Mausoleo") {
      const numHuecos = methods.getValues("numHuecos");
      if (!numHuecos || numHuecos < 1 || numHuecos > 9) {
        methods.setValue("numHuecos", 1);
      }
    }
  }, [tipo, methods]);

  const isFixedOne = tipo === "Nicho" || tipo === "Fosa";

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFCementerySelect name="idCementerio" label="Cementerio" />
          <RHFInput name="sector" label="Sector" />
          <RHFInput name="fila" label="Fila" />
          <RHFInput name="numero" label="Número" />
          <RHFSelect name="tipo" label="Tipo" options={tipoOptions} placeholder="Selecciona el tipo de nicho" />
          <RHFDatePickerCalendar name="fechaConstruccion" label="Fecha de adquisición" />
          <RHFInput
            name="numHuecos"
            label="Número de Huecos"
            type="number"
            disabled={isFixedOne}
          />
          <RHFInput name="observaciones" label="Observaciones" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" className={clsx("px-8", isPending && "opacity-50 cursor-not-allowed")}
            disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

