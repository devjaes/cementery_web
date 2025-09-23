import { PersonEntity, PersonSearchEntity } from "../../domain/entities/person.entity";
import { Card, CardContent } from "@/shared/components/ui/card";
import { User, Phone, Mail, MapPin, Calendar} from "lucide-react";

interface PersonSearchResultsProps {
    results: PersonSearchEntity;
    searchTerm: string;
    selectedPerson: PersonEntity | null;
    onSelectPerson: (person: PersonEntity) => void;
}

export function PersonSearchResults({
    results,
    searchTerm,
    selectedPerson,
    onSelectPerson,
}: PersonSearchResultsProps) {
    if (!results || results.totalEncontrados === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <User className="w-12 h-12 mb-2 text-gray-400" />
                    <span className="text-lg font-medium">
                        No se encontraron personas
                    </span>
                    <span className="text-sm">
                        No hay resultados para &quot;{searchTerm}&quot;
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Resultados encontrados ({results.totalEncontrados})
                </h3>
                <span className="text-sm text-gray-500">
                    Haz clic en una persona para ver más detalles
                </span>
            </div>
            
            <div className="grid gap-4">
                {results.personas.map((person) => (
                    <Card
                        key={person.id_persona}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedPerson?.id_persona === person.id_persona 
                                ? "ring-2 ring-blue-500 bg-blue-50" 
                                : "hover:bg-gray-50"
                        }`}
                        onClick={() => onSelectPerson(person)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {person.nombres} {person.apellidos}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Cédula: {person.cedula}
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Nac: {new Date(person.fecha_nacimiento).toLocaleDateString("es-ES")}
                                                </span>
                                            </div>
                                            
                                            {person.telefono && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{person.telefono}</span>
                                                </div>
                                            )}
                                            
                                            {person.correo && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="truncate">{person.correo}</span>
                                                </div>
                                            )}
                                            
                                            {person.direccion && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate">{person.direccion}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            person.fallecido
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        {person.fallecido ? "Fallecido" : "Propietario"}
                                    </span>
                                    
                                    {person.fallecido && person.fecha_defuncion && (
                                        <span className="text-xs text-gray-500">
                                            † {new Date(person.fecha_defuncion).toLocaleDateString("es-ES")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
