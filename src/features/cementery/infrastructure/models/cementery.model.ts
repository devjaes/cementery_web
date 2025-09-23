export interface CementeryModel {
    id_cementerio: string;
    nombre: string;
    direccion: string;
    telefono: string;
    responsable: string;
    estado: string;
    fecha_creacion: string;
    fecha_modificacion: string | null;
}

export interface CementeryCreateModel {
    nombre: string;
    direccion: string;
    telefono: string;
    responsable: string;
}

export interface CementeryUpdateModel {
    id_cementerio: string;
    nombre?: string;
    direccion?: string;
    telefono?: string;
    responsable?: string;
} 