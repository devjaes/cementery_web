import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Input } from '@/shared/components/ui/input';
import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';
import { useFindBloquesByCementeryQuery } from '@/features/bloques/presentation/hooks/use-bloques-queries';
import { BloqueEntity } from '@/features/bloques/domain/entities/bloque.entity';
import { Loader2, AlertCircle, Grid3x3, Search, Box, Layers } from 'lucide-react';
import clsx from 'clsx';

interface BlocksMapProps {
  cemetery: CementeryEntity;
  onStatisticsChange?: (statistics: { total: number; activos: number }) => void;
}

export const BlocksMap: React.FC<BlocksMapProps> = ({ cemetery, onStatisticsChange }) => {
  const router = useRouter();
  const { data: bloques = [], isLoading, error } = useFindBloquesByCementeryQuery(cemetery.idCementerio);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const prevStatisticsRef = useRef<string>('');

  const filteredBloques = useMemo(() => {
    if (!searchTerm.trim()) {
      return bloques;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return bloques.filter(bloque => 
      bloque.nombre.toLowerCase().includes(searchLower) ||
      bloque.numero?.toString().includes(searchLower) ||
      bloque.descripcion?.toLowerCase().includes(searchLower)
    );
  }, [bloques, searchTerm]);

  const statistics = useMemo(() => {
    const activos = bloques.filter(b => b.estado === 'Activo').length;
    const total = bloques.length;
    return { activos, total };
  }, [bloques]);

  useEffect(() => {
    const statsString = JSON.stringify(statistics);
    if (onStatisticsChange && statsString !== prevStatisticsRef.current) {
      prevStatisticsRef.current = statsString;
      onStatisticsChange(statistics);
    }
  }, [statistics, onStatisticsChange]);

  const handleBloqueClick = (bloqueId: string) => {
    router.push(`/cementerio/${cemetery.idCementerio}/bloques/${bloqueId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando bloques...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error al cargar los bloques</AlertDescription>
      </Alert>
    );
  }

  const getBlockColor = (bloque: BloqueEntity) => {
    if (bloque.estado === 'Activo') {
      return {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        ring: 'ring-blue-500/20',
        badgeVariant: 'default' as const,
        bgLight: 'bg-blue-500/10',
        border: 'border-blue-500/20'
      };
    }
    return {
      bg: 'bg-gray-400',
      hover: 'hover:bg-gray-500',
      ring: 'ring-gray-500/20',
      badgeVariant: 'secondary' as const,
      bgLight: 'bg-gray-500/10',
      border: 'border-gray-500/20'
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Bloques del Cementerio
              </CardTitle>
              <CardDescription>
                {filteredBloques.length === bloques.length
                  ? `${bloques.length} bloque${bloques.length !== 1 ? 's' : ''} disponible${bloques.length !== 1 ? 's' : ''}`
                  : `${filteredBloques.length} de ${bloques.length} bloque${bloques.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar bloques por nombre, número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {filteredBloques.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Box className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm ? 'No se encontraron bloques' : 'No hay bloques disponibles'}
              </p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <TooltipProvider>
                {filteredBloques.map((bloque) => {
                  const colorStatus = getBlockColor(bloque);
                  return (
                    <Tooltip key={bloque.idBloque}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleBloqueClick(bloque.idBloque)}
                          className={clsx(
                            'relative p-6 rounded-lg font-semibold text-white',
                            'transition-all duration-200 ease-in-out',
                            'hover:scale-105 hover:shadow-xl',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                            'flex flex-col items-center justify-center gap-2 min-h-[120px]',
                            colorStatus.bg,
                            colorStatus.hover,
                            `focus-visible:${colorStatus.ring}`
                          )}
                        >
                          <Grid3x3 className="w-8 h-8" />
                          <span className="text-lg font-bold">
                            {bloque.numero ? `Bloque ${bloque.numero}` : bloque.nombre}
                          </span>
                          <span className="text-xs opacity-90 text-center line-clamp-1">
                            {bloque.numeroFilas}x{bloque.numeroColumnas}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className={clsx(
                          "max-w-sm p-0 overflow-hidden border-2",
                          colorStatus.border
                        )}
                      >
                        <div className={clsx("px-4 py-2", colorStatus.bgLight)}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-base text-foreground">
                              {bloque.nombre}
                            </p>
                            <Badge
                              variant={colorStatus.badgeVariant}
                              className={clsx(
                                'font-semibold',
                                bloque.estado === 'Activo' 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-600 text-white hover:bg-gray-700'
                              )}
                            >
                              {bloque.estado}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 space-y-3 bg-card">
                          <div className="space-y-2">
                            {bloque.numero !== null && bloque.numero !== undefined && (
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-muted">
                                  <Box className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                    Número
                                  </p>
                                  <p className="text-sm font-semibold text-foreground leading-none">
                                    {bloque.numero}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-muted">
                                <Grid3x3 className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                  Dimensiones
                                </p>
                                <p className="text-sm font-semibold text-foreground leading-none">
                                  {bloque.numeroFilas} filas × {bloque.numeroColumnas} columnas
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-muted">
                                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                  Total nichos
                                </p>
                                <p className="text-sm font-semibold text-foreground leading-none">
                                  {bloque.numeroFilas * bloque.numeroColumnas}
                                </p>
                              </div>
                            </div>

                            {bloque.descripcion && (
                              <div className="pt-2 border-t">
                                <p className="text-[10px] text-muted-foreground leading-none mb-1">
                                  Descripción
                                </p>
                                <p className="text-xs text-foreground">
                                  {bloque.descripcion}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t">
                            <p className="text-[10px] text-muted-foreground">
                              Haz clic para ver más detalles
                            </p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          )}

          {filteredBloques.length > 0 && (
            <div className="text-center text-sm text-muted-foreground pt-2 border-t">
              <p>
                {filteredBloques.length} bloque{filteredBloques.length !== 1 ? 's' : ''} mostrado{filteredBloques.length !== 1 ? 's' : ''}
                {searchTerm && ` (filtrado${filteredBloques.length !== 1 ? 's' : ''})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
