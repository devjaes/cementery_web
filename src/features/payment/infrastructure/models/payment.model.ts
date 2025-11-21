export interface PaymentModel {
  paymentId: string;
  procedureType: string;
  procedureId: string;
  amount: number;
  status: string;
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

export interface CreatePaymentModel {
  procedureType: string;
  procedureId: string;
  amount: number;
  generatedBy: string;
  observations?: string;
  // Campos que YA EXISTEN en la BD
  buyerName: string;
  buyerDocument: string;
  buyerDirection?: string;
  // Campos adicionales para la generación del PDF.
  causa?: string;
  procedureTitle?: string;
  ubicacion?: string;
  fallecidoNombre?: string;
  concepto?: string;
}

export interface UpdatePaymentModel {
  status?: string;
  observations?: string;
  validatedBy?: string;
}
