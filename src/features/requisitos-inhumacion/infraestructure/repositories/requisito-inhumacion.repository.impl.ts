import AxiosClient from "@/core/infrastructure/axios-client";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, SearchFallecidosRequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { RequisitoInhumacionModel, SearchFallecidosRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { RequisitoInhumacionMapper } from "../mappers/requisito-inhumacion.mapper";
import { API_ROUTES } from "@/core/constants/api-routes";
import { RequisitoInhumacionRepository } from "../../domain/repositories/requisito-inhumacion.repository";
import { AxiosResponse } from "axios";
import { SearchFallecidosRequisitoInhumacionMapper } from "../mappers/requisito-inhumacion-fallecido.mapper";
import { ResponseAPI } from "@/core/interfaces/api.interface";


export class RequisitoInhumacionRepositoryImpl implements RequisitoInhumacionRepository {
    private httpClient: AxiosClient;

    constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    static getInstance(): RequisitoInhumacionRepositoryImpl {
        return new RequisitoInhumacionRepositoryImpl();
    }

    async findAll(): Promise<RequisitoInhumacionEntity[]> {
        const { data } = await this.httpClient.get<RequisitoInhumacionModel[]>(API_ROUTES.REQUISITOS_INHUMACION.LIST);
        return data.data.map(RequisitoInhumacionMapper.toEntity);
    }

    async findById(id: string): Promise<RequisitoInhumacionEntity> {
        const { data } = await this.httpClient.get<RequisitoInhumacionModel>(API_ROUTES.REQUISITOS_INHUMACION.GET_BY_ID(id));
        return RequisitoInhumacionMapper.toEntity(data.data);
    }

    async create(requisitoInhumacion: CreateRequisitoInhumacionEntity): Promise<RequisitoInhumacionEntity> {
        const model = RequisitoInhumacionMapper.toModel(requisitoInhumacion);
        const { data } = await this.httpClient.post<RequisitoInhumacionModel>(API_ROUTES.REQUISITOS_INHUMACION.CREATE, model);
        return RequisitoInhumacionMapper.toEntity(data.data);
    }


    async update(requisitoInhumacion: UpdateRequisitoInhumacionEntity): Promise<RequisitoInhumacionEntity> {
        const model = RequisitoInhumacionMapper.toUpdateModel(requisitoInhumacion);
        const { data } = await this.httpClient.patch<RequisitoInhumacionModel>(
            API_ROUTES.REQUISITOS_INHUMACION.UPDATE(model.id_requisitoInhumacion),
            model
        );
        return RequisitoInhumacionMapper.toEntity(data.data);
    }

    async delete(id: string): Promise<void> {
        await this.httpClient.delete(API_ROUTES.REQUISITOS_INHUMACION.DELETE(id));
    }


    async downloadPdf(id: string): Promise<Blob> {
        const response = await this.httpClient.get(API_ROUTES.REQUISITOS_INHUMACION.DOWNLOAD_PDF(id), {
            responseType: "blob",
        }) as AxiosResponse<Blob>;
        
        return response.data;
    }

    async searchFallecidos(busqueda: string): Promise<SearchFallecidosRequisitoInhumacionEntity> {
        const { data } = await this.httpClient.get<SearchFallecidosRequisitoInhumacionModel>(API_ROUTES.REQUISITOS_INHUMACION.SEARCH_FALLECIDOS(busqueda));
        return SearchFallecidosRequisitoInhumacionMapper.toEntity(data.data);
    }

    async uploadDocuments(id: string, files: {
        solicitud_firmada?: File;
        cedula_solicitante?: File;
        certificado_defuncion_civil?: File;
        certificado_defuncion_medico?: File;
        titulo_propiedad?: File;
        comprobante_pago?: File;
        autorizacion_movilizacion?: File;
    }): Promise<AxiosResponse<ResponseAPI<unknown>>> {
        const form = new FormData();
        // Agregar solo las claves que tengan archivo
        (Object.entries(files) as [string, File | undefined][]).forEach(([key, file]) => {
            if (file) {
                form.append(key, file);
            }
        });

        // Use postForm so Axios handles the multipart/form-data headers and boundary correctly
        return await this.httpClient.postForm(
            API_ROUTES.REQUISITOS_INHUMACION.UPLOAD_DOCUMENTS(id),
            form
        );
    }

    /**
     * Subir documento consolidado para un requisito de inhumación
     * Endpoint backend: POST /requisitos-inhumacion/:id/documentos (campo: documento_consolidado)
     */
    async uploadConsolidatedDocumentForRequisito(id: string, file?: File): Promise<AxiosResponse<ResponseAPI<unknown>>> {
        const form = new FormData();
        if (file) {
            form.append('documento_consolidado', file);
        }

        // Post to requisitos-inhumacion/:id/documentos
        const url = `requisitos-inhumacion/${id}/documentos`;
        // debug: show the final URL used by AxiosClient (useful in devtools)
        console.log("[repo] uploadConsolidatedDocumentForRequisito -> POST", this.httpClient.getUri ? this.httpClient.getUri({ url }) : url);
        // use postForm so Axios sets the correct multipart/form-data headers
        return await this.httpClient.postForm(url, form);
    }
}