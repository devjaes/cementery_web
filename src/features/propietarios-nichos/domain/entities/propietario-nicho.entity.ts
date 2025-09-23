import { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";

export type TipoDocumento = "Escritura" | "Contrato" | "Factura" | "Otro";
export type TipoPropietario = "Dueño" | "Heredero";

export interface PropietarioNichoEntity {
  idPropietarioNicho: string;
  idPersona?: PersonEntity;
  idNicho?: NichoEntity;
  fechaAdquisicion: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  activo: boolean;
  razon: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  tipo: TipoPropietario;
}

export interface CreatePropietarioNichoEntity {
  idPersona: string;
  idNicho: string;
  fechaAdquisicion: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  razon: string;
  tipo: TipoPropietario;
}

export interface UpdatePropietarioNichoEntity {
  idPropietarioNicho: string;
  activo?: boolean;
  razon?: string;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  tipo?: TipoPropietario;
}
