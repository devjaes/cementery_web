export interface NichoVenta {
  id: string;
  fila: number;
  columna: number;
  estado: "Vendido" | "Reservado" | "Disponible" | "Deshabilitado";
  cementerio: string;
}

export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
}

export interface Comprador {
  documento: string;
  nombre: string;
  direccion: string;
}

export interface OrdenPago {
  id: string;
  codigo: string;
  monto: number;
  estado: "pending" | "paid";
  fechaGeneracion: string;
  comprador: Comprador;
}

export interface PagoConfirmado {
  id: string;
  codigo: string;
  monto: number;
  estado: "paid";
  fechaPago: string;
  validadoPor: string;
  comprador: Comprador;
}

export interface ReservarNichoResponse {
  nicho: NichoVenta;
  cliente: Cliente;
  ordenPago: OrdenPago;
}

export interface ConfirmarVentaResponse {
  nicho: NichoVenta;
  pago: PagoConfirmado;
  siguientePaso: {
    accion: string;
    mensaje: string;
    datos?: {
      idNicho: string;
      idPago: string;
    };
  };
}

// Resultado enriquecido para el flujo del front: incluye el PDF y nombre sugerido de archivo
export interface ReservarNichoResult {
  reserva: ReservarNichoResponse;
  pdfBlob: Blob;
  filename: string;
}