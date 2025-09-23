const AR_KEYS = {
  AUTH: "auth",
  CEMENTERIO: "cementerio",
  NICHOS: "nichos",
  PROPIETARIOS_NICHOS: "propietarios-nichos",
  PERSON: "personas",
  HUECOS: "huecos-nichos",
  INHUMACIONES: "inhumaciones",
  REQUISITOS_INHUMACION: "requisitos-inhumacion",
};

export const API_ROUTES = {
  AUTH: {
    SIGNIN: `${AR_KEYS.AUTH}/login`,
    SIGNUP: `${AR_KEYS.AUTH}/register`,
  },
  CEMENTERIO: {
    LIST: AR_KEYS.CEMENTERIO,
    GET_BY_ID: (id: string) => `${AR_KEYS.CEMENTERIO}/${id}`,
    GET_BY_NAME: (nombre: string) => `${AR_KEYS.CEMENTERIO}/nombre/${nombre}`,
    CREATE: AR_KEYS.CEMENTERIO,
    UPDATE: (id: string) => `${AR_KEYS.CEMENTERIO}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.CEMENTERIO}/${id}`,
  },
  NICHOS: {
    LIST: AR_KEYS.NICHOS,
    GET_BY_ID: (id: string) => `${AR_KEYS.NICHOS}/${id}`,
    GET_PROPIETARIOS: (id: string) => `${AR_KEYS.NICHOS}/propietarios/${id}`,
    GET_BY_CEDULA_FALLECIDO: (cedula: string) => `${AR_KEYS.NICHOS}/fallecidos/${cedula}`,
    SEARCH_FALLECIDOS: (busqueda: string) => `${AR_KEYS.NICHOS}/fallecidos/${busqueda}`,
    CREATE: AR_KEYS.NICHOS,
    UPDATE: (id: string) => `${AR_KEYS.NICHOS}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.NICHOS}/${id}`,
  },
  PERSONS: {
    LIST: AR_KEYS.PERSON,
    GET_BY_ID: (id: string) => `${AR_KEYS.PERSON}/${id}`,
    CREATE: AR_KEYS.PERSON,
    UPDATE: (id: string) => `${AR_KEYS.PERSON}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.PERSON}/${id}`,
    SEARCH: (query?: string, vivos?: boolean) => {
      const baseUrl = `${AR_KEYS.PERSON}/search`;
      const params = new URLSearchParams();
      
      if (query) {
        params.append('query', query);
      }
      
      if (vivos !== undefined) {
        params.append('vivos', vivos.toString());
      }
      
      return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    },
  },
  HUECOS: {
    LIST: AR_KEYS.HUECOS,
    GET_BY_ID: (id: string) => `${AR_KEYS.HUECOS}/${id}`,
    GET_BY_NICHO: (idNicho: string) => `${AR_KEYS.HUECOS}/por-nicho/${idNicho}`,
    GET_BY_CEMENTERIO: (idCementerio: string) =>
      `${AR_KEYS.HUECOS}/Cementerio/nichos/${idCementerio}`,
    GET_DISPONIBLES: `${AR_KEYS.HUECOS}/disponibles`,
    CREATE: AR_KEYS.HUECOS,
    UPDATE: (id: string) => `${AR_KEYS.HUECOS}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.HUECOS}/${id}`,
  },
  PROPIETARIOS_NICHOS: {
    LIST: AR_KEYS.PROPIETARIOS_NICHOS,
    GET_BY_ID: (id: string) => `${AR_KEYS.PROPIETARIOS_NICHOS}/${id}`,
    GET_BY_NICHO: (idNicho: string) =>
      `${AR_KEYS.PROPIETARIOS_NICHOS}/por-nicho/${idNicho}`,
    GET_BY_PERSONA: (idPersona: string) =>
      `${AR_KEYS.PROPIETARIOS_NICHOS}/persona/${idPersona}`,
    CREATE: AR_KEYS.PROPIETARIOS_NICHOS,
    UPDATE: (id: string) => `${AR_KEYS.PROPIETARIOS_NICHOS}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.PROPIETARIOS_NICHOS}/${id}`,
    GET_HISTORIAL_BY_NICHO: (idNicho: string) =>
      `${AR_KEYS.PROPIETARIOS_NICHOS}/historial/${idNicho}`,
    GET_BY_PERSONA_CEDULA: (cedula: string) =>
      `${AR_KEYS.PROPIETARIOS_NICHOS}/por-persona/${cedula}`,
  },
  INHUMACIONES: {
    LIST: AR_KEYS.INHUMACIONES,
    GET_BY_ID: (id: string) => `${AR_KEYS.INHUMACIONES}/${id}`,
    CREATE: AR_KEYS.INHUMACIONES,
    UPDATE: (id: string) => `${AR_KEYS.INHUMACIONES}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.INHUMACIONES}/${id}`,
    SEARCH_FALLECIDOS: (busqueda: string) =>
      `${AR_KEYS.INHUMACIONES}/fallecidos/${busqueda}`,
  },
  REQUISITOS_INHUMACION: {
    LIST: AR_KEYS.REQUISITOS_INHUMACION,
    GET_BY_ID: (id: string) =>
      `${AR_KEYS.REQUISITOS_INHUMACION}/requisito/${id}`,
    CREATE: AR_KEYS.REQUISITOS_INHUMACION,
    UPDATE: (id: string) => `${AR_KEYS.REQUISITOS_INHUMACION}/${id}`,
    DELETE: (id: string) => `${AR_KEYS.REQUISITOS_INHUMACION}/${id}`,
    DOWNLOAD_PDF: (id: string) =>
      `${AR_KEYS.REQUISITOS_INHUMACION}/${id}/pdf`,
    SEARCH_FALLECIDOS: (busqueda: string) =>
      `${AR_KEYS.REQUISITOS_INHUMACION}/fallecidos/${busqueda}`,
  },
};
