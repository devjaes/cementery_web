"use client"
import ContainerApp from "@/core/layout/container-app";
import { useFindPersonByIdQuery } from "../hooks/use-person-queries";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardTitle } from "@/shared/components/ui/card";
import { CardHeader, CardContent } from '@/components/ui/card';
import { PersonForm } from "../components/person-form.component";

export default function PersonEditView({ personId }: { personId: string }) {
    const {data: person, isLoading} = useFindPersonByIdQuery(personId);
    return (
        <ContainerApp title="Editar Persona">
            <div className="min-w-3xl mx-auto">
                <div className="mb-4">
                    <Link href="/persons">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Volver a la lista
                    </Button>
                    </Link>
                </div>
                <Card className="p-2 md:p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Editar Persona</CardTitle>
                        <p className="text-muted-foreground text-sm mt-2">Modifica los datos de la persona y guarda los cambios.</p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">Cargando...</div>
                        ) : person ? (
                            <PersonForm person={person} />
                        ) : (
                            <div className="text-center py-8 text-red-500">No se encontró la persona.</div>
                        )}
                    </CardContent>

                </Card>
            </div>
        </ContainerApp>
    )

}