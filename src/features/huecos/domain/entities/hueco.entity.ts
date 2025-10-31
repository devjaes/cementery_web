/* eslint-disable @typescript-eslint/no-explicit-any */
import { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";

export interface FallecidoEntity {
  idPersona: string;
  nombre: string;
  apellido: string;
}

export interface HuecoEntity {
  idDetalleHueco: string;
  idNicho?: NichoEntity;
  numHueco: number;
  estado: string;
  idFallecido: PersonEntity | null;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  requisitosInhumacion: any[]; // TODO: Definir interfaz cuando se implemente el módulo de requisitos
  // Nuevos campos de ampliación
  rutaArchivoAmpliacion?: string;
  observacionAmpliacion?: string;
}

export interface CreateHuecoEntity {
  /** ID del nicho al que pertenece el hueco */
  idNicho: string;

  /** Número del hueco (opcional, si el backend lo genera automáticamente) */
  numeroHueco?: number;

  /** Estado del hueco (ej. disponible, ocupado, etc.) */
  estado?: string;

  /** ID del fallecido asociado (si aplica) */
  idFallecido?: string;

  /** Archivo PDF opcional (por ejemplo, requisitos o documentación) */
  pdfFile?: File;

  /** Observación de ampliación (opcional) */
  observacionAmpliacion?: string;
}

export interface UpdateHuecoEntity {
  idDetalleHueco: string;
  estado: string;
  idFallecido?: string;
  // Opcionales para reemplazo/actualización de ampliación
  pdfFile?: File;
  observacionAmpliacion?: string;
} 