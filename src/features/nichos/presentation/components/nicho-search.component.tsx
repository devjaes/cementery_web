"use client";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, User, MapPin } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface NichoSearchProps {
  onSearch: (busqueda: string) => void;
  isSearching: boolean;
}

export function NichoSearch({ onSearch, isSearching }: NichoSearchProps) {
  const [busqueda, setBusqueda] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim().length >= 2) {
      onSearch(busqueda.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusqueda(value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Búsqueda de Nichos
          </h2>
          <p className="text-gray-600">
            Busca por cédula, nombres o apellidos del fallecido
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Escribe cédula, nombres o apellidos..."
              value={busqueda}
              onChange={handleInputChange}
              className="pl-10 h-12 text-lg"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg gap-2"
            disabled={busqueda.trim().length < 2 || isSearching}
          >
            <Search className="w-5 h-5" />
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Cómo funciona?</p>
              <ul className="space-y-1">
                <li>• <strong>Por cédula:</strong> Ingresa números completos o parciales (ej: 0550318505 o 0550)</li>
                <li>• <strong>Por nombres:</strong> Escribe el nombre completo o parte de él (ej: Pablo o Juan)</li>
                <li>• <strong>Por apellidos:</strong> Ingresa apellidos completos o parciales (ej: García)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 