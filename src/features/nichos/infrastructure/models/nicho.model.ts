/* eslint-disable @typescript-eslint/no-explicit-any */
import { CementeryModel } from "@/features/cementery/infrastructure/models/cementery.model";
import { HuecoModel } from "@/features/huecos/infrastructure/models/hueco.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";
import { PropietarioNichoModel } from "@/features/propietarios-nichos/infrastructure/models/propietario-nicho.model";

export interface NichoModel {
  id_nicho?: string;
  id_cementerio?: CementeryModel;
  sector: string;
  fila: string;
  numero: string;
  tipo: string;
  estado: string;
  num_huecos: number;
  fecha_construccion: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  propietarios_nicho?: PropietarioNichoModel[];
  huecos?: HuecoModel[];
  inhumaciones?: any[]; // TODO: Definir el tipo correcto cuando se implemente
}

export interface NichosFallecidosModel {
  fallecido: PersonModel;
  huecos: HuecoModel[];
  nichos: NichoModel[];
  cementerios: CementeryModel[];
}

export interface SearchFallecidosModel {
  termino_busqueda: string;
  total_encontrados: number;
  fallecidos: NichosFallecidosModel[];
}

export interface CreateNichoModel {
  id_cementerio: string;
  sector: string;
  fila: string;
  numero: string;
  tipo: string;
  fecha_construccion: string;
  observaciones?: string;
  num_huecos: number;
}

export interface UpdateNichoModel {
  id_nicho: string;
  sector?: string;
  fila?: string;
  numero?: string;
  tipo?: string;
  fecha_construccion?: string;
  observaciones?: string;
  num_huecos?: number;
}
