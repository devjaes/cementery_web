import { BloqueEntity, BloqueCreateEntity, BloqueUpdateEntity } from "../entities/bloque.entity";

export interface BloqueRepository {
  findAll(): Promise<BloqueEntity[]>;
  findById(id: string): Promise<BloqueEntity>;
  findByCementery(idCementerio: string): Promise<BloqueEntity[]>;
  create(bloque: BloqueCreateEntity): Promise<BloqueEntity>;
  update(bloque: BloqueUpdateEntity): Promise<BloqueEntity>;
  delete(id: string): Promise<BloqueEntity>;
}
