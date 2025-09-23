"use client";
import { FormProvider, useWatch } from "react-hook-form";
import { PersonEntity } from "../../domain/entities/person.entity";
import { usePersonForm } from "../hooks/use-person-form";
import { Button } from "@/shared/components/ui/button";
import clsx from "clsx";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSwitch from "@/shared/components/form/rhf/rhf-switch";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";

interface PersonFormProps {
  person?: PersonEntity;
}

export function PersonForm({ person }: PersonFormProps) {
  const { methods, onSubmit, isPending } = usePersonForm(person);

  // Observa el valor del campo 'fallecido'
  const fallecido = useWatch({
    control: methods.control,
    name: "fallecido",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFInput name="cedula" label="Cédula" />
          <RHFInput name="nombres" label="Nombres" />
          <RHFInput name="apellidos" label="Apellidos" />
          <RHFDatePickerCalendar name="fecha_nacimiento" label="Fecha de Nacimiento" />

          <RHFSwitch name="fallecido" label="Fallecido" />
          <div></div>

          { !fallecido && (
            <>
              <RHFInput name="direccion" label="Dirección" />
              <RHFInput name="telefono" label="Teléfono" />
              <RHFInput name="correo" label="Correo Electrónico" />
            </>
          )}

          {fallecido && (
            <>
              <RHFDatePickerCalendar name="fecha_defuncion" label="Fecha de Defunción" />
              <RHFDatePickerCalendar name="fecha_inhumacion" label="Fecha de Inhumación" />
              <RHFInput name="lugar_defuncion" label="Lugar de Defunción" />
              <RHFInput name="causa_defuncion" label="Causa de Defunción" />
              <RHFInput name="nacionalidad" label="Nacionalidad" />
            </>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className={clsx(
              "px-8",
              isPending && "opacity-50 cursor-not-allowed"
            )}
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
