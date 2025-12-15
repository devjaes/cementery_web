import { AxiosResponse } from 'axios';
import { ReservarNichoResponse, ConfirmarVentaResponse, ReservarNichoResult } from '../../domain/interfaces/nicho-venta.interface';

interface HttpClient {
  // Mantener firma compatible con Axios para permitir pasar config (responseType, headers, etc.)
  post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>>;
}

export class NichoSalesRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async reservarNicho(params: {
    idNicho: string;
    idPersona: string;
    monto: number;
    generadoPor: string;
    observaciones?: string;
    direccionComprador?: string;
  }): Promise<ReservarNichoResult> {
    // El backend devuelve un PDF (blob) y en el header X-Reserva-Data viene el JSON de la reserva
    const response = await this.httpClient.post<Blob>(
      '/nicho-sales/reservar',
      params,
      { responseType: 'blob' }
    );

    const pdfBlob = response.data as unknown as Blob;
    const headers = response.headers || {};

    // Los headers pueden normalizarse a minúsculas por Axios
    const reservaHeader = headers['x-reserva-data'] || headers['X-Reserva-Data'];
    let reserva: ReservarNichoResponse;
    try {
      reserva = JSON.parse(reservaHeader) as ReservarNichoResponse;
    } catch {
      // Fallback: por si algo cambia, devolvemos un objeto mínimo para no romper el flujo
      throw new Error('No se pudo leer la información de la reserva (X-Reserva-Data)');
    }

    // Intentar obtener nombre de archivo del Content-Disposition del backend
    const contentDisposition: string | undefined = headers['content-disposition'] || headers['Content-Disposition'];
    let filename = `recibo-reserva-${reserva?.ordenPago?.codigo ?? 'nicho'}.pdf`;
    if (contentDisposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition);
      const raw = decodeURIComponent(match?.[1] || match?.[2] || '');
      if (raw) filename = raw;
    }

    return { reserva, pdfBlob, filename };
  }

  async reservarMausoleo(params: {
    idBloque: string;
    idPersona: string;
    monto: number;
    generadoPor: string;
    observaciones?: string;
    direccionComprador?: string;
  }): Promise<ReservarNichoResult> {
    const response = await this.httpClient.post<Blob>(
      '/nicho-sales/mausoleo/reservar',
      params,
      { responseType: 'blob' }
    );

    const pdfBlob = response.data as unknown as Blob;
    const headers = response.headers || {};
    const reservaHeader = headers['x-reserva-data'] || headers['X-Reserva-Data'];
    let reserva: ReservarNichoResponse;
    try {
      reserva = JSON.parse(reservaHeader) as ReservarNichoResponse;
    } catch {
      throw new Error('No se pudo leer la información de la reserva (X-Reserva-Data)');
    }

    const contentDisposition: string | undefined = headers['content-disposition'] || headers['Content-Disposition'];
    let filename = `recibo-reserva-${reserva?.ordenPago?.codigo ?? 'mausoleo'}.pdf`;
    if (contentDisposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition);
      const raw = decodeURIComponent(match?.[1] || match?.[2] || '');
      if (raw) filename = raw;
    }

    return { reserva, pdfBlob, filename };
  }

  async confirmarVenta(params: {
    idPago: string;
    validadoPor: string;
    archivoRecibo?: File;
  }): Promise<ConfirmarVentaResponse> {
    // Si hay archivo, usar FormData
    if (params.archivoRecibo) {
      const formData = new FormData();
      formData.append('idPago', params.idPago);
      formData.append('validadoPor', params.validadoPor);
      formData.append('archivoRecibo', params.archivoRecibo);

      const { data } = await this.httpClient.patch<ConfirmarVentaResponse>(
        '/nicho-sales/confirmar-venta',
        formData
      );
      return data;
    }

    // Si no hay archivo, enviar JSON normal
    const { data } = await this.httpClient.patch<ConfirmarVentaResponse>(
      '/nicho-sales/confirmar-venta',
      params
    );
    return data;
  }

  async cancelarReserva(params: {
    idNicho: string;
    motivo: string;
  }): Promise<{ mensaje: string }> {
    const { data } = await this.httpClient.delete(
      `/nicho-sales/cancelar-reserva/${params.idNicho}`,
      { data: { motivo: params.motivo } }
    );
    return data;
  }

  // --- Mausoleo specific operations ---
  async confirmarVentaMausoleo(params: {
    idPago: string;
    validadoPor: string;
    archivoRecibo?: File;
  }): Promise<ConfirmarVentaResponse> {
    if (params.archivoRecibo) {
      const formData = new FormData();
      formData.append('idPago', params.idPago);
      formData.append('validadoPor', params.validadoPor);
      formData.append('archivoRecibo', params.archivoRecibo);

      const { data } = await this.httpClient.patch<ConfirmarVentaResponse>(
        '/nicho-sales/mausoleo/confirmar-venta',
        formData
      );
      return data;
    }

    const { data } = await this.httpClient.patch<ConfirmarVentaResponse>(
      '/nicho-sales/mausoleo/confirmar-venta',
      params
    );
    return data;
  }

  async cancelarReservaMausoleo(params: {
    idBloque: string;
    motivo: string;
  }): Promise<{ mensaje: string }> {
    const { data } = await this.httpClient.delete(
      `/nicho-sales/mausoleo/cancelar-reserva/${params.idBloque}`,
      { data: { motivo: params.motivo } }
    );
    return data;
  }

  async registrarPropietarioMausoleo(params: {
    idBloque: string;
    idPersona: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    razon?: string;
  }): Promise<any> {
    const { data } = await this.httpClient.post(
      '/nicho-sales/mausoleo/registrar-propietario',
      params
    );
    return data;
  }
}