import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { CreateRequisitoInhumacionModel, RequisitoInhumacionModel, UpdateRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { HuecoMapper } from "@/features/huecos/infrastructure/mappers/hueco.mapper";


export class RequisitoInhumacionMapper {
    static toModel(entity: import("../../domain/entities/requisito-inhumacion.entity").CreateRequisitoInhumacionEntity): import("../models/requisito-inhumacion.model").CreateRequisitoInhumacionModel {
        // Map Create entity -> Create model, keeping backend naming (snake/Pascal as defined in model)
        return {
            id_cementerio: entity.idCementerio,
            pantoneroACargo: entity.pantoneroACargo,
            // model has a small typo 'metodoSolictud' — map from entity.metodoSolicitud
            metodoSolictud: entity.metodoSolicitud,
            id_solicitante: entity.idSolicitante,
            observacionSolicitante: entity.observacionSolicitante || undefined,
            codigo_inhumacion: entity.codigoInhumacion || undefined,

            copiaCertificadoDefuncion: !!entity.copiaCertificadoDefuncion,
            observacionCertificadoDefuncion: entity.observacionCertificadoDefuncion || undefined,

            informeEstadisticoINEC: !!entity.informeEstadisticoINEC,
            observacionInformeEstadisticoINEC: entity.observacionInformeEstadisticoINEC || undefined,

            copiaCedula: !!entity.copiaCedula,
            observacionCopiaCedula: entity.observacionCopiaCedula || undefined,

            pagoTasaInhumacion: !!entity.pagoTasaInhumacion,
            observacionPagoTasaInhumacion: entity.observacionPagoTasaInhumacion || undefined,

            copiaTituloPropiedadNicho: !!entity.copiaTituloPropiedadNicho,
            observacionCopiaTituloPropiedadNicho: entity.observacionCopiaTituloPropiedadNicho || undefined,

            autorizacionDeMovilizacionDelCadaver: !!entity.autorizacionDeMovilizacionDelCadaver,
            observacionAutorizacionMovilizacion: entity.observacionAutorizacionMovilizacion || undefined,

            OficioDeSolicitud: !!entity.oficioDeSolicitud,
            observacionOficioSolicitud: entity.observacionOficioSolicitud || undefined,

            id_hueco_nicho: entity.idHuecoNicho,
            id_fallecido: entity.idFallecido,
            fechaInhumacion: entity.fechaInhumacion,
            horaInhumacion: entity.horaInhumacion,
            nombreAdministradorNicho: entity.nombreAdministradorNicho,
        };
    }
    static toEntity(data: RequisitoInhumacionModel): RequisitoInhumacionEntity {
        // Safely extract codigoInhumacion supporting both API shapes: codigoInhumacion or codigo_inhumacion
        const maybeCodigo = ((): string | undefined => {
            const record = data as unknown as Record<string, unknown>;
            const a = record["codigoInhumacion"];
            if (typeof a === "string") return a;
            const b = record["codigo_inhumacion"];
            if (typeof b === "string") return b;

            // Try nested inhumacion -> codigo_inhumacion
            const inh = (record["inhumacion"] as unknown) as Record<string, unknown> | undefined;
            if (inh) {
                const c = inh["codigo_inhumacion"];
                if (typeof c === "string") return c;
                const d = inh["codigoInhumacion"];
                if (typeof d === "string") return d;
            }

            return undefined;
        })();

        // Helper to read boolean-like fields supporting multiple naming conventions
        const readBool = (rec: Record<string, unknown>, keyCamel: string, keySnake?: string): boolean => {
            const snake = keySnake ?? keyCamel.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
            // also support PascalCase keys returned by some backends (e.g. `OficioDeSolicitud`)
            const pascal = keyCamel.charAt(0).toUpperCase() + keyCamel.slice(1);

            const a = rec[keyCamel];
            if (typeof a === "boolean") return a;
            if (a === "true" || a === "1") return true;
            if (a === "false" || a === "0") return false;

            const p = rec[pascal];
            if (typeof p === "boolean") return p;
            if (p === "true" || p === "1") return true;
            if (p === "false" || p === "0") return false;

            const b = rec[snake];
            if (typeof b === "boolean") return b;
            if (b === "true" || b === "1") return true;
            if (b === "false" || b === "0") return false;
            return false;
        };

        const rec = data as unknown as Record<string, unknown>;

        return {
            codigoInhumacion: maybeCodigo,
            idRequsitoInhumacion: data.id_requsitoInhumacion,
            idCementerio: CementeryMapper.toEntity(data.id_cementerio),
            pantoneroACargo: (rec["pantoneroACargo"] ?? rec["pantonero_a_cargo"]) as string,
            metodoSolicitud: (rec["metodoSolicitud"] ?? rec["metodo_solicitud"]) as string,
            idSolicitante: PersonMapper.toEntity(data.id_solicitante),
            observacionSolicitante: (rec["observacionSolicitante"] ?? rec["observacion_solicitante"]) as string,
            copiaCertificadoDefuncion: readBool(rec, "copiaCertificadoDefuncion", "copia_certificado_defuncion"),
            observacionCertificadoDefuncion: (rec["observacionCertificadoDefuncion"] ?? rec["observacion_certificado_defuncion"]) as string,
            informeEstadisticoINEC: readBool(rec, "informeEstadisticoINEC", "informe_estadistico_inec"),
            observacionInformeEstadisticoINEC: (rec["observacionInformeEstadisticoINEC"] ?? rec["observacion_informe_estadistico_inec"]) as string,
            copiaCedula: readBool(rec, "copiaCedula", "copia_cedula"),
            observacionCopiaCedula: (rec["observacionCopiaCedula"] ?? rec["observacion_copia_cedula"]) as string,
            pagoTasaInhumacion: readBool(rec, "pagoTasaInhumacion", "pago_tasa_inhumacion"),
            observacionPagoTasaInhumacion: (rec["observacionPagoTasaInhumacion"] ?? rec["observacion_pago_tasa_inhumacion"]) as string,
            copiaTituloPropiedadNicho: readBool(rec, "copiaTituloPropiedadNicho", "copia_titulo_propiedad_nicho"),
            observacionCopiaTituloPropiedadNicho: (rec["observacionCopiaTituloPropiedadNicho"] ?? rec["observacion_copia_titulo_propiedad_nicho"]) as string,
            autorizacionDeMovilizacionDelCadaver: readBool(rec, "autorizacionDeMovilizacionDelCadaver", "autorizacion_de_movilizacion_del_cadaver"),
            observacionAutorizacionMovilizacion: (rec["observacionAutorizacionMovilizacion"] ?? rec["observacion_autorizacion_movilizacion"]) as string,
            oficioDeSolicitud: readBool(rec, "oficioDeSolicitud", "oficio_de_solicitud"),
            observacionOficioSolicitud: (rec["observacionOficioSolicitud"] ?? rec["observacion_oficio_solicitud"]) as string,
            idHuecoNicho: HuecoMapper.toEntity(data.id_hueco_nicho),
            idFallecido: PersonMapper.toEntity(data.id_fallecido),
            fechaInhumacion: (rec["fechaInhumacion"] ?? rec["fecha_inhumacion"]) as string,
            horaInhumacion: (rec["horaInhumacion"] ?? rec["hora_inhumacion"]) as string,
            nombreAdministradorNicho: (rec["nombreAdministradorNicho"] ?? rec["nombre_administrador_nicho"]) as string,
        };
    }

    static toUpdateModel(entity: UpdateRequisitoInhumacionEntity): UpdateRequisitoInhumacionModel{
        // Build a flexible payload (as any) to support multiple backend naming conventions
        const out: any = {
            id_requisitoInhumacion: entity.idRequisitoInhumacion,
            copiaCertificadoDefuncion: entity.copiaCertificadoDefuncion,
            observacionCertificadoDefuncion: entity.observacionCertificadoDefuncion || "",

            informeEstadisticoINEC: entity.informeEstadisticoINEC,
            observacionInformeEstadisticoINEC: entity.observacionInformeEstadisticoINEC || "",

            copiaCedula: entity.copiaCedula,
            observacionCopiaCedula: entity.observacionCopiaCedula || "",

            pagoTasaInhumacion: entity.pagoTasaInhumacion,
            observacionPagoTasaInhumacion: entity.observacionPagoTasaInhumacion || "",

            copiaTituloPropiedadNicho: entity.copiaTituloPropiedadNicho,
            observacionCopiaTituloPropiedadNicho: entity.observacionCopiaTituloPropiedadNicho || "",

            autorizacionDeMovilizacionDelCadaver: entity.autorizacionDeMovilizacionDelCadaver,
            observacionAutorizacionMovilizacion: entity.observacionAutorizacionMovilizacion || "",
        };

        // Support multiple naming conventions for the backend: camelCase, snake_case and legacy PascalCase
        out.OficioDeSolicitud = entity.oficioDeSolicitud;
        out.oficioDeSolicitud = entity.oficioDeSolicitud;
        out.oficio_de_solicitud = entity.oficioDeSolicitud;
        out.observacionOficioSolicitud = entity.observacionOficioSolicitud || "";

        // Include related fields so backend can update linked inhumación if required
        out.id_hueco_nicho = (entity as any).idHuecoNicho ?? undefined;
        out.id_fallecido = (entity as any).idFallecido ?? undefined;
        out.fechaInhumacion = (entity as any).fechaInhumacion ?? undefined;
        out.horaInhumacion = (entity as any).horaInhumacion ?? undefined;
        out.nombreAdministradorNicho = (entity as any).nombreAdministradorNicho ?? undefined;
        out.codigoInhumacion = (entity as any).codigoInhumacion ?? undefined;

        return out as UpdateRequisitoInhumacionModel;
    }

}
