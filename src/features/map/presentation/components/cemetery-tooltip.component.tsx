import React from 'react';
import { Building2, MapPin, Phone, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';

interface CemeteryTooltipProps {
    cemetery: CementeryEntity;
}

export const CemeteryTooltip: React.FC<CemeteryTooltipProps> = ({ cemetery }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-2 p-2 max-w-xs text-black bg-white">
            <div className="flex items-center gap-2 font-semibold text-sm">
                <Building2 className="h-4 w-4" />
                {cemetery.nombre}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {cemetery.direccion}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {cemetery.telefono}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                Responsable: {cemetery.responsable}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Creado: {formatDate(cemetery.fechaCreacion)}
            </div>
            
            <div className="flex items-center gap-2">
                <Badge variant={cemetery.estado === 'Activo' ? 'default' : 'secondary'}>
                    {cemetery.estado}
                </Badge>
            </div>
        </div>
    );
};
