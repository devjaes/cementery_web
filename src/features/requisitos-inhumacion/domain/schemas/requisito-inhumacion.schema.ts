import { z } from "zod";

export const CreateRequisitoInhumacionSchema = z.object({
    idCementerio: z.string().uuid("El cementerio es requerido y debe ser un UUID válido"),
    pantoneroACargo: z.string().min(1, "El pantonero a cargo es requerido").max(100, "Máximo 100 caracteres"),
    metodoSolicitud: z.string().min(1, "El método de solicitud es requerido").max(50, "Máximo 50 caracteres"),
    idSolicitante: z.string().uuid("El solicitante es requerido y debe ser un UUID válido"),
    observacionSolicitante: z.string().max(500, "Máximo 500 caracteres").optional(),
    
    copiaCertificadoDefuncion: z.boolean(),
    observacionCertificadoDefuncion: z.string().optional(),
    
    informeEstadisticoINEC: z.boolean(),
    observacionInformeEstadisticoINEC: z.string().optional(),
    
    copiaCedula: z.boolean(),
    observacionCopiaCedula: z.string().optional(),
    
    pagoTasaInhumacion: z.boolean(),
    observacionPagoTasaInhumacion: z.string().optional(),
    
    copiaTituloPropiedadNicho: z.boolean(),
    observacionCopiaTituloPropiedadNicho: z.string().optional(),
    
    oficioDeSolicitud: z.boolean(),
    observacionOficioSolicitud: z.string().optional(),
    
    autorizacionDeMovilizacionDelCadaver: z.boolean(),
    observacionAutorizacionMovilizacion: z.string().optional(),
    
    idHuecoNicho: z.string().uuid("El hueco de nicho es requerido y debe ser un UUID válido"),
    idFallecido: z.string().uuid("El fallecido es requerido y debe ser un UUID válido"),
    fechaInhumacion: z.string().min(1, "La fecha de inhumación es requerida"),
    horaInhumacion: z.string().min(1, "La hora de inhumación es requerida"),
    nombreAdministradorNicho: z.string().min(1, "El nombre del administrador del nicho es requerido").max(100, "Máximo 100 caracteres"),
});

export const UpdateRequisitoInhumacionSchema = CreateRequisitoInhumacionSchema.partial().extend({
    idRequisitoInhumacion: z.string().uuid("ID de requisito de inhumación inválido"),
});

export type CreateRequisitoInhumacionDTO = z.infer<typeof CreateRequisitoInhumacionSchema>;
export type UpdateRequisitoInhumacionDTO = z.infer<typeof UpdateRequisitoInhumacionSchema>;