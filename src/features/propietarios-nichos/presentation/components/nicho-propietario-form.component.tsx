import { FormProvider } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
// import RHFCalendar from "@/shared/components/form/rhf/rhf-calendar";
import RHFAutocompletePerson from "@/shared/components/form/rhf/rhf-autocomplete-person";
import { usePropietarioForm } from "../hooks/use-propietario-form";
import clsx from "clsx";
import { DOCUMENT_TYPES } from "../../domain/constants/document-types";
import { TIPO_PROPIETARIO_OPTIONS } from "../../domain/constants/tipo-propietario";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";

interface NichoPropietarioFormProps {
  nichoId: string;
  onSuccess?: () => void;
}

export function NichoPropietarioForm({ nichoId, onSuccess }: NichoPropietarioFormProps) {
  const { methods, onSubmit, isPending } = usePropietarioForm(nichoId, onSuccess);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFAutocompletePerson name="idPersona" label="Persona" vivos={true} />
          <RHFDatePickerCalendar name="fechaAdquisicion" label="Fecha de Adquisición" />
          <RHFSelect name="tipoDocumento" label="Tipo de Documento" options={DOCUMENT_TYPES} placeholder="Selecciona el tipo de documento" />
          <RHFInput name="numeroDocumento" label="Número de Documento" />
          <RHFSelect name="tipo" label="Tipo de Propietario" options={TIPO_PROPIETARIO_OPTIONS} placeholder="Selecciona el tipo de propietario" />
          <RHFInput name="razon" label="Razón de Adquisición" />
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