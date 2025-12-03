import { CementeryEntity } from "@/features/cementery/domain/entities/cementery.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";

export interface MejoraEntity {
  idMejora: string;
  fechaSolicitud: string;
  codigoAutorizacion?: string;

  idCementerio: CementeryEntity;
  idNicho?: string;
  panteoneroACargo: string;
  metodoSolicitud: string; // escrito | verbal
  estado?: string;

  solicitante: PersonEntity;
  direccionSolicitante?: string;
  solicitanteTelefono?: string;
  correoSolicitante?: string;
  observacionSolicitante?: string;
  entidad?: string;

  fallecido?: PersonEntity;
  fechaFallecimiento?: string;

  // Datos del nicho/sitio
  propietarioNicho?: string;
  propietarioNombre?: string;
  propietarioFechaAdquisicion?: string;
  propietarioTipoTenencia?: string;
  numeroNichos?: number;
  lugarNicho?: string; // Cementerio Central, etc.
  codigoSitio?: string; // lugar del sitio/codigo
  administradorNicho?: string;
  esPropio?: boolean; // true propio, false arrendado
  observacionNicho?: string;

  // Acción
  tipoServicio: "ARREGLOS" | "CONSTRUCCION" | "LAPIDA";
  observacionServicio?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horarioTrabajo?: string;

  // Campos de autorización (usados en formularios PDF)
  condicion?: string;
  autorizacionTexto?: string;
  normativaAplicable?: string;
  obligacionesPostObra?: string;
  escombreraMunicipal?: string;
  direccionEntidad?: string;

  // Documentos PDF asociados
  documentos?: MejoraDocumento[];
}

export interface MejoraDocumento {
  filename: string;
  originalName: string;
  url: string;
  uploadedAt: string;
  contentType: string;
  size: number;
}

export interface CreateMejoraEntity {
  idCementerio: string;
  id_nicho?: string | null;
  panteoneroACargo: string;
  metodoSolicitud: "escrito" | "verbal";

  id_solicitante: string;
  solicitanteDireccion?: string | null;
  solicitanteTelefono?: string | null;
  solicitanteCorreo?: string | null;
  observacionSolicitante?: string | null;

  id_fallecido?: string | null;
  fechaFallecimiento?: string | null;

  propietarioNicho?: string | null;
  numeroNichos?: number | null;
  lugarNicho?: string | null;
  codigoSitio?: string | null;
  administradorNicho?: string | null;
  esPropio?: boolean | null;
  observacionNicho?: string | null;

  tipoServicio: "ARREGLOS" | "CONSTRUCCION" | "LAPIDA";
  observacionServicio?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  horarioTrabajo?: string | null;

  entidad: string;
  codigoAutorizacion?: string | null;
  condicion?: string | null;
  autorizacionTexto?: string | null;
  normativaAplicable?: string | null;
  obligacionesPostObra?: string | null;
  escombreraMunicipal?: string | null;
  propietarioFechaAdquisicion?: string | null;
  propietarioTipoTenencia?: string | null;
  direccionEntidad?: string | null;
  propietarioNombre?: string | null;
}


