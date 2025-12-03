"use client";

import { useMemo } from "react";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MejoraForm from "../components/mejora-form.component";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useFindRequisitoInhumacionByIdQuery } from "@/features/requisitos-inhumacion/presentation/hooks/use-requisito-inhumacion-queries";
import type { RequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import type { CreateMejoraDTO } from "../../domain/schemas/mejora.schema";
import { useFindNichoByIdQuery } from "@/features/nichos/presentation/hooks/use-nicho-queries";
import { useFindPersonByIdQuery } from "@/features/person/presentation/hooks/use-person-queries";
import type { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import type { PersonEntity } from "@/features/person/domain/entities/person.entity";

const DEFAULT_ENTIDAD = "GADM Santiago de Pillaro";

const truncate = (value: string | null | undefined, max: number): string | undefined => {
  if (value === null || value === undefined) return undefined;
  return value.length > max ? value.slice(0, max) : value;
};

const buildFullName = (person?: { nombres?: string | null; apellidos?: string | null }) => {
  if (!person) return undefined;
  const parts = [person.nombres, person.apellidos].filter(Boolean) as string[];
  return parts.length ? parts.join(" ") : undefined;
};

const buildHuecoDescripcion = (requisito: RequisitoInhumacionEntity) => {
  const hueco = requisito.idHuecoNicho;
  const nicho = hueco?.idNicho;
  const fragments: string[] = [];
  if (requisito.idCementerio?.nombre) fragments.push(requisito.idCementerio.nombre);
  if (nicho?.fila) fragments.push(`Fila ${nicho.fila}`);
  if (nicho?.columna) fragments.push(`Columna ${nicho.columna}`);
  if (hueco?.numHueco) fragments.push(`Hueco ${hueco.numHueco}`);
  return fragments.length ? fragments.join(" • ") : undefined;
};

const buildCodigoSitio = (requisito: RequisitoInhumacionEntity) => {
  const hueco = requisito.idHuecoNicho;
  const nicho = hueco?.idNicho;
  const segments: string[] = [];
  if (nicho?.fila) segments.push(`FILA-${nicho.fila}`);
  if (nicho?.columna) segments.push(`NICHO-${nicho.columna}`);
  if (hueco?.numHueco) segments.push(`HUECO-${hueco.numHueco}`);
  return segments.length ? segments.join("-") : undefined;
};

const resolvePropietarioActivo = (requisito: RequisitoInhumacionEntity) => {
  const propietarios = requisito.idHuecoNicho?.idNicho?.propietarios;
  if (!propietarios || propietarios.length === 0) return undefined;
  return propietarios.find((prop) => prop.activo) ?? propietarios[0];
};

const requisitionCondition = (requisito: RequisitoInhumacionEntity, ubicacion?: string) => {
  const cementerio = requisito.idCementerio?.nombre;
  const base = "Cumple disposiciones y horarios de la administración";
  if (cementerio && ubicacion) return `${base} del cementerio ${cementerio}, para la ubicación ${ubicacion}.`;
  if (cementerio) return `${base} del cementerio ${cementerio}.`;
  return `${base}.`;
};

const requisitionAuthorizationText = (
  solicitante?: { nombres?: string | null; apellidos?: string | null },
  ubicacion?: string,
) => {
  const solicitanteNombre = buildFullName(solicitante);
  const base = solicitanteNombre
    ? `Se autoriza a ${solicitanteNombre} a ejecutar la mejora`
    : "Se autoriza la mejora solicitada";
  if (ubicacion) {
    return `${base} en ${ubicacion}.`;
  }
  return `${base} en el nicho autorizado.`;
};

const requisitionNormativa = (requisito: RequisitoInhumacionEntity) => {
  const cementerio = requisito.idCementerio?.nombre;
  const base = "Ordenanza Municipal vigente y normativa funeraria aplicable";
  return cementerio ? `${base} del ${cementerio}.` : `${base}.`;
};

const requisitionObligaciones = () => {
  return "El solicitante se compromete a respetar los nichos colindantes, finalizar los trabajos en el plazo autorizado y entregar el área limpia, retirando escombros y materiales sobrantes.";
};

const mapRequisitoToMejoraDefaults = (requisito: RequisitoInhumacionEntity): Partial<CreateMejoraDTO> => {
  const solicitante = requisito.idSolicitante;
  const fallecido = requisito.idFallecido;
  const propietario = resolvePropietarioActivo(requisito);
  const propietarioPersona = propietario?.idPersona;
  const propietarioNombre = buildFullName(propietarioPersona);
  const ubicacion = buildHuecoDescripcion(requisito);
  const codigoSitio = buildCodigoSitio(requisito);
  const direccionEntidad = requisito.idCementerio?.direccion ?? undefined;
  const metodoSolicitud = requisito.metodoSolicitud?.toLowerCase() === "verbal" ? "verbal" : "escrito";

  const condicion = requisitionCondition(requisito, ubicacion);
  const autorizacionTexto = requisitionAuthorizationText(solicitante, ubicacion);
  const normativaAplicable = requisitionNormativa(requisito);
  const obligacionesPostObra = requisitionObligaciones();
  const escombreraMunicipal = direccionEntidad
    ? `Depositar los residuos y escombros en la escombrera autorizada en ${direccionEntidad}.`
    : "Depositar los residuos y escombros en la escombrera autorizada por la administración.";

  const result: Partial<CreateMejoraDTO> = {
    idCementerio: requisito.idCementerio?.idCementerio,
    id_nicho: requisito.idHuecoNicho?.idNicho?.idNicho,
    panteoneroACargo: truncate(requisito.pantoneroACargo, 150),
    metodoSolicitud,
    id_solicitante: solicitante?.id_persona,
    solicitanteDireccion: truncate(solicitante?.direccion, 200),
    solicitanteTelefono: truncate(solicitante?.telefono, 30),
    solicitanteCorreo: truncate(solicitante?.correo, 100),
    observacionSolicitante: truncate(requisito.observacionSolicitante ?? "Sin observaciones", 200),
    id_fallecido: fallecido?.id_persona ?? undefined,
    fechaFallecimiento: fallecido?.fecha_defuncion ?? undefined,
    propietarioNicho: truncate(propietarioNombre ?? requisito.nombreAdministradorNicho, 200),
    propietarioNombre: truncate(propietarioNombre, 200),
    propietarioFechaAdquisicion: propietario?.fechaAdquisicion ?? undefined,
  propietarioTipoTenencia: truncate(propietario?.tipo, 50),
    numeroNichos: requisito.idHuecoNicho?.idNicho?.numHuecos ?? undefined,
    lugarNicho: truncate(ubicacion, 100),
    codigoSitio: truncate(codigoSitio, 120),
    administradorNicho: truncate(requisito.nombreAdministradorNicho ?? propietarioNombre, 120),
    esPropio: propietario ? propietario.tipo === "Dueño" : undefined,
    observacionNicho: truncate(requisito.observacionCopiaTituloPropiedadNicho, 200),
    codigoAutorizacion: requisito.idRequsitoInhumacion,
    entidad: DEFAULT_ENTIDAD,
    condicion: truncate(condicion, 200),
    autorizacionTexto: truncate(autorizacionTexto, 200),
    normativaAplicable: truncate(normativaAplicable, 200),
    obligacionesPostObra: truncate(obligacionesPostObra, 200),
    escombreraMunicipal: truncate(escombreraMunicipal, 200),
    direccionEntidad: truncate(direccionEntidad, 200),
  };

  return result;
};

const mapNichoToMejoraDefaults = (nicho: NichoEntity, propietario?: PersonEntity): Partial<CreateMejoraDTO> => {
  const propietarioNombre = buildFullName(propietario);
  const ubicacion = buildNichoDescripcion(nicho);
  const codigoSitio = buildNichoCodigoSitio(nicho);
  const direccionEntidad = nicho.idCementerio?.direccion ?? undefined;
  
  const propietarioActivo = nicho.propietarios?.find((prop) => prop.activo);
  
  // Extraer información del fallecido si existe
  const fallecidoInfo = extractFallecidoFromNicho(nicho);

  const result: Partial<CreateMejoraDTO> = {
    idCementerio: nicho.idCementerio?.idCementerio,
    id_nicho: nicho.idNicho,
    metodoSolicitud: "escrito",
    id_solicitante: propietario?.id_persona,
    solicitanteDireccion: truncate(propietario?.direccion, 200),
    solicitanteTelefono: truncate(propietario?.telefono, 30),
    solicitanteCorreo: truncate(propietario?.correo, 100),
    // Información del fallecido (si existe)
    id_fallecido: fallecidoInfo?.idPersona,
    fechaFallecimiento: fallecidoInfo?.fechaDefuncion,
    // Información del propietario
    propietarioNicho: truncate(propietarioNombre, 200),
    propietarioNombre: truncate(propietarioNombre, 200),
    propietarioFechaAdquisicion: propietarioActivo?.fechaAdquisicion ?? undefined,
    propietarioTipoTenencia: truncate(propietarioActivo?.tipo, 50),
    numeroNichos: nicho.numHuecos ?? undefined,
    lugarNicho: truncate(ubicacion, 100),
    codigoSitio: truncate(codigoSitio, 120),
    administradorNicho: truncate(propietarioNombre, 120),
    esPropio: propietarioActivo ? propietarioActivo.tipo === "Dueño" : undefined,
    entidad: DEFAULT_ENTIDAD,
    direccionEntidad: truncate(direccionEntidad, 200),
  };

  return result;
};

const buildNichoDescripcion = (nicho: NichoEntity) => {
  const fragments: string[] = [];
  if (nicho.idCementerio?.nombre) fragments.push(nicho.idCementerio.nombre);
  if (nicho.fila) fragments.push(`Fila ${nicho.fila}`);
  if (nicho.columna) fragments.push(`Columna ${nicho.columna}`);
  return fragments.length ? fragments.join(" • ") : undefined;
};

const buildNichoCodigoSitio = (nicho: NichoEntity) => {
  const segments: string[] = [];
  if (nicho.fila) segments.push(`FILA-${nicho.fila}`);
  if (nicho.columna) segments.push(`NICHO-${nicho.columna}`);
  return segments.length ? segments.join("-") : undefined;
};

/**
 * Extrae el primer fallecido del nicho (desde huecos o inhumaciones)
 */
const extractFallecidoFromNicho = (nicho: NichoEntity): { idPersona?: string; fechaDefuncion?: string; fechaInhumacion?: string } | undefined => {
  // Buscar en huecos
  if (nicho.huecos && nicho.huecos.length > 0) {
    for (const hueco of nicho.huecos) {
      if (hueco.idFallecido) {
        return {
          idPersona: hueco.idFallecido.id_persona,
          fechaDefuncion: hueco.idFallecido.fecha_defuncion ?? undefined,
          fechaInhumacion: hueco.idFallecido.fecha_inhumacion ?? undefined,
        };
      }
    }
  }

  // Buscar en inhumaciones (el API devuelve id_fallecido como objeto)
  if (nicho.inhumaciones && nicho.inhumaciones.length > 0) {
    for (const inhumacion of nicho.inhumaciones) {
      // El API puede devolver id_fallecido como objeto con id_persona
      const fallecido = inhumacion.id_fallecido;
      if (fallecido && typeof fallecido === 'object') {
        return {
          idPersona: fallecido.id_persona,
          fechaDefuncion: fallecido.fecha_defuncion ?? undefined,
          fechaInhumacion: fallecido.fecha_inhumacion ?? inhumacion.fecha_inhumacion ?? undefined,
        };
      }
    }
  }

  return undefined;
};

export default function MejoraCreateView() {
  const searchParams = useSearchParams();
  const requisitoIdParam = searchParams.get("requisito") ?? "";
  const nichoIdParam = searchParams.get("nicho") ?? "";
  const propietarioIdParam = searchParams.get("propietario") ?? "";
  const searchTermParam = searchParams.get("q") ?? "";
  
  const hasRequisitoParam = requisitoIdParam.length > 0;
  const hasNichoParam = nichoIdParam.length > 0;

  // Query para requisito (flujo existente)
  const { 
    data: requisitoData, 
    isLoading: isLoadingRequisito, 
    isError: isErrorRequisito, 
    error: errorRequisito 
  } = useFindRequisitoInhumacionByIdQuery(requisitoIdParam);

  // Query para nicho (flujo nuevo)
  const { 
    data: nichoData, 
    isLoading: isLoadingNicho 
  } = useFindNichoByIdQuery(nichoIdParam);

  // Query para propietario (flujo nuevo)
  const { 
    data: propietarioData, 
    isLoading: isLoadingPropietario 
  } = useFindPersonByIdQuery(propietarioIdParam);

  const defaultValues = useMemo(() => {
    // Prioridad 1: Datos desde requisito
    if (requisitoData && hasRequisitoParam) {
      return mapRequisitoToMejoraDefaults(requisitoData);
    }

    // Prioridad 2: Datos desde nicho + propietario
    if (nichoData && hasNichoParam) {
      return mapNichoToMejoraDefaults(nichoData, propietarioData);
    }

    return undefined;
  }, [requisitoData, hasRequisitoParam, nichoData, hasNichoParam, propietarioData]);

  const isPrefillLoading = 
    (hasRequisitoParam && isLoadingRequisito) ||
    (hasNichoParam && (isLoadingNicho || isLoadingPropietario));

  const hasError = hasRequisitoParam && isErrorRequisito;

  return (
    <ContainerApp title="Nueva Solicitud de Mejoras">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href={searchTermParam ? `/mejoras?q=${encodeURIComponent(searchTermParam)}` : "/mejoras"}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardContent className="space-y-6">
            {hasError ? (
              <Alert variant="destructive">
                <AlertTitle>Error al precargar datos</AlertTitle>
                <AlertDescription>
                  {errorRequisito instanceof Error ? errorRequisito.message : "No se pudo cargar la información del requisito seleccionado. Puedes continuar completando el formulario manualmente."}
                </AlertDescription>
              </Alert>
            ) : null}
            <MejoraForm
              defaultValues={defaultValues}
              isPrefillLoading={isPrefillLoading}
              searchTerm={searchTermParam}
            />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}


