import { CementeryEntity } from "@/features/cementery/domain/entities/cementery.entity";
import { HuecoEntity } from "@/features/huecos/domain/entities/hueco.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";
import { PropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";

export interface NichoEntity {
  idNicho?: string;
  idCementerio?: CementeryEntity;
  sector: string;
  fila: string;
  numero: string;
  tipo: string;
  estado: string;
  numHuecos: number;
  fechaConstruccion: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  propietarios?: PropietarioNichoEntity[];
  huecos?: HuecoEntity[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inhumaciones?: any[]; // TODO: Definir el tipo correcto cuando se implemente
}

export interface NichoFallecidosEntity {
  fallecido: PersonEntity;
  huecos: HuecoEntity[];
  nichos: NichoEntity[];
  cementerios: CementeryEntity[];
}

export interface SearchFallecidosEntity {
  terminoBusqueda: string;
  totalEncontrados: number;
  fallecidos: NichoFallecidosEntity[];
}

export interface CreateNichoEntity {
  idCementerio: string;
  sector: string;
  fila: string;
  numero: string;
  tipo: string;
  fechaConstruccion: string;
  observaciones?: string;
  numHuecos: number;
}

export interface UpdateNichoEntity {
  idNicho: string;
  sector?: string;
  fila?: string;
  numero?: string;
  tipo?: string;
  fechaConstruccion?: string;
  observaciones?: string;
  numHuecos?: number;
}
