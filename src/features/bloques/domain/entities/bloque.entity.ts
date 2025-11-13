export interface BloqueEntity {
  idBloque: string;
  idCementerio: string;
  nombre: string;
  descripcion: string | null;
  numeroFilas: number;
  numeroColumnas: number;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export interface BloqueCreateEntity {
  idCementerio: string;
  nombre: string;
  descripcion?: string;
  numeroFilas: number;
  numeroColumnas: number;
}

export interface BloqueUpdateEntity {
  idBloque: string;
  nombre?: string;
  descripcion?: string;
  numeroFilas?: number;
  numeroColumnas?: number;
}
