/* eslint-disable @typescript-eslint/no-explicit-any */
import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface FallecidoModel {
  id_persona: string;
  nombre: string;
  apellido: string;
}

export interface HuecoModel {
  id_detalle_hueco: string;
  id_nicho?: NichoModel;
  num_hueco: number;
  estado: string;
  id_fallecido: PersonModel | null;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  requisitos_inhumacion: any[]; // TODO: Definir interfaz cuando se implemente el módulo de requisitos
}

export interface CreateHuecoModel {
  id_nicho: string;
  num_hueco?: number;
  estado?: string;
  id_fallecido?: string;
}

export interface UpdateHuecoModel {
  id_detalle_hueco: string;
  estado: string;
  id_fallecido?: string;
}
