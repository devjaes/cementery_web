"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";
import { EnableNichoEntity } from "../../domain/entities/nicho.entity";
import { useEnableNicho } from "../../presentation/hooks/use-enable-nicho";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import clsx from "clsx";

const tipoOptions = [
  { value: "Nicho", label: "Nicho" },
  { value: "Mausoleo", label: "Mausoleo" },
  { value: "Fosa", label: "Fosa" },
];

interface EnableNichoFormProps {
  nichoId: string;
  onSuccess?: () => void;
}

export function EnableNichoForm({ nichoId, onSuccess }: EnableNichoFormProps) {
  const methods = useForm<EnableNichoEntity>({
    defaultValues: {
      tipo: "Nicho",
      fecha_construccion: new Date().toISOString().split('T')[0],
      num_huecos: 1,
      observaciones: "",
    },
  });

  const { mutate: enableNicho, isPending } = useEnableNicho();

  const tipo = useWatch({ control: methods.control, name: "tipo" });

  useEffect(() => {
    if (tipo === "Nicho" || tipo === "Fosa") {
      methods.setValue("num_huecos", 1);
    } else if (tipo === "Mausoleo") {
      const numHuecos = methods.getValues("num_huecos");
      if (!numHuecos || numHuecos < 1 || numHuecos > 9) {
        methods.setValue("num_huecos", 1);
      }
    }
  }, [tipo, methods]);

  const onSubmit = (data: EnableNichoEntity) => {
    enableNicho(
      { nichoId, data },
      {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      }
    );
  };

  const isFixedOne = tipo === "Nicho" || tipo === "Fosa";

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFSelect 
            name="tipo" 
            label="Tipo" 
            options={tipoOptions} 
            placeholder="Selecciona el tipo de nicho" 
          />
          <RHFDatePickerCalendar 
            name="fecha_construccion" 
            label="Fecha de construcción" 
          />
          <RHFInput
            name="num_huecos"
            label="Número de Huecos"
            type="number"
            disabled={isFixedOne}
          />
        </div>
        <div>
          <RHFInput 
            name="observaciones" 
            label="Observaciones"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="submit" 
            size="lg" 
            className={clsx("px-8", isPending && "opacity-50 cursor-not-allowed")}
            disabled={isPending}
          >
            {isPending ? "Habilitando..." : "Habilitar Nicho"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
