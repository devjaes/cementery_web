export interface AmpliarBloqueEntity {
    numeroFilas: number;
    numeroColumnas: number;
    observacionAmpliacion: string;
    pdfFile: File;
}

export interface AmpliarBloqueResponseEntity {
    mensaje: string;
    bloque: {
        id_bloque: string;
        nombre: string;
        numero_filas_anterior: number;
        numero_filas_nuevo: number;
        numero_columnas: number;
    };
    ampliacion: {
        filas_agregadas: number;
        nichos_creados: number;
        huecos_creados: number;
        rango_numeros: string;
        observacion: string;
        pdf: string;
        codigo_ampliacion: string;
    };
    total_nichos_bloque: number;
}
