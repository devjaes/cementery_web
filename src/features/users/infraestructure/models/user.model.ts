import { UserRole, UserStatus } from "@/features/users/domain/enums";

interface UserBase {
    id_user: string;
    id_cementerio_pert: string;
    cedula: string;
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    rol: UserRole;
    fecha_creacion: string;
    fecha_modificacion: string | null;
    estado: UserStatus;
}

export interface User extends UserBase {
    id: string;
}

export interface UserCreate extends 
    Pick<UserBase, 'cedula' | 'email' | 'nombre' | 'apellido' | 'password'> {
    id_cementerio_pert: string;
}

export type UserUpdate = Partial<UserCreate>;