export interface BloqueModel {
  id_bloque: string;
  id_cementerio: string;
  nombre: string;
  descripcion: string | null;
  numero?: number | null;
  numero_filas: number;
  numero_columnas: number;
  tipo_bloque?: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string | null;
}

export interface BloqueCreateModel {
  id_cementerio: string;
  nombre: string;
  descripcion?: string;
  numero?: number;
  numero_filas: number;
  numero_columnas: number;
  tipo_bloque?: string;
}

export interface BloqueUpdateModel {
  id_bloque: string;
  nombre?: string;
  descripcion?: string;
  numero?: number | null;
  numero_filas?: number;
  numero_columnas?: number;
}
