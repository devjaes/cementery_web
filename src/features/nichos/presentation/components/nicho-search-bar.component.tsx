"use client";
import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, X, User } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface NichoSearchBarProps {
	onSearchFallecido: (busqueda: string) => void;
	onClear: () => void;
	isSearching: boolean;
	searchTerm: string;
}

export function NichoSearchBar({
	onSearchFallecido,
	onClear,
	isSearching,
	searchTerm,
}: NichoSearchBarProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleFallecidoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (localSearchTerm.trim().length >= 2) {
			onSearchFallecido(localSearchTerm.trim());
		}
	};

	const handleClear = () => {
		setLocalSearchTerm("");
		onClear();
	};

	return (
  <Card className="w-full max-w-2xl mx-auto">
    <CardContent className="p-8">
      
      {/* ICONO Y TÍTULO */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Búsqueda de Nichos
        </h2>
        <p className="text-gray-600">
          Busca por fallecido (cédula o nombre)
        </p>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleFallecidoSubmit} className="space-y-4">

        {/* INPUT CON ICONO */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <Input
            type="text"
            placeholder="Buscar por cédula, nombres o apellidos..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />

          {/* BOTÓN DE LIMPIAR */}
          {localSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* BOTÓN BUSCAR */}
        <Button
          type="submit"
          className="w-full h-12 text-lg gap-2"
          disabled={localSearchTerm.trim().length < 2 || isSearching}
        >
          <Search className="w-5 h-5" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {/* BLOQUE DE AYUDA */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
          </div>
          <div className="text-sm text-purple-800">
            <p className="font-medium mb-1">¿Cómo funciona?</p>
            <ul className="space-y-1">
              <li>• <strong>Por fallecido:</strong> busca por nombre o cédula.</li>
              <li>• <strong>Mínimo 2 caracteres</strong> para comenzar la búsqueda.</li>
            </ul>
          </div>
        </div>
      </div>

    </CardContent>
  </Card>
);}
