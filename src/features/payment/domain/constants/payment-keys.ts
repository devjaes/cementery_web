import { ProcedureType, QueryPaymentEntity } from '../entities/payment.entity';

export const PAYMENT_QUERY_KEYS = {
  all: () => ['payments'] as const,
  lists: () => [...PAYMENT_QUERY_KEYS.all(), 'list'] as const,
  list: (filters?: QueryPaymentEntity) => 
    [...PAYMENT_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PAYMENT_QUERY_KEYS.all(), 'detail'] as const,
  byId: (id: string) => [...PAYMENT_QUERY_KEYS.details(), id] as const,
  byCode: (code: string) => [...PAYMENT_QUERY_KEYS.details(), 'code', code] as const,
  byProcedure: (type: ProcedureType, id: string) => 
    [...PAYMENT_QUERY_KEYS.details(), 'procedure', type, id] as const,
};
