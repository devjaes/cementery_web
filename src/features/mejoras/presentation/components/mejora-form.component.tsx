"use client";

import { FormProvider } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import RHFAutocompletePerson from "@/shared/components/form/rhf/rhf-autocomplete-person";
import RHFTextarea from "@/shared/components/form/rhf/rhf-text-area";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";
import { CreateMejoraDTO, CreateMejoraSchema } from "../../domain/schemas/mejora.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateMejoraMutation, useUploadMejoraFilesMutation } from "../hooks/use-mejora-mutation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

type MejoraFormProps = {
  defaultValues?: Partial<CreateMejoraDTO>;
  isPrefillLoading?: boolean;
  searchTerm?: string;
};

const tipoServicioOptions = [
  { value: "ARREGLOS", label: "Arreglos" },
  { value: "CONSTRUCCION", label: "Construcción" },
  { value: "LAPIDA", label: "Lápida" },
];

const baseDefaultValues: Partial<CreateMejoraDTO> = {
  metodoSolicitud: "escrito",
  entidad: "GADM Santiago de Pillaro",
  observacionSolicitante: "Sin observaciones",
  panteoneroACargo: "Por asignar", // Valor por defecto para campo requerido
};

export default function MejoraForm({ 
  defaultValues, 
  isPrefillLoading = false,
  searchTerm = "" 
}: MejoraFormProps) {
  const router = useRouter();
  
  // Combinar valores base con los valores por defecto proporcionados
  const initialValues = useMemo(() => {
    const combined = { ...baseDefaultValues, ...defaultValues };
    return combined;
  }, [defaultValues]);
  
  const methods = useForm<CreateMejoraDTO>({
    // @ts-expect-error - Incompatibilidad de versiones de react-hook-form en node_modules
    resolver: zodResolver(CreateMejoraSchema),
    defaultValues: initialValues,
  });
  
  const { mutate: create, isPending } = useCreateMejoraMutation();
  const { mutate: uploadFiles } = useUploadMejoraFilesMutation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("general");

  const sections = useMemo(
    () => [
      { value: "solicitante", label: "Solicitante", description: "Información de contacto del solicitante" },
      { value: "accion", label: "Acción", description: "Programación de la intervención" },
      { value: "documentos", label: "Documentos", description: "Archivos requeridos para la solicitud" },
    ],
    [],
  );

  const currentSectionIndex = sections.findIndex((section) => section.value === activeTab);
  const isFirstSection = currentSectionIndex <= 0;
  const isLastSection = currentSectionIndex >= sections.length - 1;

  const goToSection = (index: number) => {
    const section = sections[index];
    if (!section) return;
    setActiveTab(section.value);
  };

  const handleNextSection = () => {
    goToSection(currentSectionIndex + 1);
  };

  const handlePrevSection = () => {
    goToSection(currentSectionIndex - 1);
  };

  useEffect(() => {
    setActiveTab("solicitante");
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      const combined = { ...baseDefaultValues, ...defaultValues };
      methods.reset(combined);
      setSelectedFiles([]);
    }
  }, [defaultValues, methods]);

  const handleSubmit = (data: CreateMejoraDTO) => {
    const redirectUrl = searchTerm ? `/mejoras?q=${encodeURIComponent(searchTerm)}` : "/mejoras";
    
    create(data, {
      onSuccess: (created) => {
        if (selectedFiles.length > 0) {
          uploadFiles(
            { id: created.idMejora, files: selectedFiles },
            {
              onSettled: () => {
                router.push(redirectUrl);
              },
            },
          );
        } else {
          router.push(redirectUrl);
        }
      },
    });
  };

  // Log de errores de validación
  useEffect(() => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.log("❌ Errores de validación:", methods.formState.errors);
    }
  }, [methods.formState.errors]);

  return (
    <FormProvider {...methods}>
      {/* @ts-expect-error - Incompatibilidad de tipos entre react-hook-form y el DTO */}
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Mostrar errores de validación si existen */}
        {Object.keys(methods.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-red-800 font-semibold mb-2">Errores en el formulario:</h4>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {Object.entries(methods.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}</strong>: {error?.message?.toString() || "Campo requerido"}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Navega por los bloques para completar la solicitud.</p>
            <div className="overflow-x-auto pb-1">
              <TabsList className="flex min-w-max gap-2 bg-transparent p-0">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.value}
                    value={section.value}
                    className="min-w-[150px] bg-muted/40"
                    disabled={isPrefillLoading}
                  >
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value="solicitante" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Datos del solicitante</h3>
              <p className="text-sm text-muted-foreground">Confirma la persona responsable de la mejora y su información de contacto.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFAutocompletePerson name="id_solicitante" label="Solicitante *" placeholder="Selecciona solicitante" vivos={true} disabled={isPrefillLoading} />
              <RHFInput
                name="solicitanteTelefono"
                label="Teléfono"
                placeholder="Número de contacto"
                disabled={isPrefillLoading}
              />
              <RHFInput
                name="solicitanteDireccion"
                label="Dirección"
                placeholder="Dirección"
                disabled={isPrefillLoading}
              />
              <RHFInput
                name="solicitanteCorreo"
                label="Correo electrónico"
                placeholder="correo@dominio.com"
                disabled={isPrefillLoading}
              />
            </div>
            <RHFTextarea
              name="observacionSolicitante"
              label="Observaciones del solicitante"
              placeholder="Sin observaciones"
              rows={3}
              disabled={isPrefillLoading}
              maxLength={200}
            />
          </TabsContent>

          <TabsContent value="accion" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Plan de intervención</h3>
              <p className="text-sm text-muted-foreground">Define el servicio, fechas y horarios autorizados.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFSelect name="tipoServicio" label="Tipo de servicio a efectuar *" options={tipoServicioOptions} placeholder="Selecciona" disabled={isPrefillLoading} />
              <RHFDatePickerCalendar name="fechaInicio" label="Fecha de inicio" />
              <RHFDatePickerCalendar name="fechaFin" label="Fecha de fin" />
              <RHFInput
                name="horarioTrabajo"
                label="Horario de trabajo"
                placeholder="Ej: 09h00 a 17h00"
                disabled={isPrefillLoading}
              />
            </div>
            <RHFTextarea name="observacionServicio" label="Observación del servicio" rows={3} maxLength={200} />
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Documentación requerida</h3>
              <p className="text-sm text-muted-foreground">Carga los archivos de respaldo solicitados para completar la autorización.</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Adjunta solicitud firmada, cédula del solicitante y evidencias del nicho (antes). El comprobante de pago se subirá en el flujo de pagos.</p>
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                className="block w-full text-sm"
                disabled={isPrefillLoading}
              />
            </div>
          </TabsContent>

          <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              {sections[currentSectionIndex]?.description}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handlePrevSection} disabled={isFirstSection || isPrefillLoading}>
                Anterior
              </Button>
              {!isLastSection && (
                <Button type="button" onClick={handleNextSection} disabled={isPrefillLoading}>
                  Siguiente
                </Button>
              )}
              <Button type="submit" disabled={isPending || isPrefillLoading}>
                {isPending ? "Guardando..." : "Guardar solicitud"}
              </Button>
            </div>
          </div>
        </Tabs>

    {/* Campos ocultos para sección General */}
    <input type="hidden" {...methods.register("idCementerio")} />
    <input type="hidden" {...methods.register("panteoneroACargo")} />
    <input type="hidden" {...methods.register("metodoSolicitud")} />
    <input type="hidden" {...methods.register("entidad")} />

    {/* Campos ocultos para sección Fallecido */}
    <input type="hidden" {...methods.register("id_fallecido")} />
    <input type="hidden" {...methods.register("fechaFallecimiento")} />

    {/* Campos ocultos para sección Nicho */}
    <input type="hidden" {...methods.register("propietarioNicho")} />
    <input type="hidden" {...methods.register("numeroNichos")} />
    <input type="hidden" {...methods.register("lugarNicho")} />
    <input type="hidden" {...methods.register("codigoSitio")} />
    <input type="hidden" {...methods.register("administradorNicho")} />
    <input type="hidden" {...methods.register("esPropio")} />
    <input type="hidden" {...methods.register("observacionNicho")} />

    {/* Campos ocultos para valores informativos que siguen el flujo */}
    <input type="hidden" {...methods.register("id_nicho")} />
    <input type="hidden" {...methods.register("propietarioNombre")} />
    <input type="hidden" {...methods.register("propietarioFechaAdquisicion")} />
    <input type="hidden" {...methods.register("propietarioTipoTenencia")} />
    <input type="hidden" {...methods.register("codigoAutorizacion")} />
    <input type="hidden" {...methods.register("condicion")} />
    <input type="hidden" {...methods.register("autorizacionTexto")} />
    <input type="hidden" {...methods.register("normativaAplicable")} />
    <input type="hidden" {...methods.register("obligacionesPostObra")} />
    <input type="hidden" {...methods.register("escombreraMunicipal")} />
    <input type="hidden" {...methods.register("direccionEntidad")} />
      </form>
    </FormProvider>
  );
}


