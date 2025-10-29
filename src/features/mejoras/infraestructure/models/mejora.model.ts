import { CementeryModel } from "@/features/cementery/infrastructure/models/cementery.model";
import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface MejoraModel {
  id_mejora: string;
  fechaSolicitud: string;
  codigoAutorizacion?: string;

  id_cementerio: CementeryModel;
  pantoneroACargo: string;
  metodoSolicitud: string;

  solicitante: PersonModel;
  direccionSolicitante?: string;
  celularSolicitante?: string;
  correoSolicitante?: string;

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
  observacionAccion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horario?: string;
}

export interface CreateMejoraModel {
  id_cementerio: string;
  pantoneroACargo: string;
  metodoSolicitud: string;

  solicitanteId: string;
  direccionSolicitante?: string;
  celularSolicitante?: string;
  correoSolicitante?: string;

  fallecidoId?: string;
  fechaFallecimiento?: string;

  propietarioNicho?: string;
  numeroNichos?: number;
  lugarNicho?: string;
  codigoSitio?: string;
  administradorNicho?: string;
  esPropio?: boolean;
  observacionNicho?: string;

  tipoServicio: "ARREGLOS" | "CONSTRUCCION" | "LAPIDA";
  observacionAccion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horario?: string;
}


