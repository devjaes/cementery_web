import { CementeryEntity } from "@/features/cementery/domain/entities/cementery.entity";
import { HuecoEntity } from "@/features/huecos/domain/entities/hueco.entity";
import { NichoEntity } from "@/features/nichos/domain/entities/nicho.entity";
import { PersonEntity } from "@/features/person/domain/entities/person.entity";

export interface RequisitoInhumacionEntity {
  idRequsitoInhumacion: string;
  idCementerio: CementeryEntity;
  pantoneroACargo: string;
  metodoSolicitud: string;
  idSolicitante: PersonEntity;
  observacionSolicitante?: string;
  observacionCertificadoDefuncion?: string;
  copiaCertificadoDefuncion: boolean;
  observacionInformeEstadisticoINEC?: string;
  informeEstadisticoINEC: boolean;
  observacionCopiaCedula?: string;
  copiaCedula: boolean;
  observacionPagoTasaInhumacion?: string;
  pagoTasaInhumacion: boolean;
  observacionCopiaTituloPropiedadNicho?: string;
  copiaTituloPropiedadNicho: boolean;
  observacionAutorizacionMovilizacion?: string;
  autorizacionDeMovilizacionDelCadaver: boolean;
  observacionOficioSolicitud?: string;
  oficioDeSolicitud: boolean;
  idHuecoNicho: HuecoEntity;
  idFallecido: PersonEntity;
  fechaInhumacion: string;
  horaInhumacion: string;
  nombreAdministradorNicho: string;
}

export interface CreateRequisitoInhumacionEntity {
  idCementerio: string;
  pantoneroACargo: string;
  metodoSolicitud: string;
  idSolicitante: string;
  observacionSolicitante?: string;

  copiaCertificadoDefuncion: boolean;
  observacionCertificadoDefuncion?: string;

  informeEstadisticoINEC: boolean;
  observacionInformeEstadisticoINEC?: string;

  copiaCedula: boolean;
  observacionCopiaCedula?: string;

  pagoTasaInhumacion: boolean;
  observacionPagoTasaInhumacion?: string;

  copiaTituloPropiedadNicho: boolean;
  observacionCopiaTituloPropiedadNicho?: string;

  autorizacionDeMovilizacionDelCadaver: boolean;
  observacionAutorizacionMovilizacion?: string;

  idHuecoNicho: string;
  idFallecido: string;
  fechaInhumacion: string;

  oficioDeSolicitud: boolean;
  observacionOficioSolicitud?: string;

  nombreAdministradorNicho: string;

  horaInhumacion: string;
}

export interface UpdateRequisitoInhumacionEntity {
  idRequisitoInhumacion: string;
  copiaCertificadoDefuncion: boolean;
  observacionCertificadoDefuncion?: string;

  informeEstadisticoINEC: boolean;
  observacionInformeEstadisticoINEC?: string;

  copiaCedula: boolean;
  observacionCopiaCedula?: string;

  pagoTasaInhumacion: boolean;
  observacionPagoTasaInhumacion?: string;

  copiaTituloPropiedadNicho: boolean;
  observacionCopiaTituloPropiedadNicho?: string;

  autorizacionDeMovilizacionDelCadaver: boolean;
  observacionAutorizacionMovilizacion?: string;

  oficioDeSolicitud: boolean;
  observacionOficioSolicitud?: string;
}


export interface RequisitoInhumacionFallecidosEntity {
  fallecido: PersonEntity;
  requisitos: RequisitoInhumacionEntity[];
  nichos: NichoEntity[];
  cementerios: CementeryEntity[];
}

export interface SearchFallecidosRequisitoInhumacionEntity {
  terminoBusqueda: string;
  totalEncontrados: number;
  fallecidos: RequisitoInhumacionFallecidosEntity[];
}