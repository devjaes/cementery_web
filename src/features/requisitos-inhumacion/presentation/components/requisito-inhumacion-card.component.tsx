import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { RequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useState } from "react";
import { FormProvider } from "react-hook-form"; // Importar FormProvider
import RHFCheckbox from "@/shared/components/form/rhf/rhf-chechbox"; // Ajusta la ruta según tu estructura
import RHFTextarea from "@/shared/components/form/rhf/rhf-text-area"; // Importar el componente textarea
import { useRequisitoInhumacionForm } from "../hooks/use-requisito-inhumacion-form"; // Ajusta la ruta

interface RequisitoInhumacionCardProps {
  requisitoInhumacion: RequisitoInhumacionEntity;
}

export function RequisitoInhumacionCard({
  requisitoInhumacion,
}: RequisitoInhumacionCardProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    documentos: true, 
  });

  const [expandedObservations, setExpandedObservations] = useState<{
    [key: string]: boolean;
  }>({});

  const { methods, onSubmit, isPending } =
    useRequisitoInhumacionForm(requisitoInhumacion);

   
  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleObservation = (observationKey: string) => {
    setExpandedObservations((prev) => ({
      ...prev,
      [observationKey]: !prev[observationKey],
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVO":
      case "DISPONIBLE":
      case "LIBRE":
        return "bg-green-100 text-green-800 border-green-300";
      case "INACTIVO":
      case "OCUPADO":
      case "NO_DISPONIBLE":
        return "bg-red-100 text-red-800 border-red-300";
      case "MANTENIMIENTO":
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const SectionHeader = ({
    title,
    sectionKey,
    bgColor = "bg-gray-50",
    textColor = "text-gray-800",
    borderColor = "border-gray-400",
  }: {
    title: string;
    sectionKey: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
  }) => (
    <div
      className={`${bgColor} ${borderColor} border-l-4 p-3 cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex justify-between items-center">
        <h3 className={`font-semibold text-lg ${textColor}`}>{title}</h3>
        <span
          className={`transform transition-transform ${
            expandedSections[sectionKey] ? "rotate-180" : ""
          } ${textColor}`}
        >
          ▼
        </span>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        
        <Card className="p-2 md:p-6 mb-6 border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-black">
              Editar Requisitos Documentales - Inhumación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mostrar errores de validación si existen */}
            {Object.keys(methods.formState.errors).length > 0 && (
              <div className="text-red-600 mb-2">
                {Object.entries(methods.formState.errors).map(([key, error]) => (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <div key={key}>{(error as any).message}</div>
                ))}
              </div>
            )}
            {/* Datos Básicos - Solo información */}
            <div>
              <SectionHeader
                title="Datos Básicos"
                sectionKey="basicos"
                bgColor="bg-gray-50"
                textColor="text-black"
                borderColor="border-gray-500"
              />
              {expandedSections.basicos && (
                <div className="p-4 bg-white border border-gray-200 border-t-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <p>
                      <span className="font-medium text-black">ID:</span>{" "}
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                        {requisitoInhumacion.idRequsitoInhumacion}
                      </span>
                    </p> */}
                    <p>
                      <span className="font-medium text-black">
                        Pantonero a Cargo:
                      </span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.pantoneroACargo}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Método de Solicitud:
                      </span>{" "}
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                        {requisitoInhumacion.metodoSolicitud}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Fecha de Inhumación:
                      </span>{" "}
                      <span className="text-gray-700">
                        {formatDate(requisitoInhumacion.fechaInhumacion)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Hora de Inhumación:
                      </span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.horaInhumacion || "No especificado"}
                      </span>
                    </p>
                  </div>
                  {requisitoInhumacion.observacionSolicitante && (
                    <div className="mt-4">
                      <p className="font-medium mb-2 text-black">
                        Observaciones:
                      </p>
                      <p className="text-sm bg-gray-50 text-gray-700 p-3 rounded border">
                        {requisitoInhumacion.observacionSolicitante}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Información del Cementerio */}
            <div>
              <SectionHeader
                title="Información del Cementerio"
                sectionKey="cementerio"
                bgColor="bg-gray-100"
                textColor="text-black"
                borderColor="border-gray-600"
              />
              {expandedSections.cementerio && (
                <div className="p-4 bg-white border border-gray-200 border-t-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-medium text-black">Nombre:</span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idCementerio?.nombre ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Estado:</span>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          requisitoInhumacion.idCementerio?.estado
                        )}`}
                      >
                        {requisitoInhumacion.idCementerio?.estado ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Dirección:</span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idCementerio?.direccion ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Responsable:</span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idCementerio?.responsable ||
                          "No especificado"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Datos del Solicitante */}
            <div>
              <SectionHeader
                title="Datos del Solicitante"
                sectionKey="solicitante"
                bgColor="bg-gray-50"
                textColor="text-black"
                borderColor="border-gray-500"
              />
              {expandedSections.solicitante && (
                <div className="p-4 bg-white border border-gray-200 border-t-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-medium text-black">
                        Nombre Completo:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        {`${requisitoInhumacion.idSolicitante?.nombres || ""} ${
                          requisitoInhumacion.idSolicitante?.apellidos || ""
                        }`.trim() || "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Cédula:</span>{" "}
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                        {requisitoInhumacion.idSolicitante?.cedula ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Teléfono:</span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idSolicitante?.telefono ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Correo:</span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idSolicitante?.correo ||
                          "No especificado"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Datos del Fallecido */}
            <div>
              <SectionHeader
                title="Datos del Fallecido"
                sectionKey="fallecido"
                bgColor="bg-gray-100"
                textColor="text-black"
                borderColor="border-gray-600"
              />
              {expandedSections.fallecido && (
                <div className="p-4 bg-white border border-gray-200 border-t-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-medium text-black">
                        Nombre Completo:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        {`${requisitoInhumacion.idFallecido?.nombres || ""} ${
                          requisitoInhumacion.idFallecido?.apellidos || ""
                        }`.trim() || "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">Cédula:</span>{" "}
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                        {requisitoInhumacion.idFallecido?.cedula ||
                          "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Fecha de Defunción:
                      </span>{" "}
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                        {requisitoInhumacion.idFallecido?.fecha_defuncion
                          ? formatDate(
                              requisitoInhumacion.idFallecido.fecha_defuncion
                            )
                          : "No especificado"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Lugar de Defunción:
                      </span>{" "}
                      <span className="text-gray-700">
                        {requisitoInhumacion.idFallecido?.lugar_defuncion ||
                          "No especificado"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ubicación del Sepulcro */}
            <div>
              <SectionHeader
                title="Ubicación del Sepulcro"
                sectionKey="ubicacion"
                bgColor="bg-gray-50"
                textColor="text-black"
                borderColor="border-gray-500"
              />
              {expandedSections.ubicacion && (
                <div className="p-4 bg-white border border-gray-200 border-t-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-black border-b border-gray-200 pb-1">
                        Datos del Hueco
                      </h4>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium text-black">
                            Número de Hueco:
                          </span>{" "}
                          <span className="font-bold text-lg text-black">
                            {requisitoInhumacion.idHuecoNicho?.numHueco ||
                              "No especificado"}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-black">Estado:</span>{" "}
                          <span
                            className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                              requisitoInhumacion.idHuecoNicho?.estado
                            )}`}
                          >
                            {requisitoInhumacion.idHuecoNicho?.estado ||
                              "No especificado"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {requisitoInhumacion.idHuecoNicho?.idNicho && (
                      <div>
                        <h4 className="font-medium mb-3 text-black border-b border-gray-200 pb-1">
                          Datos del Nicho
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium text-black">
                              Ubicación:
                            </span>{" "}
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                              Sector{" "}
                              {requisitoInhumacion.idHuecoNicho.idNicho.sector} -
                              Fila {requisitoInhumacion.idHuecoNicho.idNicho.fila}{" "}
                              - #{requisitoInhumacion.idHuecoNicho.idNicho.numero}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-black">Tipo:</span>{" "}
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                              {requisitoInhumacion.idHuecoNicho.idNicho.tipo}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Requisitos Documentales - FORMULARIO EDITABLE */}
            <div>
              <SectionHeader
                title="Requisitos Documentales (EDITABLE)"
                sectionKey="documentos"
                bgColor="bg-orange-50"
                textColor="text-black"
                borderColor="border-orange-400"
              />
              {expandedSections.documentos && (
                <div className="p-6 bg-white border border-gray-200 border-t-0">
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
                          className="mb-2"
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
                              {expandedObservations["observacionCertificadoDefuncion"]
                                ? "▼"
                                : "▶"}
                            </span>
                            Observación
                          </button>
                          {expandedObservations["observacionCertificadoDefuncion"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionCertificadoDefuncion"
                                label="Observación sobre el certificado de defunción"
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
                          className="mb-2"
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
                              {expandedObservations["observacionInformeEstadisticoINEC"]
                                ? "▼"
                                : "▶"}
                            </span>
                            Observación
                          </button>
                          {expandedObservations["observacionInformeEstadisticoINEC"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionInformeEstadisticoINEC"
                                label="Observación sobre el informe estadístico INEC"
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
                          className="mb-2"
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
                            Observación
                          </button>
                          {expandedObservations["observacionCopiaCedula"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionCopiaCedula"
                                label="Observación sobre la copia de cédula"
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
                          className="mb-2"
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
                            Observación
                          </button>
                          {expandedObservations["observacionPagoTasaInhumacion"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionPagoTasaInhumacion"
                                label="Observación sobre el pago de tasa de inhumación"
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
                          className="mb-2"
                        />
                        <div className="mt-3 ml-6">
                          <button
                            type="button"
                            onClick={() =>
                              toggleObservation("observacionCopiaTituloPropiedadNicho")
                            }
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <span className="mr-1">
                              {expandedObservations["observacionCopiaTituloPropiedadNicho"]
                                ? "▼"
                                : "▶"}
                            </span>
                            Observación
                          </button>
                          {expandedObservations["observacionCopiaTituloPropiedadNicho"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionCopiaTituloPropiedadNicho"
                                label="Observación sobre el título de propiedad del nicho"
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
                          className="mb-2"
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
                            Observación
                          </button>
                          {expandedObservations["observacionOficioSolicitud"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionOficioSolicitud"
                                label="Observación sobre el oficio de solicitud"
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
                          className="mb-2"
                        />
                        <div className="mt-3 ml-6">
                          <button
                            type="button"
                            onClick={() =>
                              toggleObservation("observacionAutorizacionMovilizacion")
                            }
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <span className="mr-1">
                              {expandedObservations["observacionAutorizacionMovilizacion"]
                                ? "▼"
                                : "▶"}
                            </span>
                            Observación
                          </button>
                          {expandedObservations["observacionAutorizacionMovilizacion"] && (
                            <div className="mt-2 animate-fade-in">
                              <RHFTextarea
                                name="observacionAutorizacionMovilizacion"
                                label="Observación sobre la autorización de movilización"
                                placeholder="Observaciones sobre la autorización de movilización..."
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 justify-center sm:justify-end">
                      <button
                        type="submit"
                        disabled={isPending}
                        className={`
                          px-6 py-2.5 rounded-lg font-medium text-white transition-colors min-w-[140px]
                          ${
                            isPending
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200"
                          }
                        `}
                      >
                        {isPending ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Actualizando...
                          </span>
                        ) : (
                          "Guardar"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}  
              </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}