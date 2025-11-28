"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
//import { ArrowLeft, Plus } from "lucide-react";
import { ArrowLeft} from "lucide-react";
//import Link from "next/link";
import { useFindAllInhumacionesQuery } from "@/features/inhumaciones/presentation/hooks/use-inhumacion-queries";
import { useFindAllExhumacionesQuery } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-queries";
import { ExhumacionSearch } from "@/features/exhumaciones/presentation/components/exhumacion-search.component";
import { ExhumacionSearchResults } from "@/features/exhumaciones/presentation/components/exhumacion-search-results.component";

export default function ExhumacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: inhumaciones = [], isLoading } = useFindAllInhumacionesQuery();
  const { data: exhumaciones = [], isLoading: isLoadingExhumaciones } = useFindAllExhumacionesQuery();

  // Función para verificar si una inhumación ya tiene exhumación
  const getExhumacionForInhumacion = (inhumacionId: string) => {
    return exhumaciones.find(exh => exh.inhumacionId === inhumacionId);
  };

  // Handlers para el nuevo diseño
  const handleSearch = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
  };

  // Buscar en ambas colecciones con un solo término
  const searchResults = searchTerm.trim() 
    ? (() => {
        const searchLower = searchTerm.toLowerCase();
        
        // Buscar en inhumaciones
        const matchedInhumaciones = inhumaciones.filter((inhumacion) => {
          return (
            inhumacion.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
            inhumacion.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
            inhumacion.idFallecido?.cedula?.toLowerCase().includes(searchLower) ||
            inhumacion.codigoInhumacion?.toLowerCase().includes(searchLower) ||
            inhumacion.solicitante?.toLowerCase().includes(searchLower)
          );
        });

        // Buscar en exhumaciones
        const matchedExhumaciones = exhumaciones.filter((exhumacion) => {
          return (
            exhumacion.codigo?.toLowerCase().includes(searchLower) ||
            exhumacion.duenioNicho?.toLowerCase().includes(searchLower) ||
            exhumacion.causa?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.cedula?.toLowerCase().includes(searchLower)
          );
        });

        // Crear array combinado con información de estado
        const results: Array<{
          type: 'inhumacion' | 'exhumacion';
          data: typeof inhumaciones[0] | typeof exhumaciones[0];
          exhumacion: typeof exhumaciones[0] | null;
          hasExhumacion: boolean;
        }> = [];

        // Agregar inhumaciones (verificando si ya tienen exhumación)
        matchedInhumaciones.forEach(inhumacion => {
          const existingExhumacion = getExhumacionForInhumacion(inhumacion.idInhumacion);
          results.push({
            type: 'inhumacion',
            data: inhumacion,
            exhumacion: existingExhumacion || null,
            hasExhumacion: !!existingExhumacion
          });
        });

        // Agregar exhumaciones que no se agregaron ya por la inhumación
        matchedExhumaciones.forEach(exhumacion => {
          const alreadyAdded = results.some(r => 
            r.type === 'inhumacion' && (r.data as any).idInhumacion === exhumacion.inhumacionId
          );
          if (!alreadyAdded) {
            results.push({
              type: 'exhumacion',
              data: exhumacion,
              exhumacion: exhumacion,
              hasExhumacion: true
            });
          }
        });

        return results;
      })()
    : [];

  return (
    <ContainerApp title="Búsqueda de Exhumaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Localización de Personas para Exhumación</h2>
            <p className="text-gray-600 mt-1">
              Busca por nombre, cédula, código de inhumación o solicitante
            </p>
          </div>
          {/* <Link href="/exhumaciones/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nueva Exhumación
            </Button>
          </Link> */}
        </div>

        {/* Contenido Principal */}
        {!hasSearched ? (
          // Pantalla de Búsqueda Inicial
          <div className="min-h-[400px] flex items-center justify-center">
            <ExhumacionSearch onSearch={handleSearch} isSearching={isLoading || isLoadingExhumaciones} />
          </div>
        ) : (
          // Resultados de Búsqueda
          <div className="space-y-4">
            {/* Botón para Nueva Búsqueda */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleNewSearch} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Nueva Búsqueda
              </Button>
              <div className="text-sm text-gray-600">
                Resultados para: <span className="font-medium">&quot;{searchTerm}&quot;</span>
              </div>
            </div>

            {/* Resultados */}
            <ExhumacionSearchResults 
              results={searchResults} 
              searchTerm={searchTerm}
              isLoading={isLoading || isLoadingExhumaciones}
            />
          </div>
        )}
      </div>
    </ContainerApp>
  );
}
