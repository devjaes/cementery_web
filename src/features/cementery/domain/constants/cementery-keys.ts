export const CEMENTERY_QUERY_KEYS = {
    all: () => ['cementery'],
    byId: (id: string) => ['cementery', id],
    byName: (nombre: string) => ['cementery', 'name', nombre],
}; 