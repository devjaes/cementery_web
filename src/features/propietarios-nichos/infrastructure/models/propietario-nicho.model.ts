import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { TipoDocumento, TipoPropietario } from "../../domain/entities/propietario-nicho.entity";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface PropietarioNichoModel {
  id_propietario_nicho: string;
  id_persona: PersonModel;
  id_nicho: NichoModel;
  fecha_adquisicion: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  activo: boolean;
  razon: string;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  tipo: TipoPropietario;
}

export interface CreatePropietarioNichoModel {
  id_persona: string;
  id_nicho: string;
  fecha_adquisicion: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  razon: string;
  tipo: TipoPropietario;
}

export interface UpdatePropietarioNichoModel {
  id_propietario_nicho: string;
  activo?: boolean;
  razon?: string;
  tipo_documento?: TipoDocumento;
  numero_documento?: string;
  tipo?: TipoPropietario;
} 