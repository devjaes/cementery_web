import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import {
  CreatePaymentEntity,
  PaymentEntity,
  ProcedureType,
  QueryPaymentEntity,
  UpdatePaymentEntity,
  UploadReceiptEntity,
} from "../../domain/entities/payment.entity";
import { PaymentMapper } from "../mappers/payment.mapper";
import { PaymentModel } from "../models/payment.model";

export class PaymentRepositoryImpl implements PaymentRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): PaymentRepositoryImpl {
    return new PaymentRepositoryImpl();
  }

  async findAll(filters?: QueryPaymentEntity): Promise<PaymentEntity[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.procedureType)
      params.append("procedureType", filters.procedureType);
    if (filters?.generatedBy) params.append("generatedBy", filters.generatedBy);
    if (filters?.paymentCode) params.append("paymentCode", filters.paymentCode);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ROUTES.PAYMENTS.LIST}?${queryString}`
      : API_ROUTES.PAYMENTS.LIST;

    const { data } = await this.httpClient.get<PaymentModel[]>(url);
    return data.data.map(PaymentMapper.toEntity);
  }

  async findById(id: string): Promise<PaymentEntity> {
    const { data } = await this.httpClient.get<PaymentModel>(
      API_ROUTES.PAYMENTS.GET_BY_ID(id)
    );
    return PaymentMapper.toEntity(data.data);
  }

  async findByCode(code: string): Promise<PaymentEntity> {
    const { data } = await this.httpClient.get<PaymentModel>(
      API_ROUTES.PAYMENTS.GET_BY_CODE(code)
    );
    return PaymentMapper.toEntity(data.data);
  }

  async findByProcedure(
    procedureType: ProcedureType,
    procedureId: string
  ): Promise<PaymentEntity[]> {
    const { data } = await this.httpClient.get<PaymentModel[]>(
      API_ROUTES.PAYMENTS.GET_BY_PROCEDURE(procedureType, procedureId)
    );
    return data.data.map(PaymentMapper.toEntity);
  }

  async create(payment: CreatePaymentEntity): Promise<PaymentEntity> {
    const model = PaymentMapper.toCreateModel(payment);
    const { data } = await this.httpClient.post<PaymentModel>(
      API_ROUTES.PAYMENTS.CREATE,
      model
    );
    return PaymentMapper.toEntity(data.data);
  }

  async update(payment: UpdatePaymentEntity): Promise<PaymentEntity> {
    const model = PaymentMapper.toUpdateModel(payment);
    const { data } = await this.httpClient.patch<PaymentModel>(
      API_ROUTES.PAYMENTS.UPDATE(payment.paymentId),
      model
    );
    return PaymentMapper.toEntity(data.data);
  }

  async confirmPayment(
    paymentId: string,
    validatedBy: string
  ): Promise<PaymentEntity> {
    const { data } = await this.httpClient.patch<PaymentModel>(
      API_ROUTES.PAYMENTS.CONFIRM(paymentId),
      { validatedBy }
    );
    return PaymentMapper.toEntity(data.data);
  }

  async uploadReceipt(uploadData: UploadReceiptEntity): Promise<PaymentEntity> {
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("validatedBy", uploadData.validatedBy);

    const { data } = await this.httpClient.post<PaymentModel>(
      API_ROUTES.PAYMENTS.UPLOAD_RECEIPT(uploadData.paymentId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return PaymentMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.PAYMENTS.DELETE(id));
  }

  async downloadReceipt(id: string): Promise<Blob> {
    const { data } = await this.httpClient.get<
      Blob,
      import("axios").AxiosResponse<Blob>
    >(API_ROUTES.PAYMENTS.DOWNLOAD_RECEIPT(id), { responseType: "blob" });
    return data;
  }
}
