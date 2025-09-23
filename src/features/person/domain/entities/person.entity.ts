export interface PersonEntity {
    id_persona: string;
    cedula:string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    fecha_defuncion: string| null;
    fecha_inhumacion: string | null;
    lugar_defuncion: string| null;
    causa_defuncion: string | null;
    fallecido: boolean;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
    nacionalidad?: string | null;
}

export interface CreatePersonEntity{
    cedula: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    fecha_defuncion?: string | null;
    fecha_inhumacion?: string | null;
    lugar_defuncion?: string | null;
    causa_defuncion?: string | null;
    nacionalidad?: string | null;
    fallecido: boolean;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
}

export interface UpdatePersonEntity {
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


export interface PersonSearchEntity {
    terminoBusqueda: string;
    totalEncontrados: number;
    personas: PersonEntity[];
}