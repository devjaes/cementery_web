import { useMutation } from '@tanstack/react-query';
import AxiosClient from '@/core/infrastructure/axios-client';
import { NichoSalesRepository } from '@/features/nichos/infrastructure/repositories/nicho-sales.repository';

const axiosClient = AxiosClient.getInstance();
const nichoSalesRepository = new NichoSalesRepository({
  post: axiosClient.post.bind(axiosClient),
  patch: axiosClient.patch.bind(axiosClient)
});

export const useReservarNicho = () => {
  return useMutation({
    mutationFn: (params: {
      idNicho: string;
      idPersona: string;
      monto: number;
      generadoPor: string;
      observaciones?: string;
      direccionComprador?: string;
    }) => nichoSalesRepository.reservarNicho(params),
  });
};

export const useConfirmarVenta = () => {
  return useMutation({
    mutationFn: (params: {
      idPago: string;
      validadoPor: string;
      archivoRecibo?: File;
    }) => nichoSalesRepository.confirmarVenta(params),
  });
};

export const useCancelarReserva = () => {
  return useMutation({
    mutationFn: (params: {
      idNicho: string;
      motivo: string;
    }) => nichoSalesRepository.cancelarReserva(params),
  });
};