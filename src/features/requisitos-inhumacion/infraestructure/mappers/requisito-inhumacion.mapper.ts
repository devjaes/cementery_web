import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { CreateRequisitoInhumacionModel, RequisitoInhumacionModel, UpdateRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { HuecoMapper } from "@/features/huecos/infrastructure/mappers/hueco.mapper";


export class RequisitoInhumacionMapper {
    static toEntity(data: RequisitoInhumacionModel): RequisitoInhumacionEntity {
        return {
            idRequsitoInhumacion: data.id_requsitoInhumacion,
            idCementerio: CementeryMapper.toEntity(data.id_cementerio),
            pantoneroACargo: data.pantoneroACargo,
            metodoSolicitud: data.metodoSolicitud,
            idSolicitante: PersonMapper.toEntity( data.id_solicitante),
            observacionSolicitante: data.observacionSolicitante,
            copiaCertificadoDefuncion: data.copiaCertificadoDefuncion,
            observacionCertificadoDefuncion: data.observacionCertificadoDefuncion,
            informeEstadisticoINEC: data.informeEstadisticoINEC,
            observacionInformeEstadisticoINEC: data.observacionInformeEstadisticoINEC,
            copiaCedula: data.copiaCedula,
            observacionCopiaCedula: data.observacionCopiaCedula,
            pagoTasaInhumacion: data.pagoTasaInhumacion,
            observacionPagoTasaInhumacion: data.observacionPagoTasaInhumacion,
            copiaTituloPropiedadNicho: data.copiaTituloPropiedadNicho,
            observacionCopiaTituloPropiedadNicho: data.observacionCopiaTituloPropiedadNicho,
            autorizacionDeMovilizacionDelCadaver: data.autorizacionDeMovilizacionDelCadaver,
            observacionAutorizacionMovilizacion: data.observacionAutorizacionMovilizacion,
            oficioDeSolicitud: data.OficioDeSolicitud,
            observacionOficioSolicitud: data.observacionOficioSolicitud,
            idHuecoNicho: HuecoMapper.toEntity( data.id_hueco_nicho),
            idFallecido: PersonMapper.toEntity( data.id_fallecido),
            fechaInhumacion: data.fechaInhumacion,
            horaInhumacion: data.horaInhumacion,
            nombreAdministradorNicho: data.nombreAdministradorNicho,
        };
    }

    static toModel(entity: CreateRequisitoInhumacionEntity): CreateRequisitoInhumacionModel{
        return {
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
