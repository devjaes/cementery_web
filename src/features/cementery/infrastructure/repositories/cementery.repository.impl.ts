import { API_ROUTES } from "@/core/constants/api-routes";
import { CementeryModel } from "../models/cementery.model";
import { CementeryRepository } from "../../domain/repositories/cementery.repository";
import { CementeryEntity, CementeryCreateEntity, CementeryUpdateEntity } from "../../domain/entities/cementery.entity";
import { CementeryMapper } from "../mappers/cementery.mapper";
import AxiosClient from "@/core/infrastructure/axios-client";

export class CementeryRepositoryImpl implements CementeryRepository {
    private httpClient: AxiosClient;

    constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    static getInstance(): CementeryRepositoryImpl {
        return new CementeryRepositoryImpl();
    }

    async findAll(): Promise<CementeryEntity[]> {
        const {data} = await this.httpClient.get<CementeryModel[]>(API_ROUTES.CEMENTERIO.LIST);
        return data.data.map(CementeryMapper.toEntity);
    }

    async findById(id: string): Promise<CementeryEntity> {
        const {data} = await this.httpClient.get<CementeryModel>(API_ROUTES.CEMENTERIO.GET_BY_ID(id));
        return CementeryMapper.toEntity(data.data);
    }

    async findByName(nombre: string): Promise<CementeryEntity> {
        const {data} = await this.httpClient.get<CementeryModel>(API_ROUTES.CEMENTERIO.GET_BY_NAME(nombre));
        return CementeryMapper.toEntity(data.data);
    }

    async create(cementery: CementeryCreateEntity): Promise<CementeryEntity> {
        const model = CementeryMapper.toModel(cementery);
        const {data} = await this.httpClient.post<CementeryModel>(API_ROUTES.CEMENTERIO.CREATE, model);
        return CementeryMapper.toEntity(data.data);
    }

    async update(cementery: CementeryUpdateEntity): Promise<CementeryEntity> {
        const model = CementeryMapper.toUpdateModel(cementery);
        const {data} = await this.httpClient.patch<CementeryModel>(
            API_ROUTES.CEMENTERIO.UPDATE(model.id_cementerio),
            model
        );
        return CementeryMapper.toEntity(data.data);
    }

    async delete(id: string): Promise<CementeryEntity> {
        const {data} = await this.httpClient.delete<CementeryModel>(API_ROUTES.CEMENTERIO.DELETE(id));
        return CementeryMapper.toEntity(data.data);
    }
} 