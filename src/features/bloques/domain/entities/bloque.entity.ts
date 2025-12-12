export interface BloqueEntity {
  idBloque: string;
  idCementerio: string;
  nombre: string;
  descripcion: string | null;
  numero?: number | null;
  tipoBloque?: string | null;
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
  numero?: number;
  tipoBloque?: string;
  numeroFilas: number;
  numeroColumnas: number;
}

export interface BloqueUpdateEntity {
  idBloque: string;
  nombre?: string;
  descripcion?: string;
  numero?: number | null;
  numeroFilas?: number;
  numeroColumnas?: number;
}

export interface BloqueWithNichosEntity {
  bloque: BloqueEntity;
  nichos: any[]; // Se mapeará a NichoEntity en el hook
  totalNichos: number;
  capacidadTotal: number;
  espaciosDisponibles: number;
}
