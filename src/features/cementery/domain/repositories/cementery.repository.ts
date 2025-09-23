import { CementeryEntity, CementeryCreateEntity, CementeryUpdateEntity } from "../entities/cementery.entity";

export interface CementeryRepository {
    findAll(): Promise<CementeryEntity[]>;
    findById(id: string): Promise<CementeryEntity>;
    findByName(nombre: string): Promise<CementeryEntity>;
    create(cementery: CementeryCreateEntity): Promise<CementeryEntity>;
    update(cementery: CementeryUpdateEntity): Promise<CementeryEntity>;
    delete(id: string): Promise<CementeryEntity>;
} 