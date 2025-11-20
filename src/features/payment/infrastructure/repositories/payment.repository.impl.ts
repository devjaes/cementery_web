import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import axios from "axios";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import {
  CreatePaymentEntity,
  CreatePaymentResponse,
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

  async create(payment: CreatePaymentEntity): Promise<CreatePaymentResponse> {
    const model = PaymentMapper.toCreateModel(payment);

    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "https://backend-cementerio-pillaro.onrender.com";
    const url = `${baseURL.endsWith('/') ? baseURL : baseURL + '/'}${API_ROUTES.PAYMENTS.CREATE}`;
    
    const token = await this.getAuthToken();
    const response = await axios.post(url, model, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const paymentDataHeader =
      response.headers["x-payment-data"] ||
      response.headers["X-Payment-Data"] ||
      response.headers["X-PAYMENT-DATA"];

    if (!paymentDataHeader) {
      throw new Error(
        "No se recibieron los datos del pago en el header X-Payment-Data"
      );
    }

    let paymentData: PaymentModel;
    try {
      paymentData =
        typeof paymentDataHeader === "string"
          ? JSON.parse(paymentDataHeader)
          : paymentDataHeader;
    } catch (error) {
      console.error("Error parsing payment data:", error);
      throw new Error("Error al parsear los datos del pago del header");
    }

    const paymentEntity = PaymentMapper.toEntity(paymentData);

    return {
      payment: paymentEntity,
      pdfBlob: response.data,
    };
  }

  private async getAuthToken(): Promise<string> {
    if (typeof window !== "undefined") {
      try {
        const { useAuthStore } = await import(
          "@/features/auth/presentation/context/auth.store"
        );
        return useAuthStore.getState().token || "";
      } catch {
        return "";
      }
    }
    return "";
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
