import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { InhumacionModel } from "@/features/inhumaciones/infrastructure/models/inhumacion.model";

export interface ExhumacionModel {
  id_exhumacion: string;
  fecha_exhumacion: string;
  hora_exhumacion: string;
  duenio_nicho: string;
  ubicacion: string;
  causa: string;
  observacion?: string;
  archivos: string[];
  estado_pago: 'pendiente' | 'finalizado';
  comprobante_pago?: string;
  codigo: string;
  nicho_original_id: string;
  inhumacion_id: string;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  // Relaciones
  nicho_original?: NichoModel;
  inhumacion?: InhumacionModel;
}

export interface CreateExhumacionModel {
  fecha_exhumacion: string;
  hora_exhumacion: string;
  duenio_nicho: string;
  ubicacion: string;
  causa: string;
  observacion?: string;
  nicho_original_id: string;
  inhumacion_id: string;
}

export interface UpdateExhumacionModel {
  id_exhumacion: string;
  fecha_exhumacion?: string;
  hora_exhumacion?: string;
  duenio_nicho?: string;
  ubicacion?: string;
  causa?: string;
  observacion?: string;
  archivos?: string[];
  comprobante_pago?: string;
  estado_pago?: 'pendiente' | 'finalizado';
}
