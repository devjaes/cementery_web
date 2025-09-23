import AxiosClient from "@/core/infrastructure/axios-client";
import { CreateInhumacionEntity, InhumacionEntity, SearchFallecidosInhumacionEntity, UpdateInhumacionEntity} from "../../domain/entities/inhumacion.entity";
import { InhumacionModel, SearchFallecidosInhumacionModel } from "../models/inhumacion.model";
import { API_ROUTES } from "@/core/constants/api-routes";
import { InhumacionMapper } from "../mappers/inhumacion.mapper";
import { InhumacionRepository } from "../../domain/repositories/inhumacion.repository";
import { SearchFallecidosInhumacionMapper } from "../mappers/inhumacion-fallecido.mapper";

export class InhumacionRepositoryImpl implements InhumacionRepository {
    private httpClient: AxiosClient;

    constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    static getInstance(): InhumacionRepositoryImpl {
        return new InhumacionRepositoryImpl();
    }

    async findAll(): Promise<InhumacionEntity[]> {
        const { data } = await this.httpClient.get<InhumacionModel[]>(API_ROUTES.INHUMACIONES.LIST);
        return data.data.map(InhumacionMapper.toEntity);
    }

    async findById(id: string): Promise<InhumacionEntity> {
        const { data } = await this.httpClient.get<InhumacionModel>(API_ROUTES.INHUMACIONES.GET_BY_ID(id));

        console.log("InhumacionRepositoryImpl.findById", data);

        return InhumacionMapper.toEntity(data.data);
    }

    async create(inhumacion: CreateInhumacionEntity): Promise<InhumacionEntity> {
        const model = InhumacionMapper.toModel(inhumacion);
        const { data } = await this.httpClient.post<InhumacionModel>(API_ROUTES.INHUMACIONES.CREATE, model);
        return InhumacionMapper.toEntity(data.data);
    }

    async update(inhumacion: UpdateInhumacionEntity): Promise<InhumacionEntity> {
        const model = InhumacionMapper.toUpdateModel(inhumacion);
        const { data } = await this.httpClient.patch<InhumacionModel>(
            API_ROUTES.INHUMACIONES.UPDATE(model.id_inhumacion),
            model
        );
        return InhumacionMapper.toEntity(data.data);
    }

    async delete(id: string): Promise<void> {
        await this.httpClient.delete(API_ROUTES.INHUMACIONES.DELETE(id));
    }

    async searchFallecidos(busqueda: string): Promise<SearchFallecidosInhumacionEntity> {
        const { data } = await this.httpClient.get<SearchFallecidosInhumacionModel>(API_ROUTES.INHUMACIONES.SEARCH_FALLECIDOS(busqueda));
        return SearchFallecidosInhumacionMapper.toEntity(data.data);
    }
}