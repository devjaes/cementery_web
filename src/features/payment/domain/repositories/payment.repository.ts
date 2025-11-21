import {
  CreatePaymentEntity,
  CreatePaymentResponse,
  PaymentEntity,
  ProcedureType,
  QueryPaymentEntity,
  UpdatePaymentEntity,
  UploadReceiptEntity,
} from "../entities/payment.entity";

export interface PaymentRepository {
  findAll(filters?: QueryPaymentEntity): Promise<PaymentEntity[]>;
  findById(id: string): Promise<PaymentEntity>;
  findByCode(code: string): Promise<PaymentEntity>;
  findByProcedure(
    procedureType: ProcedureType,
    procedureId: string
  ): Promise<PaymentEntity[]>;
  create(payment: CreatePaymentEntity): Promise<CreatePaymentResponse>;
  update(payment: UpdatePaymentEntity): Promise<PaymentEntity>;
  confirmPayment(
    paymentId: string,
    validatedBy: string
  ): Promise<PaymentEntity>;
  uploadReceipt(data: UploadReceiptEntity): Promise<PaymentEntity>;
  delete(id: string): Promise<void>;
  downloadReceipt(id: string): Promise<Blob>;
}
