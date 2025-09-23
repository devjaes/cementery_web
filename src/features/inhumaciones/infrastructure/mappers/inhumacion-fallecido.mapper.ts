import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { InhumacionFallecidosEntity, SearchFallecidosInhumacionEntity } from "../../domain/entities/inhumacion.entity";
import { InhumacionFallecidosModel, SearchFallecidosInhumacionModel } from "../models/inhumacion.model";
import { InhumacionMapper } from "./inhumacion.mapper";
import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";
import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";


export class InhumacionFallecidoMapper {
    static toEntity(model: InhumacionFallecidosModel): InhumacionFallecidosEntity {
        return {
            fallecido: PersonMapper.toEntity(model.fallecido),
            inhumaciones: model.inhumaciones.map(InhumacionMapper.toEntity),
            nichos: model.nichos.map(NichoMapper.toEntity),
            cementerios: model.cementerios.map(CementeryMapper.toEntity)
        };
    }   

}

export class SearchFallecidosInhumacionMapper {
    static toEntity(model: SearchFallecidosInhumacionModel): SearchFallecidosInhumacionEntity {
        return {
          terminoBusqueda: model.termino_busqueda,
          totalEncontrados: model.total_encontrados,
        fallecidos: model.fallecidos.map(InhumacionFallecidoMapper.toEntity)
        };
    }
}