import { z } from "zod";

export const CreateMejoraSchema = z.object({
  idCementerio: z.string().uuid("El cementerio es requerido y debe ser un UUID válido"),
  id_nicho: z.string().uuid().nullish(),
  panteoneroACargo: z.string().min(1, "El panteonero a cargo es requerido").max(150, "Máximo 150 caracteres"),
  metodoSolicitud: z.enum(["escrito", "verbal"], {
    required_error: "El método de solicitud es requerido",
  }),

  id_solicitante: z.string().uuid("El solicitante es requerido"),
  solicitanteDireccion: z.string().max(200).nullish(),
  solicitanteTelefono: z.string().max(30).nullish(),
  solicitanteCorreo: z.string().email("Formato de correo inválido").max(100).nullish(),
  observacionSolicitante: z.string().max(200).nullish(),

  id_fallecido: z.string().uuid().nullish(),
  fechaFallecimiento: z.string().nullish(),

  propietarioNicho: z.string().max(200).nullish(),
  propietarioNombre: z.string().max(200).nullish(),
  propietarioFechaAdquisicion: z.string().nullish(),
  propietarioTipoTenencia: z.string().max(50).nullish(),
  numeroNichos: z.coerce.number().int().min(0).nullish(),
  lugarNicho: z.string().max(100).nullish(),
  codigoSitio: z.string().max(120).nullish(),
  administradorNicho: z.string().max(120).nullish(),
  esPropio: z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      if (v === true || v === false) return v;
      if (typeof v === "string") return v.toLowerCase() === "true";
      return Boolean(v);
    }, z.boolean().nullish()),
  observacionNicho: z.string().max(200).nullish(),

  tipoServicio: z.enum(["ARREGLOS", "CONSTRUCCION", "LAPIDA"], {
    required_error: "El tipo de servicio es requerido",
  }),
  observacionServicio: z.string().max(200).nullish(),
  fechaInicio: z.string().nullish(),
  fechaFin: z.string().nullish(),
  horarioTrabajo: z.string().max(120).nullish(),

  entidad: z.string().min(1, "La entidad emisora es requerida").max(150),
  codigoAutorizacion: z.string().max(150).nullish(),
  condicion: z.string().max(200).nullish(),
  autorizacionTexto: z.string().max(200).nullish(),
  normativaAplicable: z.string().max(200).nullish(),
  obligacionesPostObra: z.string().max(200).nullish(),
  escombreraMunicipal: z.string().max(200).nullish(),
  direccionEntidad: z.string().max(200).nullish(),
});

export type CreateMejoraDTO = z.infer<typeof CreateMejoraSchema>;


