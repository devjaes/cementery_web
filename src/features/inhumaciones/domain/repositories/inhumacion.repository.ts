import { CreateInhumacionEntity, InhumacionEntity, SearchFallecidosInhumacionEntity, UpdateInhumacionEntity } from "../entities/inhumacion.entity";


export interface InhumacionRepository {
    findAll(): Promise<InhumacionEntity[]>;
    findById(id: string): Promise<InhumacionEntity>;
    create(inhumacion: CreateInhumacionEntity): Promise<InhumacionEntity>;
    update(inhumacion: UpdateInhumacionEntity): Promise<InhumacionEntity>;
    delete(id: string): Promise<void>;
    searchFallecidos(busqueda: string): Promise<SearchFallecidosInhumacionEntity>;
    }