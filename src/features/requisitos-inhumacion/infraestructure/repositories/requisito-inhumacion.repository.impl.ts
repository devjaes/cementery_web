import AxiosClient from "@/core/infrastructure/axios-client";
import { CreateRequisitoInhumacionEntity, RequisitoInhumacionEntity, SearchFallecidosRequisitoInhumacionEntity, UpdateRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { RequisitoInhumacionModel, SearchFallecidosRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { RequisitoInhumacionMapper } from "../mappers/requisito-inhumacion.mapper";
import { API_ROUTES } from "@/core/constants/api-routes";
import { RequisitoInhumacionRepository } from "../../domain/repositories/requisito-inhumacion.repository";
import { AxiosResponse } from "axios";
import { SearchFallecidosRequisitoInhumacionMapper } from "../mappers/requisito-inhumacion-fallecido.mapper";


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
}