
import {z} from "zod";
export const CreatePersonSchema = z.object({
    cedula: z.string().min(1, "La cédula es requerida").max(20, "Máximo 20 caracteres"),
    nombres: z.string().min(1, "Los nombres son requeridos").max(50, "Máximo 50 caracteres"),
    apellidos: z.string().min(1, "Los apellidos son requeridos").max(50, "Máximo 50 caracteres"),
    fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
    fecha_defuncion: z.string().optional(),
    fecha_inhumacion: z.string().optional(),
    lugar_defuncion: z.string().optional(),
    causa_defuncion: z.string().optional(),
    nacionalidad: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    correo: z.string().email("Correo electrónico inválido").optional(),
    fallecido: z.boolean(),
});

export const UpdatePersonSchema = CreatePersonSchema.partial().extend({
    id_persona: z.string().uuid("ID de persona inválido"),
});
export type CreatePersonDTO = z.infer<typeof CreatePersonSchema>;
export type UpdatePersonDTO = z.infer<typeof UpdatePersonSchema>;