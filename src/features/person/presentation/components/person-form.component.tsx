"use client";
import { FormProvider, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { PersonEntity } from "../../domain/entities/person.entity";
import { usePersonForm } from "../hooks/use-person-form";
import { Button } from "@/shared/components/ui/button";
import clsx from "clsx";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSwitch from "@/shared/components/form/rhf/rhf-switch";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";

interface PersonFormProps {
  person?: PersonEntity;
  onSuccess?: () => void;
}

export function PersonForm({ person, onSuccess }: PersonFormProps) {
  const { methods, onSubmit, isPending } = usePersonForm({ person, onSuccess });

  const fallecido = useWatch({
    control: methods.control,
    name: "fallecido",
  });

  // Prevent changing fallecido from true to false
  const isFallecidoDisabled = person?.fallecido === true;

  // Ensure fallecido stays true if person is already deceased
  useEffect(() => {
    if (isFallecidoDisabled && person?.fallecido === true) {
      methods.setValue("fallecido", true, { shouldValidate: false });
    }
  }, [isFallecidoDisabled, person?.fallecido, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">
              Información Básica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInput
                name="cedula"
                label="Cédula"
                required
                placeholder="Ej: 0550318505"
              />
              <RHFInput
                name="nombres"
                label="Nombres"
                required
                placeholder="Ej: Juan Pablo"
              />
              <RHFInput
                name="apellidos"
                label="Apellidos"
                required
                placeholder="Ej: García López"
              />
              <RHFDatePickerCalendar
                name="fecha_nacimiento"
                label="Fecha de Nacimiento"
                required
                placeholder="Selecciona la fecha de nacimiento"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="mb-4">
              <RHFSwitch
                name="fallecido"
                label="Fallecido"
                disabled={isFallecidoDisabled}
                description={
                  isFallecidoDisabled
                    ? "No se puede cambiar el estado de una persona fallecida"
                    : undefined
                }
              />
            </div>
          </div>

          {!fallecido && (
            <div className="border-t pt-6 space-y-4">
              <h4 className="text-base font-semibold text-foreground mb-4">
                Información de Contacto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInput
                  name="direccion"
                  label="Dirección"
                  placeholder="Ej: Av. Principal 123"
                />
                <RHFInput
                  name="telefono"
                  label="Teléfono"
                  type="tel"
                  placeholder="Ej: 0991234567"
                />
                <RHFInput
                  name="correo"
                  label="Correo Electrónico"
                  type="email"
                  placeholder="Ej: ejemplo@correo.com"
                />
              </div>
            </div>
          )}

          {fallecido && (
            <div className="border-t pt-6 space-y-4">
              <h4 className="text-base font-semibold text-foreground mb-4">
                Datos de Defunción
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFDatePickerCalendar
                  name="fecha_defuncion"
                  label="Fecha de Defunción"
                  placeholder="Selecciona la fecha de defunción"
                />
                <RHFInput
                  name="lugar_defuncion"
                  label="Lugar de Defunción"
                  placeholder="Ej: Hospital General"
                />
                <RHFInput
                  name="causa_defuncion"
                  label="Causa de Defunción"
                  placeholder="Ej: Enfermedad cardiovascular"
                />
                <RHFInput
                  name="nacionalidad"
                  label="Nacionalidad"
                  placeholder="Ej: Ecuatoriana"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
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
