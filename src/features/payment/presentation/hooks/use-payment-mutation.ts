import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreatePaymentEntity,
  UpdatePaymentEntity,
  UploadReceiptEntity,
} from "../../domain/entities/payment.entity";
import { PaymentRepositoryImpl } from "../../infrastructure/repositories/payment.repository.impl";
import { PAYMENT_QUERY_KEYS } from "../../domain/constants/payment-keys";
import AxiosClient from "@/core/infrastructure/axios-client";
import { NichoSalesRepository } from "@/features/nichos/infrastructure/repositories/nicho-sales.repository";
import { NICHO_QUERY_KEYS } from "@/features/nichos/domain/constants/nicho-keys";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentEntity) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all() });
    },
    onError: (error: Error) => {
      toast.error("Error al generar el pago", {
        description: error.message,
      });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePaymentEntity) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.byId(data.paymentId),
      });
      toast.success("Pago actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el pago", {
        description: error.message,
      });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      validatedBy,
    }: {
      paymentId: string;
      validatedBy: string;
    }) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.confirmPayment(paymentId, validatedBy);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.byId(data.paymentId),
      });
      toast.success("Pago confirmado exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al confirmar el pago", {
        description: error.message,
      });
    },
  });
};

export const useUploadReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadReceiptEntity) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.uploadReceipt(data);
    },
    // variables es lo que se pasó a mutate(), útil para obtener validatedBy y file
    onSuccess: async (payment, variables: UploadReceiptEntity) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.byId(payment.paymentId),
      });
      toast.success("Comprobante subido y pago confirmado exitosamente");

      // Si el pago corresponde a una venta de nicho, intentar confirmar la venta
      try {
        if (payment.procedureType === "niche_sale") {
          const axiosClient = AxiosClient.getInstance();
          const nichoSalesRepository = new NichoSalesRepository({
            post: axiosClient.post.bind(axiosClient),
            patch: axiosClient.patch.bind(axiosClient),
          });

          // llamar al endpoint de confirmar venta para que el backend marque el nicho como VENDIDO
          await nichoSalesRepository.confirmarVenta({
            idPago: payment.paymentId,
            validadoPor: variables.validatedBy,
          });

          // invalidar queries de nichos para refrescar estado
          queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
          toast.success("Nicho marcado como VENDIDO");
        }
      } catch (err: any) {
        // Si el backend indica que ya está confirmado, tratamos como no bloqueante.
        const msg = (err?.message || err?.response?.data?.message || "").toString().toLowerCase();
        if (msg.includes("confirm") || msg.includes("confirmado")) {
          queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
          // silently accept (ya estaba confirmado)
          return;
        }

        // Mostrar toast pero no bloquear el flujo principal
        toast.error("No se pudo marcar el nicho como VENDIDO automáticamente", {
          description: err?.message || String(err),
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error al subir el comprobante", {
        description: error.message,
      });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all() });
      toast.success("Pago eliminado exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar el pago", {
        description: error.message,
      });
    },
  });
};

export const useDownloadReceipt = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.downloadReceipt(id);
    },
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comprobante-pago-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Comprobante descargado exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al descargar el comprobante", {
        description: error.message,
      });
    },
  });
};

export const useGetReceiptBlob = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const repository = PaymentRepositoryImpl.getInstance();
      return await repository.downloadReceipt(id);
    },
    onError: (error: Error) => {
      toast.error("Error al obtener el comprobante", {
        description: error.message,
      });
    },
  });
};
