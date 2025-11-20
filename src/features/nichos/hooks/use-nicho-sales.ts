import { useMutation, useQueryClient } from '@tanstack/react-query';
import AxiosClient from '@/core/infrastructure/axios-client';
import { NichoSalesRepository } from '@/features/nichos/infrastructure/repositories/nicho-sales.repository';
import { NICHO_QUERY_KEYS } from '@/features/nichos/domain/constants/nicho-keys';
import { BLOQUES_QUERY_KEYS } from '@/features/bloques/domain/constants/bloques-keys';
import { toast } from 'sonner';

const axiosClient = AxiosClient.getInstance();
const nichoSalesRepository = new NichoSalesRepository({
  post: axiosClient.post.bind(axiosClient),
  patch: axiosClient.patch.bind(axiosClient),
  delete: axiosClient.delete.bind(axiosClient)
});

export const useReservarNicho = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      idNicho: string;
      idPersona: string;
      monto: number;
      generadoPor: string;
      observaciones?: string;
      direccionComprador?: string;
    }) => nichoSalesRepository.reservarNicho(params),
    onSuccess: () => {
      // Invalidar queries de nichos y bloques para refrescar el estado
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.all() });
    },
    onError: (error: Error) => {
      toast.error("Error al reservar el nicho", {
        description: error.message,
      });
    },
  });
};

export const useConfirmarVenta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      idPago: string;
      validadoPor: string;
      archivoRecibo?: File;
    }) => nichoSalesRepository.confirmarVenta(params),
    onSuccess: () => {
      // Invalidar queries de nichos y bloques para refrescar el estado
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.all() });
      toast.success("Venta confirmada exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al confirmar la venta", {
        description: error.message,
      });
    },
  });
};

export const useCancelarReserva = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      idNicho: string;
      motivo: string;
    }) => nichoSalesRepository.cancelarReserva(params),
    onSuccess: () => {
      // Invalidar queries de nichos y bloques para refrescar el estado
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.all() });
      toast.success("Reserva cancelada exitosamente");
    },
    onError: (error: Error) => {
      toast.error("Error al cancelar la reserva", {
        description: error.message,
      });
    },
  });
};