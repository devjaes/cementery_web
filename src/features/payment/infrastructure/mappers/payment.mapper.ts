import {
  CreatePaymentEntity,
  PaymentEntity,
  PaymentStatus,
  ProcedureType,
  UpdatePaymentEntity,
} from "../../domain/entities/payment.entity";
import {
  CreatePaymentModel,
  PaymentModel,
  UpdatePaymentModel,
} from "../models/payment.model";

export class PaymentMapper {
  static toEntity(model: PaymentModel): PaymentEntity {
    return {
      paymentId: model.paymentId,
      procedureType: model.procedureType as ProcedureType,
      procedureId: model.procedureId,
      amount: Number(model.amount),
      status: model.status as PaymentStatus,
      paymentCode: model.paymentCode,
      generatedDate: model.generatedDate,
      paidDate: model.paidDate,
      receiptFile: model.receiptFile,
      observations: model.observations,
      generatedBy: model.generatedBy,
      validatedBy: model.validatedBy,
      updatedDate: model.updatedDate,
      // Campos que ya existen en la BD
      buyerDocument: model.buyerDocument,
      buyerName: model.buyerName,
      buyerDirection: model.buyerDirection,
    };
  }

  static toCreateModel(entity: CreatePaymentEntity): CreatePaymentModel {
    return {
      procedureType: entity.procedureType,
      procedureId: entity.procedureId,
      amount: entity.amount,
      generatedBy: entity.generatedBy,
      observations: entity.observations,
      // Campos que YA EXISTEN en la BD
      buyerName: entity.buyerName,
      buyerDocument: entity.buyerDocument,
      buyerDirection: entity.buyerDirection,
      // Campos adicionales para la generación del PDF
      causa: entity.causa,
      procedureTitle: entity.procedureTitle,
      ubicacion: entity.ubicacion,
      fallecidoNombre: entity.fallecidoNombre,
      concepto: entity.concepto,
    };
  }

  static toUpdateModel(entity: UpdatePaymentEntity): UpdatePaymentModel {
    return {
      status: entity.status,
      observations: entity.observations,
      validatedBy: entity.validatedBy,
    };
  }
}
