import { CementeryModel } from "@/features/cementery/infrastructure/models/cementery.model";
import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface InhumacionModel {
    id_inhumacion: string;
    id_nicho: NichoModel;
    id_fallecido: PersonModel;
    fecha_inhumacion: string;
    hora_inhumacion: string;
    observaciones: string | null;
    solicitante: string;
    responsable_inhumacion: string;
    codigo_inhumacion: string;
    estado: string;
    fecha_creacion: string;
    fecha_modificacion: string | null;
}
export interface CreateInhumacionModel {
    id_nicho: string;
    id_fallecido: string;
    fecha_inhumacion: string;
    hora_inhumacion: string;
    observaciones?: string | null;
    estado: string;
    solicitante: string;
    responsable_inhumacion: string;
    codigo_inhumacion: string;
}

export interface UpdateInhumacionModel {
    id_inhumacion: string;
    id_nicho?: string;
    id_fallecido?: string;
    fecha_inhumacion?: string;
    hora_inhumacion?: string;
    observaciones?: string | null;
    estado?: string;
    solicitante?: string;
    responsable_inhumacion?: string;
    codigo_inhumacion?: string;
}

export interface InhumacionFallecidosModel {
    fallecido: PersonModel;
    inhumaciones: InhumacionModel[];
    nichos: NichoModel[];
    cementerios: CementeryModel[];
}

export interface SearchFallecidosInhumacionModel {
    termino_busqueda: string;
    total_encontrados: number;
    fallecidos: InhumacionFallecidosModel[];
}