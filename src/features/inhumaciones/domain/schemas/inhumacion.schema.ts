import {z} from "zod";
export const CreateInhumacionSchema = z.object({
    idNicho: z.string().uuid("El nicho es requerido y debe ser un UUID válido"),
    idFallecido: z.string().uuid("El fallecido es requerido y debe ser un UUID válido"),
    fechaInhumacion: z.string().min(1, "La fecha de inhumación es requerida"),
    horaInhumacion: z.string().min(1, "La hora de inhumación es requerida"),
    solicitante: z.string().min(1, "El solicitante es requerido").max(100, "Máximo 100 caracteres"),
    responsableInhumacion: z.string().min(1, "El responsable de inhumación es requerido").max(100, "Máximo 100 caracteres"),
    observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),
    estado: z.enum(["Realizada", "Pendiente" ], { message: "Estado inválido" }),
    codigoInhumacion: z.string().min(1, "El código de inhumación es requerido").max(50, "Máximo 50 caracteres"),

});

export const UpdateInhumacionSchema = CreateInhumacionSchema.partial().extend({
    idInhumacion: z.string().uuid("ID de inhumación inválido"),
});

export type CreateInhumacionDTO = z.infer<typeof CreateInhumacionSchema>;
export type UpdateInhumacionDTO = z.infer<typeof UpdateInhumacionSchema>;