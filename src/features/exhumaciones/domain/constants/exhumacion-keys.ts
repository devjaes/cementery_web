export const EXHUMACION_QUERY_KEYS = {
  all: () => ['exhumaciones'] as const,
  byId: (id: string) => ['exhumaciones', 'detail', id] as const,
  byInhumacion: (inhumacionId: string) => ['exhumaciones', 'inhumacion', inhumacionId] as const,
  byNicho: (nichoId: string) => ['exhumaciones', 'nicho', nichoId] as const,
};
