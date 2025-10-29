"use client";

import { FormProvider } from "react-hook-form";
import { useState } from "react";
import RHFCementerySelect from "@/shared/components/form/rhf/rhf-cementery-select";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import RHFAutocompletePerson from "@/shared/components/form/rhf/rhf-autocomplete-person";
import RHFTextarea from "@/shared/components/form/rhf/rhf-text-area";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";
import { CreateMejoraDTO, CreateMejoraSchema } from "../../domain/schemas/mejora.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateMejoraMutation, useUploadMejoraFilesMutation } from "../hooks/use-mejora-mutation";

const metodoSolicitudOptions = [
  { value: "Escrita", label: "Escrita" },
  { value: "Verbal", label: "Verbal (solo emergencia)" },
];

const tipoServicioOptions = [
  { value: "ARREGLOS", label: "Arreglos" },
  { value: "CONSTRUCCION", label: "Construcción" },
  { value: "LAPIDA", label: "Lápida" },
];

export default function MejoraForm() {
  const methods = useForm<CreateMejoraDTO>({ resolver: zodResolver(CreateMejoraSchema) as any });
  const { mutate: create, isPending } = useCreateMejoraMutation();
  const { mutate: uploadFiles } = useUploadMejoraFilesMutation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (data: CreateMejoraDTO) => {
    create(data, {
      onSuccess: (created) => {
        if (selectedFiles.length > 0) {
          uploadFiles({ id: created.idMejora, files: selectedFiles });
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(methods.handleSubmit as any)(handleSubmit)} className="space-y-8">
        {/* A y B - Institucional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFCementerySelect name="idCementerio" label="Cementerio *" placeholder="Selecciona un cementerio" />
          <RHFInput name="pantoneroACargo" label="Panteonero a cargo *" placeholder="Nombre del panteonero" />
          <RHFSelect name="metodoSolicitud" label="Método de solicitud *" options={metodoSolicitudOptions} placeholder="Selecciona" />
        </div>

        {/* C - Solicitante */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos del solicitante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFAutocompletePerson name="solicitanteId" label="Solicitante *" placeholder="Selecciona solicitante" vivos={true} />
            <RHFInput name="celularSolicitante" label="Celular" placeholder="Número de contacto" />
            <RHFInput name="direccionSolicitante" label="Dirección" placeholder="Dirección" />
            <RHFInput name="correoSolicitante" label="Correo electrónico" placeholder="correo@dominio.com" />
          </div>
        </div>

        {/* D - Fallecido */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos de la persona fallecida</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFAutocompletePerson name="fallecidoId" label="Fallecido" placeholder="Selecciona fallecido" vivos={false} />
            <RHFDatePickerCalendar name="fechaFallecimiento" label="Fecha de fallecimiento" />
          </div>
        </div>

        {/* E - Datos del nicho/sitio */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos del nicho/sitio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput name="propietarioNicho" label="Nombre del propietario" />
            <RHFInput name="numeroNichos" label="Número de nichos" type="number" />
            <RHFInput name="lugarNicho" label="Lugar del nicho" placeholder="Cementerio Central" />
            <RHFInput name="codigoSitio" label="Lugar del sitio / código" />
            <RHFInput name="administradorNicho" label="Nombre del administrador" />
            <RHFSelect name="esPropio" label="Propiedad" options={[{ value: "true", label: "Propio" }, { value: "false", label: "Arrendado" }]} placeholder="Selecciona" />
          </div>
          <RHFTextarea name="observacionNicho" label="Observación" rows={3} />
        </div>

        {/* F - Acción */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos para realizar la acción</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFSelect name="tipoServicio" label="Tipo de servicio a efectuar *" options={tipoServicioOptions} placeholder="Selecciona" />
            <RHFDatePickerCalendar name="fechaInicio" label="Fecha de inicio" />
            <RHFDatePickerCalendar name="fechaFin" label="Fecha de fin" />
            <RHFInput name="horario" label="Horario" placeholder="Ej: 09h00 a 17h00" />
          </div>
          <RHFTextarea name="observacionAccion" label="Observación" rows={3} />
        </div>

        {/* Archivos */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Documentos requeridos</h3>
          <p className="text-sm text-muted-foreground">Adjunta solicitud firmada, cédula del solicitante, y evidencias del nicho (antes). El comprobante de pago se subirá en el flujo de pagos.</p>
          <input
            type="file"
            multiple
            onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
            className="block w-full text-sm"
          />
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isPending ? "Guardando..." : "Guardar solicitud"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}


