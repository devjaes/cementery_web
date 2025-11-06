"use client";

import React, { useState, FormEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { MapPin, User, Search } from "lucide-react";

type MejoraSearchProps = {
  onSearch: (q: string) => void;
  isSearching?: boolean;
};

export const MejoraSearch: React.FC<MejoraSearchProps> = ({ onSearch, isSearching = false }) => {
  const [busqueda, setBusqueda] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = busqueda.trim();
    if (q.length >= 2) {
      onSearch(q);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Búsqueda de Mejoras en Tumbas</h2>
          <p className="text-gray-600">Busca por cédula, nombres o apellidos del titular o del fallecido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Escribe cédula, nombres o apellidos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
                <li>• <strong>Por cédula:</strong> Ingresa números completos o parciales (ej: 1724727225)</li>
                <li>• <strong>Por nombres:</strong> Escribe el nombre completo o parte de él (ej: Mónica)</li>
                <li>• <strong>Por apellidos:</strong> Ingresa apellidos completos o parciales (ej: Álvarez)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MejoraSearch;