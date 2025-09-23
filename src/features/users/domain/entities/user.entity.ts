import { UserRole, UserStatus } from "@/features/users/domain/enums";

export interface UserEntity {
    id: string;
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