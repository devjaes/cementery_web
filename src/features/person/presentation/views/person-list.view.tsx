"use client";
import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { PersonViewHeader } from "../components/person-view-header.component";
import { PersonListTable } from "../components/person-table.component";
import { PersonSearchBar } from "../components/person-search-bar.component";
import { PersonDetails } from "../components/person-details.component";
import { useSearchPersonsQuery, useFindAllPersonsQuery } from "../hooks/use-person-queries";
import { PersonEntity } from "../../domain/entities/person.entity";

export default function PersonListView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonEntity | null>(null);

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError
  } = useSearchPersonsQuery(searchTerm);

  const {
    data: allPersons,
    isLoading: isLoadingAll
  } = useFindAllPersonsQuery();

  const handleSearch = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
    setSelectedPerson(null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
    setSelectedPerson(null);
  };

  const handleSelectPerson = (person: PersonEntity) => {
    setSelectedPerson(person);
  };

  const handleBackToTable = () => {
    setSelectedPerson(null);
  };

  const handlePersonDeleted = () => {
    setSelectedPerson(null);
    setHasSearched(false);
    setSearchTerm("");
  };

  const displayData = hasSearched && searchTerm ? searchResults : allPersons;
  const isLoading = hasSearched && searchTerm ? isSearching : isLoadingAll;
  const hasError = hasSearched && searchTerm ? !!searchError : false;

  return (
    <ContainerApp title="Gestión de Personas">
      <div className="space-y-6">
        <PersonViewHeader />

        <PersonSearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          searchTerm={searchTerm}
        />

        {selectedPerson ? (
          <div className="space-y-4">
            <PersonDetails
              person={selectedPerson}
              onDeleted={handlePersonDeleted}
              onBack={handleBackToTable}
            />
          </div>
        ) : (
          <PersonListTable
            persons={displayData}
            isLoading={isLoading}
            hasError={hasError}
            searchTerm={hasSearched ? searchTerm : undefined}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </div>
    </ContainerApp>
  );
}
