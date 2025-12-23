import { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import { InhumacionEntity } from "@/features/inhumaciones/domain/entities/inhumacion.entity";

export interface ExhumacionEntity {
  idExhumacion: string;
  fechaExhumacion: string;
  horaExhumacion: string;
  duenioNicho: string;
  ubicacion: string;
  causa: string;
  observacion?: string;
  archivos?: { type: string; data: number[] } | null; // Buffer serializado desde el backend
  estadoPago: 'pendiente' | 'finalizado';
  comprobantePago?: { type: string; data: number[] } | null; // Buffer serializado desde el backend
  codigo: string;
  nichoOriginalId: string;
  inhumacionId: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  // Relaciones
  nichoOriginal?: NichoEntity;
  inhumacion?: InhumacionEntity;
}

export interface CreateExhumacionEntity {
  fechaExhumacion: string;
  horaExhumacion: string;
  duenioNicho: string;
  ubicacion: string;
  causa: string;
  observacion?: string;
  archivos: File[];
  nichoOriginalId: string;
  inhumacionId: string;
}

export interface UpdateExhumacionEntity {
  idExhumacion: string;
  fechaExhumacion?: string;
  horaExhumacion?: string;
  duenioNicho?: string;
  ubicacion?: string;
  causa?: string;
  observacion?: string;
  archivos?: { type: string; data: number[] } | null;
  comprobantePago?: { type: string; data: number[] } | null;
  estadoPago?: 'pendiente' | 'finalizado';
}

export interface ExhumacionWithPaymentEntity extends ExhumacionEntity {
  paymentCode?: string;
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'paid';
}
