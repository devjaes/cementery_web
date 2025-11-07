import { ExhumacionEntity, CreateExhumacionEntity, UpdateExhumacionEntity } from "../entities/exhumacion.entity";

export interface ExhumacionRepository {
  findAll(): Promise<ExhumacionEntity[]>;
  findById(id: string): Promise<ExhumacionEntity>;
  create(data: CreateExhumacionEntity): Promise<ExhumacionEntity>;
  update(data: UpdateExhumacionEntity): Promise<ExhumacionEntity>;
  delete(id: string): Promise<void>;
  findByInhumacionId(inhumacionId: string): Promise<ExhumacionEntity[]>;
  findByNichoId(nichoId: string): Promise<ExhumacionEntity[]>;
  uploadComprobante(id: string, file: File): Promise<ExhumacionEntity>;
}
