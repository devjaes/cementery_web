import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { CreateRequisitoInhumacionModel, RequisitoInhumacionModel, UpdateRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { HuecoMapper } from "@/features/huecos/infrastructure/mappers/hueco.mapper";


export class RequisitoInhumacionMapper {
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
            const a = rec[keyCamel];
            if (typeof a === "boolean") return a;
            if (a === "true" || a === "1") return true;
            if (a === "false" || a === "0") return false;
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

    static toModel(entity: CreateRequisitoInhumacionEntity): CreateRequisitoInhumacionModel{
        return {
            codigo_inhumacion: entity.codigoInhumacion,
            id_cementerio: entity.idCementerio,
            pantoneroACargo: entity.pantoneroACargo,
            metodoSolictud: entity.metodoSolicitud,
            id_solicitante: entity.idSolicitante,
            observacionSolicitante: entity.observacionSolicitante || "",

            copiaCertificadoDefuncion: entity.copiaCertificadoDefuncion ,
            observacionCertificadoDefuncion: entity.observacionCertificadoDefuncion || "",

            informeEstadisticoINEC: entity.informeEstadisticoINEC ,
            observacionInformeEstadisticoINEC: entity.observacionInformeEstadisticoINEC,

            copiaCedula: entity.copiaCedula ,
            observacionCopiaCedula: entity.observacionCopiaCedula || "",

            pagoTasaInhumacion: entity.pagoTasaInhumacion,
            observacionPagoTasaInhumacion: entity.observacionPagoTasaInhumacion || "",

            copiaTituloPropiedadNicho: entity.copiaTituloPropiedadNicho,
            observacionCopiaTituloPropiedadNicho: entity.observacionCopiaTituloPropiedadNicho || "",

            autorizacionDeMovilizacionDelCadaver: entity.autorizacionDeMovilizacionDelCadaver,
            observacionAutorizacionMovilizacion: entity.observacionAutorizacionMovilizacion || "",

            OficioDeSolicitud: entity.oficioDeSolicitud,
            observacionOficioSolicitud: entity.observacionOficioSolicitud || "",
            
            id_hueco_nicho: entity.idHuecoNicho,
            id_fallecido: entity.idFallecido,
            fechaInhumacion: entity.fechaInhumacion,
            horaInhumacion: entity.horaInhumacion,
            
            nombreAdministradorNicho: entity.nombreAdministradorNicho,
        }
    }

    static toUpdateModel(entity: UpdateRequisitoInhumacionEntity): UpdateRequisitoInhumacionModel{
        return {
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

            OficioDeSolicitud: entity.oficioDeSolicitud,
            observacionOficioSolicitud: entity.observacionOficioSolicitud || "",
        }

    }
}
