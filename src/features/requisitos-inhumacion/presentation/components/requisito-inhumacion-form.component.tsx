"use client";

import { useState } from "react";
import RHFCementerySelect from "@/shared/components/form/rhf/rhf-cementery-select";
import { RequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useRequisitoInhumacionForm } from "../hooks/use-requisito-inhumacion-form";
import { FormProvider } from "react-hook-form";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";
import RHFAutocompletePerson from "@/shared/components/form/rhf/rhf-autocomplete-person";
import RHFTextarea from "@/shared/components/form/rhf/rhf-text-area";
import RHFCheckbox from "@/shared/components/form/rhf/rhf-chechbox";
import RHFDatePickerCalendar from "@/shared/components/form/rhf/rhf-datepicker-calendar";
import RHFAutocompleteHuecoNicho from "@/shared/components/form/rhf/rhf-autocomplete-hueco-nicho";
import { DocumentUploadCard } from "./document-upload-card.component";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { useEffect } from "react";
import { PropietarioNichoRepositoryImpl } from "@/features/propietarios-nichos/infrastructure/repositories/propietario-nicho.repository.impl";
import { HuecoRepositoryImpl } from "@/features/huecos/infrastructure/repositories/hueco.repository.impl";

interface RequisitoInhumacionFormProps {
  requistoInhumacion?: RequisitoInhumacionEntity;
}

const metodoSolicitudOptions = [
  { value: "Escrita", label: "Escrita" },
  // { value: "Verbal", label: "Verbal" },
];

const steps = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos del cementerio y solicitud",
    color: "bg-blue-500",
    requiredFields: [
      "idCementerio",
      "pantoneroACargo",
      "metodoSolicitud",
      "idHuecoNicho",
      "nombreAdministradorNicho",
      "idSolicitante",
      "idFallecido",
    ],
    optionalFields: ["observacionSolicitante"],
  },
  {
    id: 2,
    title: "Programación",
    description: "Fecha y hora de la inhumación",
    color: "bg-purple-500",
    requiredFields: ["fechaInhumacion", "horaInhumacion"],
    optionalFields: [],
  },
  {
    id: 3,
    title: "Documentos",
    description: "Requisitos y documentación",
    color: "bg-red-500",
    requiredFields: [],
    optionalFields: [
      "copiaCertificadoDefuncion",
      "informeEstadisticoINEC",
      "copiaCedula",
      "pagoTasaInhumacion",
      "copiaTituloPropiedadNicho",
      "oficioDeSolicitud",
      "observacionCertificadoDefuncion",
      "observacionInformeEstadisticoINEC",
      "observacionCopiaCedula",
      "observacionPagoTasaInhumacion",
      "observacionCopiaTituloPropiedadNicho",
      "observacionOficioSolicitud",
      "autorizacionDeMovilizacionDelCadaver",
      "observacionAutorizacionMovilizacion",
    ],
  },
];

const validationMessages: { [key: string]: string } = {
  idCementerio: "Por favor selecciona un cementerio",
  pantoneroACargo: "El nombre del panteonero a cargo es requerido",
  metodoSolicitud: "Por favor selecciona el método de solicitud",
  idHuecoNicho: "Por favor selecciona un hueco o nicho",
  nombreAdministradorNicho:
    "El nombre del administrador del nicho es requerido",
  idSolicitante: "Por favor selecciona un solicitante",
  idFallecido: "Por favor selecciona la persona fallecida",
  fechaInhumacion: "La fecha de inhumación es requerida",
  horaInhumacion: "La hora de inhumación es requerida",
};

export function RequisitoInhumacionForm({
  requistoInhumacion,
}: RequisitoInhumacionFormProps) {
  const { methods, onSubmit, isPending } =
    useRequisitoInhumacionForm(requistoInhumacion);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [expandedObservations, setExpandedObservations] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleObservation = (field: string) => {
    setExpandedObservations((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateStep = async (requiredFields: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await methods.trigger(requiredFields as any);

    if (!result) {
      const errors = methods.formState.errors;
      requiredFields.forEach((field) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((errors as any)[field] && validationMessages[field]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          methods.setError(field as any, {
            type: "manual",
            message: validationMessages[field],
          });
        }
      });
    }

    return result;
  };

  const handleNext = async () => {
    const currentStepData = steps.find((step) => step.id === currentStep);
    if (currentStepData) {
      const isValid = await validateStep(currentStepData.requiredFields);
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = async (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
      return;
    }

    for (let i = 1; i < stepNumber; i++) {
      const stepData = steps.find((step) => step.id === i);
      if (stepData) {
        const isValid = await validateStep(stepData.requiredFields);
        if (!isValid) {
          return;
        }
      }
    }
    setCurrentStep(stepNumber);
  };

  const handleFormSubmit = async () => {
    // Validar todos los pasos antes de enviar
    for (let i = 1; i <= steps.length; i++) {
      const stepData = steps.find((step) => step.id === i);
      if (stepData) {
        const isValid = await validateStep(stepData.requiredFields);
        if (!isValid) {
          setCurrentStep(i);
          return;
        }
      }
    }
    
    // Si todas las validaciones pasan, obtener los datos y enviar
    const formData = methods.getValues();
    onSubmit(formData, selectedDocument || undefined);
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  

  // Watch solicitante selection and, if a propietario/nicho exists for that person,
  // automatically set `idHuecoNicho` and `nombreAdministradorNicho` in the form.
  const solicitanteId = methods.watch("idSolicitante");
  useEffect(() => {
    let cancelled = false;
    if (!solicitanteId) return;

    (async () => {
      try {
        // First, resolve the person's cedula because backend endpoint expects cedula (por-persona/:cedula)
        const http = AxiosClient.getInstance();
        const personaResp = await http.get<any>(API_ROUTES.PERSONS.GET_BY_ID(solicitanteId));
        const cedula: string | undefined = personaResp?.data?.data?.cedula;
        if (!cedula) return;

        // Use the cedula-based endpoint which exists on the backend
        const propietarios = await PropietarioNichoRepositoryImpl.getInstance().findByPersonaCedula(cedula);
        if (!propietarios || propietarios.length === 0) return;

        const activo = propietarios.find((p) => p.activo) || propietarios[0];
        const ownerName = activo?.idPersona
          ? [activo.idPersona.nombres || "", activo.idPersona.apellidos || ""].filter(Boolean).join(" ")
          : "";

        // set owner name always when found
        try {
          methods.setValue("nombreAdministradorNicho", ownerName, { shouldValidate: true, shouldDirty: true });
        } catch (e) {
          // ignore if field missing
        }

        const idNicho = activo?.idNicho?.idNicho || undefined;
        if (!idNicho) return;

        const huecos = await HuecoRepositoryImpl.getInstance().findByNicho(idNicho);
        if (cancelled) return;
        if (Array.isArray(huecos) && huecos.length > 0) {
          // Only auto-select a hueco if there is one explicitly marked as 'Disponible'.
          // Do NOT fall back to selecting the first (which might be ocupado/ocupado).
          const disponible = huecos.find((h) => String(h.estado || "").toLowerCase() === "disponible");
          if (disponible && disponible.idDetalleHueco) {
            methods.setValue("idHuecoNicho", disponible.idDetalleHueco, { shouldValidate: true, shouldDirty: true });
          } else {
            // No disponible found: do not auto-assign any hueco to avoid selecting an occupied one.
            // Leave the field empty so the user must pick a valid available hueco manually.
          }
        }
      } catch (err) {
        console.warn("Error resolviendo hueco desde solicitante:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [solicitanteId]);

  if (!currentStepData) {
    return <div>Error: Paso no encontrado</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg mb-6 min-h-[160px] flex flex-col justify-between">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Registro de Requisitos de Inhumación
          </h2>
          <p className="text-gray-600 mt-1">
            Paso {currentStep} de {steps.length}: {currentStepData?.description}
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-center w-full">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center w-auto">
                <div className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-200
                      ${
                        currentStep === step.id
                          ? `${step.color} text-white shadow-lg`
                          : currentStep > step.id
                          ? "bg-gray-400 text-white cursor-pointer hover:bg-gray-500"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                    disabled={currentStep < step.id}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </button>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep === step.id
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-gray-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()} className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Información General
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RHFInput
                    name="codigoInhumacion"
                    label="Código de Inhumación *"
                    placeholder="Código de inhumación"
                  />
                  <RHFCementerySelect
                    name="idCementerio"
                    label="Cementerio *"
                    placeholder="Selecciona un cementerio"
                  />
                  <RHFInput
                    name="pantoneroACargo"
                    label="Panteonero a Cargo *"
                    placeholder="Nombre del panteonero a cargo"
                  />
                  <RHFSelect
                    name="metodoSolicitud"
                    label="Método de Solicitud *"
                    options={metodoSolicitudOptions}
                    placeholder="Selecciona el método de solicitud"
                  />
                  {/* <RHFHuecoNichoSelect
                    name="idHuecoNicho"
                    label="Hueco/Nicho *"
                    placeholder="Selecciona un hueco o nicho"
                  /> */}

                  {/* Reordered: Solicitante (left) and Hueco/Nicho (right). Administrador del Nicho hidden visually */}
                  <RHFAutocompletePerson
                    name="idSolicitante"
                    label="Solicitante *"
                    placeholder="Selecciona un solicitante"
                    vivos={true}
                  />

                  <RHFAutocompleteHuecoNicho
                    name="idHuecoNicho"
                    label="Hueco/Nicho *"
                    placeholder="Selecciona un hueco o nicho"
                    isAvailable={true}
                    ownerPersonId={solicitanteId}
                  />

                  {/* Keep nombreAdministradorNicho value but hide the visible input. Register as hidden so submission and mappers keep working */}
                  <input
                    type="hidden"
                    {...methods.register("nombreAdministradorNicho")}
                  />
                  <RHFAutocompletePerson
                    name="idFallecido"
                    label="Fallecido *"
                    placeholder="Ingrese a la persona fallecida"
                    vivos={false}
                    onlyNotInhumed={true}
                  />
                  <div className="col-span-2">
                    <RHFTextarea
                      name="observacionSolicitante"
                      label="Observación del Solicitante (Opcional)"
                      placeholder="Observaciones del solicitante"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2 ahora es 'Programación' después de ocultar Personas Involucradas */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Programación de Inhumación
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  <RHFDatePickerCalendar
                  name="fechaInhumacion"
                    label="Fecha de Inhumación *" 
                  />

                  <RHFInput
                    name="horaInhumacion"
                    label="Hora de Inhumación *"
                    type="time"
                    placeholder="HH:MM"
                  />
                </div>
              </div>
            )}

            
            {/* Paso 3: Documentos */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Documentos y Requisitos
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Copia Certificado de Defunción */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="copiaCertificadoDefuncion"
                      label="Copia de Certificado de Defunción"
                      description="Documento requerido para el proceso"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation("observacionCertificadoDefuncion")
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations[
                            "observacionCertificadoDefuncion"
                          ]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations[
                        "observacionCertificadoDefuncion"
                      ] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionCertificadoDefuncion"
                            label=""
                            placeholder="Observaciones sobre el certificado de defunción..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informe Estadístico INEC */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="informeEstadisticoINEC"
                      label="Informe Estadístico INEC"
                      description="Reporte estadístico del Instituto Nacional"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation("observacionInformeEstadisticoINEC")
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations[
                            "observacionInformeEstadisticoINEC"
                          ]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations[
                        "observacionInformeEstadisticoINEC"
                      ] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionInformeEstadisticoINEC"
                            label=""
                            placeholder="Observaciones sobre el informe estadístico INEC..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copia de Cédula */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="copiaCedula"
                      label="Copia de Cédula"
                      description="Identificación del solicitante"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation("observacionCopiaCedula")
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations["observacionCopiaCedula"]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations["observacionCopiaCedula"] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionCopiaCedula"
                            label=""
                            placeholder="Observaciones sobre la copia de cédula..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pago Tasa de Inhumación */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="pagoTasaInhumacion"
                      label="Pago de Tasa de Inhumación"
                      description="Comprobante de pago de tasas"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation("observacionPagoTasaInhumacion")
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations["observacionPagoTasaInhumacion"]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations[
                        "observacionPagoTasaInhumacion"
                      ] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionPagoTasaInhumacion"
                            label=""
                            placeholder="Observaciones sobre el pago de tasa de inhumación..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copia Título de Propiedad */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="copiaTituloPropiedadNicho"
                      label="Copia Título de Propiedad del Nicho"
                      description="Documento de propiedad del espacio"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation(
                            "observacionCopiaTituloPropiedadNicho"
                          )
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations[
                            "observacionCopiaTituloPropiedadNicho"
                          ]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations[
                        "observacionCopiaTituloPropiedadNicho"
                      ] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionCopiaTituloPropiedadNicho"
                            label=""
                            placeholder="Observaciones sobre el título de propiedad del nicho..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Oficio de Solicitud */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <RHFCheckbox
                      name="oficioDeSolicitud"
                      label="Oficio de Solicitud"
                      description="Documento oficial de solicitud"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation("observacionOficioSolicitud")
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations["observacionOficioSolicitud"]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations["observacionOficioSolicitud"] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionOficioSolicitud"
                            label=""
                            placeholder="Observaciones sobre el oficio de solicitud..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Autorización de Movilización (Opcional) */}
                  <div className="border rounded-lg p-4 bg-blue-50 md:col-span-2">
                    <RHFCheckbox
                      name="autorizacionDeMovilizacionDelCadaver"
                      label="Autorización de Movilización del Cadáver"
                      description="Este documento es opcional - puede omitirse si no aplica"
                    />
                    <div className="mt-3 ml-6">
                      <button
                        type="button"
                        onClick={() =>
                          toggleObservation(
                            "observacionAutorizacionMovilizacion"
                          )
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-1">
                          {expandedObservations[
                            "observacionAutorizacionMovilizacion"
                          ]
                            ? "▼"
                            : "▶"}
                        </span>
                        Agregar observación
                      </button>
                      {expandedObservations[
                        "observacionAutorizacionMovilizacion"
                      ] && (
                        <div className="mt-2 animate-fade-in">
                          <RHFTextarea
                            name="observacionAutorizacionMovilizacion"
                            label=""
                            placeholder="Observaciones sobre la autorización de movilización..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Carga de documento (compacto) */}
                <div className="mt-2">
                  <DocumentUploadCard 
                    onFileSelect={setSelectedDocument}
                    selectedFile={selectedDocument}
                  />
                </div>

                {/* Resumen y botón de guardado en el paso de documentos */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Resumen de la Solicitud
                  </h4>
                  <p className="text-blue-700 text-sm mb-4">
                    Ha completado todos los pasos necesarios. Revise la información y haga clic en &quot;Guardar&quot; para finalizar el registro.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={isPending}
                  >
                    {isPending ? "Guardando..." : "✓ Guardar Requisitos"}
                  </button>
                </div>
              </div>
            )}

            {/* Botones de Navegación - Solo mostrar cuando no esté en el último paso */}
            {currentStep < steps.length && (
              <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  ← Anterior
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Botón Anterior para el último paso */}
            {currentStep === steps.length && (
              <div className="flex justify-start pt-8 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  ← Anterior
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}