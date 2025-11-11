"use client";

import React from "react";
import { MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraSearchAllResultsEntity } from "../../domain/entities/mejora-search.entity";
import { Users, Home } from "lucide-react";
import { SingleResultView, MultipleResultsView } from "./mejora-search-results/fallecidos-results.component";
import { PropietariosResultsView } from "./mejora-search-results/propietarios-results.component";
import { RelatedMejorasPanel } from "./mejora-search-results/related-mejoras-panel.component";

interface MejoraSearchResultsProps {
  results: MejoraSearchAllResultsEntity;
  searchTerm: string;
  relatedMejoras: MejoraEntity[];
  isLoadingRelated?: boolean;
}

/**
 * Main component for displaying mejora search results
 * Orchestrates the display of fallecidos, propietarios, and related mejoras
 */
const MejoraSearchResults: React.FC<MejoraSearchResultsProps> = ({ 
  results, 
  searchTerm, 
  relatedMejoras, 
  isLoadingRelated 
}) => {
  const totalFallecidos = results.fallecidos.totalEncontrados;
  const totalPropietarios = results.propietarios.length;

  return (
    <div className="space-y-6">
      {/* Resultados de fallecidos */}
      {totalFallecidos > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Fallecidos encontrados ({totalFallecidos})</h3>
          </div>
          {totalFallecidos === 1 ? (
            <SingleResultView 
              fallecido={results.fallecidos.fallecidos[0]} 
              requisitos={results.fallecidos.fallecidos[0].requisitos} 
              searchTerm={searchTerm} 
            />
          ) : (
            <MultipleResultsView 
              fallecidos={results.fallecidos.fallecidos} 
              searchTerm={searchTerm} 
            />
          )}
        </div>
      )}

      {/* Resultados de propietarios */}
      {totalPropietarios > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Propietarios de nichos</h3>
          </div>
          <PropietariosResultsView 
            propietarios={results.propietarios} 
            searchTerm={searchTerm} 
          />
        </div>
      )}

      {/* Mejoras relacionadas */}
      <RelatedMejorasPanel 
        mejoras={relatedMejoras} 
        isLoading={isLoadingRelated} 
        searchTerm={searchTerm} 
      />
    </div>
  );
};

export default MejoraSearchResults;
