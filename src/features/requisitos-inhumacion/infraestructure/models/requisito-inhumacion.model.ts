import { CementeryModel } from "@/features/cementery/infrastructure/models/cementery.model";
import { HuecoModel } from "@/features/huecos/infrastructure/models/hueco.model";
import { NichoModel } from "@/features/nichos/infrastructure/models/nicho.model";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";

export interface RequisitoInhumacionModel {
  id_requsitoInhumacion: string;
  id_cementerio: CementeryModel;
  pantoneroACargo: string;
  metodoSolicitud: string;
  id_solicitante: PersonModel;
  observacionSolicitante: string;
  observacionCertificadoDefuncion?: string;
  copiaCertificadoDefuncion: boolean;
  observacionInformeEstadisticoINEC?: string;
  informeEstadisticoINEC: boolean;
  observacionCopiaCedula?: string;
  copiaCedula: boolean;
  observacionPagoTasaInhumacion?: string;
  pagoTasaInhumacion: boolean;
  observacionOficioSolicitud?: string;
  OficioDeSolicitud: boolean;
  observacionAutorizacionMovilizacion?: string;
  autorizacionDeMovilizacionDelCadaver: boolean;
  observacionCopiaTituloPropiedadNicho?: string;
  copiaTituloPropiedadNicho: boolean;
  id_hueco_nicho: HuecoModel;
  id_fallecido: PersonModel;
  fechaInhumacion: string;
  horaInhumacion: string;
  nombreAdministradorNicho: string;
}

export interface CreateRequisitoInhumacionModel {
  id_cementerio: string;
  pantoneroACargo: string;
  metodoSolictud: string;
  id_solicitante: string;
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

  OficioDeSolicitud: boolean;
  observacionOficioSolicitud?: string;

  id_hueco_nicho: string;
  id_fallecido: string;
  fechaInhumacion: string;
  horaInhumacion: string;

  nombreAdministradorNicho: string;
}

export interface UpdateRequisitoInhumacionModel {
  id_requisitoInhumacion: string;
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

  OficioDeSolicitud: boolean;
  observacionOficioSolicitud?: string;
  
}

export interface RequisitoInhumacionFallecidosModel {
  fallecido: PersonModel;
  requisitos: RequisitoInhumacionModel[];
  nichos: NichoModel[];
  cementerios: CementeryModel[];
}

export interface SearchFallecidosRequisitoInhumacionModel {
  termino_busqueda: string;
  total_encontrados: number;
  fallecidos: RequisitoInhumacionFallecidosModel[];
}