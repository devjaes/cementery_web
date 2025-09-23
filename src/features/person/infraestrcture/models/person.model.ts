export interface PersonModel {
    id_persona: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    fecha_defuncion: string | null;
    fecha_inhumacion: string | null;
    lugar_defuncion: string | null;
    causa_defuncion: string | null;
    fallecido: boolean;
    nacionalidad?: string | null;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
}

export interface CreatePersonModel {
    cedula: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    fecha_defuncion?: string | null;
    fecha_inhumacion?: string | null;
    lugar_defuncion?: string | null;
    causa_defuncion?: string | null;
    fallecido: boolean;
    nacionalidad?: string | null;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
}

export interface UpdatePersonModel {
    id_persona: string;
    cedula?: string;
    nombres?: string;
    apellidos?: string;
    fecha_nacimiento?: string;
    fecha_defuncion?: string | null;
    fecha_inhumacion?: string | null;
    lugar_defuncion?: string | null;
    causa_defuncion?: string | null;
    fallecido?: boolean;
    nacionalidad?: string | null;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
}