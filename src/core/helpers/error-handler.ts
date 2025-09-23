import { AxiosError } from "axios";
import { ResponseErrorAPI } from "../interfaces/api.interface";

interface ErrorResponseData {
  message?: string;
  errors?: string[] | string;
}

type ErrorHandler = {
  message: string;
  handle?: () => void;
};

export class ApiErrorHandler {
  private static readonly ERROR_HANDLERS: Record<number, ErrorHandler> = {
    400: {
      message: "Datos inválidos en la solicitud",
    },
    401: {
      message: "No autorizado",
      handle: () => {
        /*Manejar logout */
      },
    },
    403: {
      message: "No tiene permisos para realizar esta acción",
      handle: () => {
        /*Manejar logout */
      },
    },
    404: {
      message: "Recurso no encontrado",
    },
    422: {
      message: "Error de validación",
    },
    429: {
      message: "Demasiadas solicitudes - Por favor intente más tarde",
    },
    500: {
      message: "Error interno del servidor",
    },
    503: {
      message: "Servicio no disponible - Por favor intente más tarde",
    },
  };

  private static readonly DEFAULT_ERROR: ErrorHandler = {
    message: "Error en la solicitud",
  };

  private static readonly NETWORK_ERRORS: Record<string, string> = {
    ECONNABORTED:
      "La solicitud tardó demasiado tiempo - Por favor intente nuevamente",
    DEFAULT: "Error de conexión - Por favor verifique su conexión a internet",
  };

  static handle(error: AxiosError<ErrorResponseData>): ResponseErrorAPI {
    const apiError: ResponseErrorAPI = {
      message: "Un error inesperado ocurrió",
      errors: [],
    };

    if (error.response) {
      const status = error.response.status;
      const handler = this.ERROR_HANDLERS[status] || this.DEFAULT_ERROR;

      handler.handle?.();

      apiError.message = error.response.data?.message || handler.message;
      apiError.errors = [];
    } else if (error.request) {
      apiError.message = this.handleRequestError(error);
    }

    this.logError(error, apiError);

    return apiError;
  }

  private static handleRequestError(error: AxiosError): string {
    return this.NETWORK_ERRORS[error.code || ""] || this.NETWORK_ERRORS.DEFAULT;
  }

  private static logError(error: AxiosError, apiError: ResponseErrorAPI): void {
    console.log("[API Error]:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      error: apiError,
      originalError: error,
    });
  }
}
