import { ResponseAPI } from "@/core/interfaces/api.interface";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, SearchFallecidosRequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../entities/requisito-inhumacion.entity";
import { AxiosResponse } from "axios";


export interface RequisitoInhumacionRepository {
    findAll(): Promise<RequisitoInhumacionEntity[]>;
    findById(id: string): Promise<RequisitoInhumacionEntity>;
    create(requisitoInhumacion: CreateRequisitoInhumacionEntity): Promise<RequisitoInhumacionEntity>;
    update(requisitoInhumacion: UpdateRequisitoInhumacionEntity): Promise<RequisitoInhumacionEntity>;
    delete(id: string): Promise<void>;
    downloadPdf(id: string): Promise<Blob>;
    searchFallecidos(busqueda: string): Promise<SearchFallecidosRequisitoInhumacionEntity>;
    uploadDocuments(id: string, files: {
        solicitud_firmada?: File;
        cedula_solicitante?: File;
        certificado_defuncion_civil?: File;
        certificado_defuncion_medico?: File;
        titulo_propiedad?: File;
        comprobante_pago?: File;
        autorizacion_movilizacion?: File;
    }): Promise<AxiosResponse<ResponseAPI<unknown>>>;
}