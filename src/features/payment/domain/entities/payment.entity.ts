export type ProcedureType = 
  | 'burial' 
  | 'exhumation' 
  | 'niche_sale' 
  | 'tomb_improvement' 
  | 'hole_extension';

export type PaymentStatus = 'pending' | 'paid';

export interface PaymentEntity {
  paymentId: string;
  procedureType: ProcedureType;
  procedureId: string;
  amount: number;
  status: PaymentStatus;
  paymentCode: string;
  generatedDate: string;
  paidDate: string | null;
  receiptFile: string | null;
  observations: string | null;
  generatedBy: string;
  validatedBy: string | null;
  updatedDate: string;
  // Campos que ya existen en la BD
  buyerDocument: string;
  buyerName: string;
  buyerDirection: string | null;
}

export interface CreatePaymentEntity {
  procedureType: ProcedureType;
  procedureId: string;
  amount: number;
  generatedBy: string;
  observations?: string;
  // Campos que YA EXISTEN en la BD
  buyerName: string;
  buyerDocument: string;
  buyerDirection?: string;
  // Campos adicionales para la generación del PDF
  causa?: string;
  procedureTitle?: string;
  ubicacion?: string;
  fallecidoNombre?: string;
  concepto?: string;
}

export interface UpdatePaymentEntity {
  paymentId: string;
  status?: PaymentStatus;
  observations?: string;
  validatedBy?: string;
}

export interface QueryPaymentEntity {
  status?: PaymentStatus;
  procedureType?: ProcedureType;
  generatedBy?: string;
  paymentCode?: string;
}

export interface UploadReceiptEntity {
  paymentId: string;
  file: File;
  validatedBy: string;
}
