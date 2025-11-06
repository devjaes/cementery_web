import { CementeryModel } from "@/features/cementery/infrastructure/models/cementery.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface MejoraModel {
  id_mejora: string;
  fechaSolicitud: string;
  codigoAutorizacion?: string;

  id_cementerio?: CementeryModel;
  panteoneroACargo: string;
  pantoneroACargo?: string; // compatibilidad con respuestas anteriores
  metodoSolicitud: string;

  nicho?: {
    id_nicho: string;
    id_cementerio: CementeryModel;
  };

  solicitante: PersonModel;
  direccionSolicitante?: string;
  celularSolicitante?: string;
  solicitanteTelefono?: string;
  correoSolicitante?: string;
  observacionSolicitante?: string;
  entidad?: string;

  fallecido?: PersonModel;
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
  observacionAccion?: string; // compatibilidad con respuestas anteriores
  fechaInicio?: string;
  fechaFin?: string;
  horarioTrabajo?: string;
  horario?: string; // compatibilidad con respuestas anteriores
  estado?: string;
}

export interface CreateMejoraModel {
  id_cementerio: string;
  id_nicho?: string;
  panteoneroACargo: string;
  metodoSolicitud: string;

  id_solicitante: string;
  solicitanteDireccion?: string;
  solicitanteTelefono?: string;
  solicitanteCorreo?: string;
  observacionSolicitante?: string;

  id_fallecido?: string;
  fechaFallecimiento?: string;

  propietarioNicho?: string;
  propietarioNombre?: string;
  propietarioFechaAdquisicion?: string;
  propietarioTipoTenencia?: string;
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
  direccionEntidad?: string;
}


