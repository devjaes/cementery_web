"use client";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { FileText, Download, Eye, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { EditarAmpliacionModal } from "./editar-ampliacion-modal.component";
import { toast } from "sonner";

interface AmpliacionNichoResponse {
    id_nicho: string;
    numero: string;
    observacion_ampliacion: string | null;
    pdf_ampliacion: string | null;
}

interface NichoAmpliacionInfoProps {
    nichoId: string;
}

export function NichoAmpliacionInfo({ nichoId }: NichoAmpliacionInfoProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Obtener información de ampliación del nicho
    const { data: ampliacion, isLoading, error } = useQuery<AmpliacionNichoResponse>({
        queryKey: ['ampliacion-nicho', nichoId],
        queryFn: async () => {
            const client = AxiosClient.getInstance();
            const response = await client.get(API_ROUTES.NICHOS.GET_AMPLIACION_NICHO(nichoId));
            return response.data.data as AmpliacionNichoResponse;
        },
        enabled: !!nichoId,
        retry: false,
    });

    // Mutation para actualizar ampliación
    const updateMutation = useMutation({
        mutationFn: async (data: { observacion?: string; file?: File }) => {
            const client = AxiosClient.getInstance();
            const formData = new FormData();

            if (data.observacion) {
                formData.append('observacion_ampliacion', data.observacion);
            }
            if (data.file) {
                formData.append('file', data.file);
            }

            const response = await client.patch(
                API_ROUTES.NICHOS.UPDATE_AMPLIACION_NICHO(nichoId),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Ampliación actualizada exitosamente");
            queryClient.invalidateQueries({ queryKey: ['ampliacion-nicho', nichoId] });
            setIsEditModalOpen(false);
        },
        onError: (error: any) => {
            toast.error("Error al actualizar ampliación", {
                description: error?.message || "Ocurrió un error inesperado",
            });
        },
    });

    const handleDescargarPDF = async () => {
        try {
            const client = AxiosClient.getInstance();
            const response = await client.get(
                API_ROUTES.NICHOS.GET_PDF_AMPLIACION(nichoId),
                { responseType: 'blob' as any }
            );

            const blob = response.data as any;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ampliacion_nicho_${ampliacion?.numero || nichoId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Error al descargar PDF:', e);
            toast.error("Error al descargar PDF");
        }
    };

    const handleVerPDF = async () => {
        try {
            const client = AxiosClient.getInstance();
            const response = await client.get(
                API_ROUTES.NICHOS.GET_PDF_AMPLIACION(nichoId),
                { responseType: 'blob' as any }
            );

            const blob = response.data as any;
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            window.open(url, '_blank');
        } catch (e) {
            console.error('Error al ver PDF:', e);
            toast.error("Error al visualizar PDF");
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-6">
                <h3 className="text-lg font-medium mb-4">Información de Ampliación</h3>
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        );
    }

    // Si hay error o no hay datos de ampliación, no mostrar nada
    if (error || !ampliacion) {
        return null;
    }

    return (
        <>
            <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Información de Ampliación del Nicho</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        className="gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><span className="flex items-center gap-1"><FileText className="w-4 h-4" />Nicho</span></TableHead>
                                <TableHead><span className="flex items-center gap-1">Observación Ampliación</span></TableHead>
                                <TableHead><span className="flex items-center gap-1">PDF Ampliación</span></TableHead>
                                <TableHead><span className="flex items-center gap-1">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="font-medium">
                                        Nicho #{ampliacion.numero}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[400px]">
                                    <span className="block whitespace-pre-wrap break-words text-sm">
                                        {ampliacion.observacion_ampliacion || '-'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {ampliacion.pdf_ampliacion ? (
                                        <span className="text-sm text-green-600 flex items-center gap-1">
                                            <FileText className="w-4 h-4" />
                                            Disponible
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {ampliacion.pdf_ampliacion ? (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleVerPDF}
                                                className="gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleDescargarPDF}
                                                className="gap-1"
                                            >
                                                <Download className="w-4 h-4" />
                                                Descargar
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Este nicho fue creado mediante una ampliación del mausoleo.
                </p>
            </div>

            <EditarAmpliacionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={(data) => updateMutation.mutate(data)}
                isLoading={updateMutation.isPending}
                currentObservacion={ampliacion.observacion_ampliacion || ""}
            />
        </>
    );
}
