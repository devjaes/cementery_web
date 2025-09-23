export const INHUMACION_QUERY_KEYS = {
    all: () => ["inhumaciones"],
    byId: (id: string) => ["inhumaciones", id],
    searchFallecidos: (busqueda: string) => ["inhumaciones", "search-fallecidos", busqueda],

};