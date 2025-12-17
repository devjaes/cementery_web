"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAmpliarBloqueMutation } from "../hooks/use-bloques-mutations";
import { FileUp, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

interface AmpliarMausoleoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bloqueId: string;
    numeroColumnas: number;
    nombreBloque: string;
}

export function AmpliarMausoleoModal({
    open,
    onOpenChange,
    bloqueId,
    numeroColumnas,
    nombreBloque,
}: AmpliarMausoleoModalProps) {
    const [numeroFilas, setNumeroFilas] = useState<number>(1);
    const [observacion, setObservacion] = useState<string>("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ filas?: string; observacion?: string; pdf?: string }>({});

    const mutation = useAmpliarBloqueMutation();

    // Validar numeroColumnas cuando el modal se abre
    useEffect(() => {
        if (open) {
            console.log('[AmpliarMausoleoModal] Modal opened with props:', {
                bloqueId,
                numeroColumnas,
                numeroColumnasType: typeof numeroColumnas,
                nombreBloque
            });

            console.warn('[AmpliarMausoleoModal] IMPORTANTE: Verifica que numeroColumnas coincida con el backend.');
            console.warn('[AmpliarMausoleoModal] Si el backend dice que no coincide, el bloque original tiene un número diferente de columnas.');

            if (!numeroColumnas || numeroColumnas <= 0) {
                console.error('[AmpliarMausoleoModal] ERROR: numeroColumnas is invalid:', numeroColumnas);
            }
        }
    }, [open, bloqueId, numeroColumnas, nombreBloque]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setErrors({ ...errors, pdf: "Solo se permiten archivos PDF" });
                setPdfFile(null);
                return;
            }
            setPdfFile(file);
            setErrors({ ...errors, pdf: undefined });
        }
    };

    const validate = (): boolean => {
        const newErrors: { filas?: string; observacion?: string; pdf?: string } = {};

        if (numeroFilas < 1) {
            newErrors.filas = "Debe agregar al menos 1 fila";
        }

        if (!observacion.trim()) {
            newErrors.observacion = "La observación es requerida";
        } else if (observacion.length > 1000) {
            newErrors.observacion = "La observación no puede exceder 1000 caracteres";
        }

        if (!pdfFile) {
            newErrors.pdf = "Debe cargar un archivo PDF";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        console.log('[AmpliarMausoleoModal] Submitting with:', {
            bloqueId,
            numeroFilas,
            numeroColumnas,
            observacion,
            pdfFileName: pdfFile?.name
        });

        try {
            await mutation.mutateAsync({
                idBloque: bloqueId,
                data: {
                    numeroFilas,
                    numeroColumnas,
                    observacionAmpliacion: observacion,
                    pdfFile: pdfFile!,
                },
            });

            // Reset form
            setNumeroFilas(1);
            setObservacion("");
            setPdfFile(null);
            setErrors({});
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation's onError
            console.error("Error al ampliar mausoleo:", error);
        }
    };

    const handleCancel = () => {
        setNumeroFilas(1);
        setObservacion("");
        setPdfFile(null);
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ampliar Mausoleo</DialogTitle>
                    <DialogDescription>
                        Agregar nuevas filas de nichos a {nombreBloque}
                    </DialogDescription>
                </DialogHeader>

                {/* Debug Alert */}
                {(!numeroColumnas || numeroColumnas <= 0) && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            ERROR: El número de columnas es inválido ({numeroColumnas}).
                            Por favor, cierra este modal y vuelve a intentarlo.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numeroFilas">
                                Número de Filas a Agregar <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="numeroFilas"
                                type="number"
                                min={1}
                                value={numeroFilas}
                                onChange={(e) => setNumeroFilas(parseInt(e.target.value) || 1)}
                                className={errors.filas ? "border-red-500" : ""}
                            />
                            {errors.filas && (
                                <p className="text-sm text-red-500">{errors.filas}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numeroColumnas">
                                Número de Columnas (fijo)
                            </Label>
                            <Input
                                id="numeroColumnas"
                                type="number"
                                value={numeroColumnas || 0}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Las columnas no pueden modificarse (Valor actual: {numeroColumnas})
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observacion">
                            Observación <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="observacion"
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="Ingrese observaciones sobre la ampliación..."
                            className={errors.observacion ? "border-red-500" : ""}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{errors.observacion && <span className="text-red-500">{errors.observacion}</span>}</span>
                            <span>{observacion.length}/1000</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pdfFile">
                            PDF de Ampliación <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="pdfFile"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className={errors.pdf ? "border-red-500" : ""}
                            />
                            {pdfFile && (
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                    <FileUp className="w-4 h-4" />
                                    {pdfFile.name}
                                </div>
                            )}
                        </div>
                        {errors.pdf && (
                            <p className="text-sm text-red-500">{errors.pdf}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Ampliando...
                                </>
                            ) : (
                                "Ampliar Mausoleo"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
