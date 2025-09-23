"use client";
import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { PersonSearchSection } from "../components/person-search-section.component";
import { PersonViewHeader } from "../components/person-view-header.component";
import { PersonListTable } from "../components/person-table.component";
import { useSearchPersonsQuery } from "../hooks/use-person-queries";
import { PersonEntity } from "../../domain/entities/person.entity";

type ViewMode = "search" | "table";

export default function PersonListView() {
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonEntity | null>(null);

  const { 
    data: searchResults, 
    isLoading: isSearching, 
    error
  } = useSearchPersonsQuery(searchTerm);

  const handleSearch = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
    setSelectedPerson(null);
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
    setSelectedPerson(null);
  };

  const handleSelectPerson = (person: PersonEntity) => {
    setSelectedPerson(person);
  };

  const handleBackToResults = () => {
    setSelectedPerson(null);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "table") {
      setSearchTerm("");
      setHasSearched(false);
      setSelectedPerson(null);
    }
  };

  const handlePersonDeleted = () => {
    // Volver a la búsqueda después de eliminar
    setSelectedPerson(null);
    setHasSearched(false);
    setSearchTerm("");
  };

  return (
    <ContainerApp title="Gestión de Personas">
      <div className="space-y-6">
        <PersonViewHeader 
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Contenido según el modo */}
        {viewMode === "search" ? (
          <PersonSearchSection
            searchTerm={searchTerm}
            hasSearched={hasSearched}
            selectedPerson={selectedPerson}
            searchResults={searchResults}
            isSearching={isSearching}
            error={error}
            onSearch={handleSearch}
            onNewSearch={handleNewSearch}
            onSelectPerson={handleSelectPerson}
            onBackToResults={handleBackToResults}
            onPersonDeleted={handlePersonDeleted}
          />
        ) : (
          <PersonListTable />
        )}
      </div>
    </ContainerApp>
  );
}
