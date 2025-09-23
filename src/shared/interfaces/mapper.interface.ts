export interface Mapper<T, U> {
  toModel(entity: T): U;
  toEntity(model: U): T;
}
