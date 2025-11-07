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

  // Archivos (nombres/ids retornados por API)
  archivos?: Array<{ id: string; nombre: string; tipo: string }>;
}

export interface CreateMejoraEntity {
  idCementerio: string;
  id_nicho?: string;
  panteoneroACargo: string;
  metodoSolicitud: "escrito" | "verbal";

  id_solicitante: string;
  solicitanteDireccion?: string;
  solicitanteTelefono?: string;
  solicitanteCorreo?: string;
  observacionSolicitante?: string;

  id_fallecido?: string;
  fechaFallecimiento?: string;

  propietarioNicho?: string;
  numeroNichos?: number;
  lugarNicho?: string;
  codigoSitio?: string;
  administradorNicho?: string;
  esPropio?: boolean;
  observacionNicho?: string;

  tipoServicio: "ARREGLOS" | "CONSTRUCCION" | "LAPIDA";
  observacionServicio?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horarioTrabajo?: string;

  entidad: string;
  codigoAutorizacion?: string;
  condicion?: string;
  autorizacionTexto?: string;
  normativaAplicable?: string;
  obligacionesPostObra?: string;
  escombreraMunicipal?: string;
  propietarioFechaAdquisicion?: string;
  propietarioTipoTenencia?: string;
  direccionEntidad?: string;
  propietarioNombre?: string;
}


