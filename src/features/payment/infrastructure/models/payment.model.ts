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
}

export interface CreatePaymentModel {
  procedureType: string;
  procedureId: string;
  amount: number;
  generatedBy: string;
  observations?: string;
}

export interface UpdatePaymentModel {
  status?: string;
  observations?: string;
  validatedBy?: string;
}
