export type ProcedureType =
  | "burial"
  | "exhumation"
  | "niche_sale"
  | "tomb_improvement"
  | "hole_extension";

export type PaymentStatus = "pending" | "paid";

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
  buyerDocument: string;
  buyerName: string;
  buyerDirection: string | null;
  updatedDate: string;
}

export interface CreatePaymentEntity {
  procedureType: ProcedureType;
  procedureId: string;
  amount: number;
  generatedBy: string;
  buyerDocument: string;
  buyerName: string;
  buyerDirection?: string;
  observations?: string;
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

export interface CreatePaymentResponse {
  payment: PaymentEntity;
  pdfBlob: Blob;
}
