import { CementeryEntity } from "@/features/cementery/domain/entities/cementery.entity";
import { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";

export interface MejoraEntity {
  idMejora: string;
  fechaSolicitud: string;
  codigoAutorizacion?: string;

  idCementerio: CementeryEntity;
  pantoneroACargo: string;
  metodoSolicitud: string; // Escrita | Verbal

  solicitante: PersonEntity;
  direccionSolicitante?: string;
  celularSolicitante?: string;
  correoSolicitante?: string;

  fallecido?: PersonEntity;
  fechaFallecimiento?: string;

  // Datos del nicho/sitio
  propietarioNicho?: string;
  numeroNichos?: number;
  lugarNicho?: string; // Cementerio Central, etc.
  codigoSitio?: string; // lugar del sitio/codigo
  administradorNicho?: string;
  esPropio?: boolean; // true propio, false arrendado
  observacionNicho?: string;

  // Acción
  tipoServicio: "ARREGLOS" | "CONSTRUCCION" | "LAPIDA";
  observacionAccion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horario?: string;

  // Archivos (nombres/ids retornados por API)
  archivos?: Array<{ id: string; nombre: string; tipo: string }>;
}

export interface CreateMejoraEntity {
  idCementerio: string;
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


