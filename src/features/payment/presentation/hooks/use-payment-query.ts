import { useQuery } from '@tanstack/react-query';
import { PAYMENT_QUERY_KEYS } from '../../domain/constants/payment-keys';
import { PaymentRepositoryImpl } from '../../infrastructure/repositories/payment.repository.impl';
import { ProcedureType, QueryPaymentEntity } from '../../domain/entities/payment.entity';

export const usePayments = (filters?: QueryPaymentEntity) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.findAll(filters);
    },
  });
};

export const usePayment = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.byId(id),
    queryFn: async () => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.findById(id);
    },
    enabled: enabled && !!id,
  });
};

export const usePaymentByCode = (code: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.byCode(code),
    queryFn: async () => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.findByCode(code);
    },
    enabled: enabled && !!code,
  });
};

export const usePaymentsByProcedure = (
  procedureType: ProcedureType,
  procedureId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.byProcedure(procedureType, procedureId),
    queryFn: async () => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.findByProcedure(procedureType, procedureId);
    },
    enabled: enabled && !!procedureId,
  });
};
