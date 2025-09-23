export const REQUISITO_INHUMACION_QUERY_KEYS = {
    all: () => ["requisitos-inhumacion"],
    byId: (id: string) => ["requisitos-inhumacion", id],
    searchFallecidos: (busqueda: string) => ["requisitos-inhumacion", "search-fallecidos", busqueda],
}