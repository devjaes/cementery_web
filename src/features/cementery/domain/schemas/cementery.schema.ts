import { z } from "zod";

export const CreateCementerySchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    telefono: z.string().min(1, "El teléfono es requerido"),
    responsable: z.string().min(1, "El responsable es requerido"),
});

export const UpdateCementerySchema = CreateCementerySchema.partial().extend({
    id_cementerio: z.string().uuid("ID de cementerio inválido"),
});

export type CreateCementeryDTO = z.infer<typeof CreateCementerySchema>;
export type UpdateCementeryDTO = z.infer<typeof UpdateCementerySchema>; 