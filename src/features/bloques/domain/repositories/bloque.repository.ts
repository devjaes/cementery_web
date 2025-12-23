import { BloqueEntity, BloqueCreateEntity, BloqueUpdateEntity, BloqueWithNichosEntity } from "../entities/bloque.entity";
import { AmpliarBloqueEntity, AmpliarBloqueResponseEntity } from "../entities/ampliar-bloque.entity";

export interface BloqueRepository {
  findAll(): Promise<BloqueEntity[]>;
  findById(id: string): Promise<BloqueEntity>;
  findByCementery(idCementerio: string): Promise<BloqueEntity[]>;
  findNichosByBloque(idBloque: string): Promise<BloqueWithNichosEntity>;
  create(bloque: BloqueCreateEntity): Promise<BloqueEntity>;
  update(bloque: BloqueUpdateEntity): Promise<BloqueEntity>;
  delete(id: string): Promise<BloqueEntity>;
  ampliarBloque(idBloque: string, data: AmpliarBloqueEntity): Promise<AmpliarBloqueResponseEntity>;
}
