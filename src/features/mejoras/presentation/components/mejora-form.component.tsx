"use client";

import { FormProvider } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

type MejoraFormProps = {
  defaultValues?: Partial<CreateMejoraDTO>;
  isPrefillLoading?: boolean;
  requisitoResumen?: {
    solicitante?: string;
    fallecido?: string;
    cementerio?: string;
    nicho?: string;
  };
};

const metodoSolicitudOptions = [
  { value: "escrito", label: "Escrita" },
  { value: "verbal", label: "Verbal (solo emergencia)" },
];

const tipoServicioOptions = [
  { value: "ARREGLOS", label: "Arreglos" },
  { value: "CONSTRUCCION", label: "Construcción" },
  { value: "LAPIDA", label: "Lápida" },
];

const baseDefaultValues: Partial<CreateMejoraDTO> = {
  metodoSolicitud: "escrito",
  entidad: "GADM Santiago de Pillaro",
  observacionSolicitante: "Sin observaciones",
};

export default function MejoraForm({ defaultValues, isPrefillLoading = false, requisitoResumen }: MejoraFormProps) {
  const router = useRouter();
  const methods = useForm<CreateMejoraDTO>({
    resolver: zodResolver(CreateMejoraSchema),
    defaultValues: baseDefaultValues,
  });
  const { mutate: create, isPending } = useCreateMejoraMutation();
  const { mutate: uploadFiles } = useUploadMejoraFilesMutation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("general");

  const sections = useMemo(
    () => [
      { value: "general", label: "General", description: "Datos institucionales y de solicitud" },
      { value: "solicitante", label: "Solicitante", description: "Información de contacto del solicitante" },
      { value: "fallecido", label: "Fallecido", description: "Referencias de la persona fallecida" },
      { value: "nicho", label: "Nicho", description: "Detalle del nicho o sitio autorizado" },
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
    setActiveTab("general");
    if (defaultValues) {
      methods.reset({ ...baseDefaultValues, ...defaultValues });
      setSelectedFiles([]);
    } else {
      methods.reset(baseDefaultValues);
    }
  }, [defaultValues, methods]);

  const handleSubmit = (data: CreateMejoraDTO) => {
    create(data, {
      onSuccess: (created) => {
        if (selectedFiles.length > 0) {
          uploadFiles(
            { id: created.idMejora, files: selectedFiles },
            {
              onSettled: () => {
                router.push("/mejoras");
              },
            },
          );
        } else {
          router.push("/mejoras");
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8">
        {requisitoResumen && (
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <p className="font-medium">Información precargada del requisito</p>
            <ul className="mt-2 space-y-1">
              {requisitoResumen.cementerio && <li><span className="font-semibold">Cementerio:</span> {requisitoResumen.cementerio}</li>}
              {requisitoResumen.nicho && <li><span className="font-semibold">Nicho:</span> {requisitoResumen.nicho}</li>}
              {requisitoResumen.solicitante && <li><span className="font-semibold">Solicitante:</span> {requisitoResumen.solicitante}</li>}
              {requisitoResumen.fallecido && <li><span className="font-semibold">Fallecido:</span> {requisitoResumen.fallecido}</li>}
            </ul>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Navega por las secciones para completar la solicitud.</p>
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

          <TabsContent value="general" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Información general</h3>
              <p className="text-sm text-muted-foreground">Selecciona el cementerio y define los datos principales de la solicitud.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFCementerySelect name="idCementerio" label="Cementerio *" placeholder="Selecciona un cementerio" disabled={isPrefillLoading} />
              <RHFInput
                name="panteoneroACargo"
                label="Panteonero a cargo *"
                placeholder="Nombre del panteonero"
                disabled={isPrefillLoading}
                maxLength={150}
              />
              <RHFSelect name="metodoSolicitud" label="Método de solicitud *" options={metodoSolicitudOptions} placeholder="Selecciona" disabled={isPrefillLoading} />
              <RHFInput name="entidad" label="Entidad emisora" placeholder="Entidad municipal" readOnly maxLength={150} />
            </div>
          </TabsContent>

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
                maxLength={30}
              />
              <RHFInput
                name="solicitanteDireccion"
                label="Dirección"
                placeholder="Dirección"
                disabled={isPrefillLoading}
                maxLength={200}
              />
              <RHFInput
                name="solicitanteCorreo"
                label="Correo electrónico"
                placeholder="correo@dominio.com"
                disabled={isPrefillLoading}
                maxLength={100}
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

          <TabsContent value="fallecido" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Datos de la persona fallecida</h3>
              <p className="text-sm text-muted-foreground">Asocia la mejora con la persona fallecida correspondiente.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFAutocompletePerson name="id_fallecido" label="Fallecido" placeholder="Selecciona fallecido" vivos={false} disabled={isPrefillLoading} />
              <RHFDatePickerCalendar name="fechaFallecimiento" label="Fecha de fallecimiento" disabled={isPrefillLoading} />
            </div>
          </TabsContent>

          <TabsContent value="nicho" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Detalle del nicho o sitio</h3>
              <p className="text-sm text-muted-foreground">Describe la ubicación física y los responsables del nicho.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFInput name="propietarioNicho" label="Nombre del propietario" disabled={isPrefillLoading} maxLength={200} />
              <RHFInput name="numeroNichos" label="Número de nichos" type="number" disabled={isPrefillLoading} />
              <RHFInput
                name="lugarNicho"
                label="Lugar del nicho"
                placeholder="Cementerio Central"
                disabled={isPrefillLoading}
                maxLength={100}
              />
              <RHFInput
                name="codigoSitio"
                label="Lugar del sitio / código"
                disabled={isPrefillLoading}
                maxLength={120}
              />
              <RHFInput
                name="administradorNicho"
                label="Nombre del administrador"
                disabled={isPrefillLoading}
                maxLength={120}
              />
              <RHFSelect
                name="esPropio"
                label="Propiedad"
                options={[{ value: "true", label: "Propio" }, { value: "false", label: "Arrendado" }]}
                placeholder="Selecciona"
                disabled={isPrefillLoading}
              />
            </div>
            <RHFTextarea name="observacionNicho" label="Observación" rows={3} maxLength={200} />
          </TabsContent>

          <TabsContent value="accion" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Plan de intervención</h3>
              <p className="text-sm text-muted-foreground">Define el servicio, fechas y horarios autorizados.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RHFSelect name="tipoServicio" label="Tipo de servicio a efectuar *" options={tipoServicioOptions} placeholder="Selecciona" disabled={isPrefillLoading} />
              <RHFDatePickerCalendar name="fechaInicio" label="Fecha de inicio" disabled={isPrefillLoading} />
              <RHFDatePickerCalendar name="fechaFin" label="Fecha de fin" disabled={isPrefillLoading} />
              <RHFInput
                name="horarioTrabajo"
                label="Horario de trabajo"
                placeholder="Ej: 09h00 a 17h00"
                disabled={isPrefillLoading}
                maxLength={120}
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


