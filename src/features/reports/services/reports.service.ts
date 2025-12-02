import AxiosClient from "@/core/infrastructure/axios-client";

export interface OwnerReport {
  id_propietario_nicho: string;
  fecha_adquisicion: string;
  tipo_documento: string;
  numero_documento: string;
  activo: boolean;
  razon: string;
  tipo: string;
  id_persona: {
    nombres: string;
    apellidos: string;
    cedula: string;
    telefono: string;
    correo: string;
  };
  id_nicho: {
    numero: string;
    tipo: string;
    fila: number;
    columna: number;
    id_bloque: {
      numero: number;
      nombre: string;
    };
  };
}

export interface DeceasedReport {
  id_inhumacion: string;
  fecha_inhumacion: string;
  hora_inhumacion: string;
  solicitante: string;
  responsable_inhumacion: string;
  observaciones: string;
  estado: string;
  codigo_inhumacion: string;
  id_fallecido: {
    nombres: string;
    apellidos: string;
    cedula: string;
    fecha_defuncion: string;
    causa_defuncion: string;
  };
  id_nicho: {
    numero: string;
    tipo: string;
    fila: number;
    columna: number;
    id_bloque: {
      numero: number;
      nombre: string;
    };
  };
}

export interface DeceasedFilters {
  startDate?: string;
  endDate?: string;
  nicheId?: string;
  cause?: string;
}

export const reportsService = {
  getOwners: async (): Promise<OwnerReport[]> => {
    const client = AxiosClient.getInstance();
    const { data } = await client.get<OwnerReport[]>("/reports/owners");
    return data.data;
  },

  getDeceased: async (filters: DeceasedFilters): Promise<DeceasedReport[]> => {
    const client = AxiosClient.getInstance();
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.nicheId) params.append("nicheId", filters.nicheId);
    if (filters.cause) params.append("cause", filters.cause);

    const { data } = await client.get<DeceasedReport[]>(
      `/reports/deceased?${params.toString()}`
    );
    return data.data;
  },
};
