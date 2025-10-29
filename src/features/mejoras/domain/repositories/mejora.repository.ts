import { CreateMejoraEntity, MejoraEntity } from "../entities/mejora.entity";

export interface MejoraRepository {
  findAll(): Promise<MejoraEntity[]>;
  findById(id: string): Promise<MejoraEntity>;
  create(data: CreateMejoraEntity): Promise<MejoraEntity>;
  update(id: string, data: Partial<CreateMejoraEntity>): Promise<MejoraEntity>;
  delete(id: string): Promise<void>;
  uploadFiles(id: string, files: File[]): Promise<void>;
  downloadPdf(id: string): Promise<Blob>;
  search(query: string): Promise<MejoraEntity[]>;
}


