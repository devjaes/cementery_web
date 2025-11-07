"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContainerApp from "../../../../core/layout/container-app";
import MejoraSearch from "../components/mejora-search.component";
import MejoraSearchResults from "../components/mejora-search-results.component";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { useFindAllMejorasQuery, useSearchMejorasQuery } from "../hooks/use-mejora-queries";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import { MejoraEntity } from "../../domain/entities/mejora.entity";

const normalize = (value?: string | null) => (value ?? "").trim().toUpperCase();

const MejoraListView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  
  const [searchTerm, setSearchTerm] = useState<string>(queryParam);
  const [hasSearched, setHasSearched] = useState(!!queryParam);
  
  // Sincronizar con query params cuando cambian
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearchTerm(q);
    setHasSearched(!!q);
  }, [searchParams]);

  const {
    data: searchResults,
    isLoading,
    isFetching,
    isError,
    error,
  } = useSearchMejorasQuery(searchTerm);

  const {
    data: allMejoras,
    isLoading: isLoadingMejoras,
    isFetching: isFetchingMejoras,
  } = useFindAllMejorasQuery({ enabled: hasSearched });

  const handleSearch = (q: string) => {
    const trimmedQuery = q.trim();
    setSearchTerm(trimmedQuery);
    setHasSearched(true);
    // Actualizar URL con query parameter
    router.push(`/mejoras?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
    // Limpiar query parameter de la URL
    router.push("/mejoras");
  };

  const isSearching = hasSearched && (isLoading || isFetching);
  const isLoadingRelated = hasSearched && (isLoadingMejoras || isFetchingMejoras);
  const errorMessage = error instanceof Error ? error.message : "Ocurrió un error al buscar mejoras.";
  const resolvedResults: SearchFallecidosRequisitoInhumacionEntity = useMemo(() => {
    return (
      searchResults ?? {
        terminoBusqueda: searchTerm,
        totalEncontrados: 0,
        fallecidos: [] as SearchFallecidosRequisitoInhumacionEntity["fallecidos"],
      }
    );
  }, [searchResults, searchTerm]);

  const relatedMejoras: MejoraEntity[] = useMemo(() => {
    if (!hasSearched || !resolvedResults || !allMejoras) {
      return [];
    }

    const fallecidoIds = new Set<string>();
    const fallecidoCedulas = new Set<string>();
    const solicitanteIds = new Set<string>();
    const solicitanteCedulas = new Set<string>();

    const registerFallecido = (person?: { id_persona?: string; cedula?: string | null }) => {
      if (!person) return;
      if (person.id_persona) fallecidoIds.add(person.id_persona);
      const cedula = normalize(person.cedula);
      if (cedula) fallecidoCedulas.add(cedula);
    };

    const registerSolicitante = (person?: { id_persona?: string; cedula?: string | null }) => {
      if (!person) return;
      if (person.id_persona) solicitanteIds.add(person.id_persona);
      const cedula = normalize(person.cedula);
      if (cedula) solicitanteCedulas.add(cedula);
    };

    resolvedResults.fallecidos.forEach(({ fallecido, requisitos }) => {
      registerFallecido(fallecido);
      requisitos.forEach((req) => {
        registerFallecido(req.idFallecido);
        registerSolicitante(req.idSolicitante);
      });
    });

    const matchesPerson = (
      person: { id_persona?: string; cedula?: string | null } | undefined,
      idSet: Set<string>,
      cedulaSet: Set<string>,
    ) => {
      if (!person) return false;
      if (person.id_persona && idSet.has(person.id_persona)) return true;
      const cedula = normalize(person.cedula);
      return cedula ? cedulaSet.has(cedula) : false;
    };

    const hasFallecidoCriteria = fallecidoIds.size > 0 || fallecidoCedulas.size > 0;

    return allMejoras.filter((mejora) => {
      const fallecidoMatch = matchesPerson(mejora.fallecido, fallecidoIds, fallecidoCedulas);
      const solicitanteMatch = matchesPerson(mejora.solicitante, solicitanteIds, solicitanteCedulas);

      if (hasFallecidoCriteria) {
        return fallecidoMatch;
      }

      return solicitanteMatch;
    });
  }, [hasSearched, resolvedResults, allMejoras]);

  return (
    <ContainerApp title="Solicitudes de Mejoras">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mejoras en Tumbas</h2>
            <p className="text-gray-600 mt-1">Registra y gestiona autorizaciones de arreglos, construcción y lápidas.</p>
          </div>
        </div>

        {/* Pantalla de Búsqueda Inicial */}
        {!hasSearched ? (
          <div className="min-h-[380px] flex items-center justify-center">
            <MejoraSearch onSearch={handleSearch} isSearching={isLoading || isFetching} />
          </div>
        ) : (
          // Resultados después de buscar
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleNewSearch} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Nueva Búsqueda
              </Button>
              <div className="text-sm text-gray-600">
                Resultados para: <span className="font-medium">&quot;{searchTerm}&quot;</span>
              </div>
            </div>

            {isError && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {isSearching && !isError && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Buscando coincidencias...</p>
              </div>
            )}

            {!isSearching && !isError && (
              <MejoraSearchResults
                results={resolvedResults}
                searchTerm={searchTerm}
                relatedMejoras={relatedMejoras}
                isLoadingRelated={isLoadingRelated}
              />
            )}
          </div>
        )}
      </div>
    </ContainerApp>
  );
};

export default MejoraListView;


