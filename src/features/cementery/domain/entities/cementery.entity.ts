export interface CementeryEntity {
    idCementerio: string;
    nombre: string;
    direccion: string;
    telefono: string;
    responsable: string;
    estado: string;
    fechaCreacion: string;
    fechaModificacion: string | null;
}

export interface CementeryCreateEntity {
    nombre: string;
    direccion: string;
    telefono: string;
    responsable: string;
}

export interface CementeryUpdateEntity {
    idCementerio: string;
    nombre?: string;
    direccion?: string;
    telefono?: string;
    responsable?: string;
} 