import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Search, Table, Filter } from "lucide-react";
import Link from "next/link";

type ViewMode = "search" | "table";

interface PersonViewHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function PersonViewHeader({ viewMode, onViewModeChange }: PersonViewHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {viewMode === "search" ? "Búsqueda de Personas" : "Lista de Personas"}
          </h2>
          <p className="text-gray-600 mt-1">
            {viewMode === "search" 
              ? "Busca por cédula, nombres o apellidos"
              : "Administra todas las personas registradas en el sistema"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Toggle de Vista */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("search")}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Búsqueda
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="gap-2"
            >
              <Table className="w-4 h-4" />
              Tabla
            </Button>
          </div>

          {/* Botón Nueva Persona */}
          <Link href="/persons/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nueva Persona
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicador de Modo Activo */}
      <div className="flex items-center gap-2">
        <Badge variant={viewMode === "search" ? "default" : "secondary"}>
          {viewMode === "search" ? (
            <>
              <Search className="w-3 h-3 mr-1" />
              Modo Búsqueda
            </>
          ) : (
            <>
              <Filter className="w-3 h-3 mr-1" />
              Modo Tabla
            </>
          )}
        </Badge>
        {viewMode === "search" && (
          <span className="text-sm text-gray-500">
            Busca personas específicas por cédula, nombres o apellidos
          </span>
        )}
        {viewMode === "table" && (
          <span className="text-sm text-gray-500">
            Vista completa de todas las personas registradas
          </span>
        )}
      </div>
    </>
  );
}
