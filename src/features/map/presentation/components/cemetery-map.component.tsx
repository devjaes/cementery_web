import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { CemeteryTooltip } from './cemetery-tooltip.component';
import { NichesGrid } from './niches-grid.component';
import { useCemetery } from '../hooks/use-cemetery';

export const CemeteryMapVisualization: React.FC = () => {
    const {
        cemeteries,
        selectedCemetery,
        setSelectedCemetery,
        loading,
        error,
        refetch
    } = useCemetery();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Cargando cementerios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <p className="text-destructive">{error}</p>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Gestión de Cementerios
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <Tabs 
                            value={selectedCemetery?.idCementerio || ''} 
                            onValueChange={(value) => {
                                const cemetery = cemeteries.find(c => c.idCementerio === value);
                                setSelectedCemetery(cemetery || null);
                            }}
                            className="space-y-6"
                        >
                            <div className="flex justify-center">
                                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                                    {cemeteries.map((cemetery) => {
                                        const isActive = selectedCemetery?.idCementerio === cemetery.idCementerio;
                                        return (
                                            <Tooltip key={cemetery.idCementerio}>
                                                <TooltipTrigger asChild>
                                                    <TabsTrigger 
                                                        value={cemetery.idCementerio}
                                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                                                            isActive ? 'bg-gray-500 text-white' : ''
                                                        }`}
                                                    >
                                                        {cemetery.nombre}
                                                    </TabsTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent 
                                                    side="bottom" 
                                                    className="bg-white text-black border border-gray-200 shadow-lg"
                                                >
                                                    <CemeteryTooltip cemetery={cemetery} />
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </TabsList>
                            </div>

                            {cemeteries.map((cemetery) => (
                                <TabsContent 
                                    key={cemetery.idCementerio} 
                                    value={cemetery.idCementerio}
                                    className="space-y-4"
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-semibold">{cemetery.nombre}</h3>
                                        <p className="text-muted-foreground">{cemetery.direccion}</p>
                                    </div>
                                    
                                    <NichesGrid cemetery={cemetery} />
                                </TabsContent>
                            ))}
                        </Tabs>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </div>
    );
};