"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Loader2, Upload } from "lucide-react";

interface EditarAmpliacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { observacion?: string; file?: File }) => void;
    isLoading: boolean;
    currentObservacion?: string;
}

interface FormData {
    observacion: string;
    file?: FileList;
}

export function EditarAmpliacionModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    currentObservacion,
}: EditarAmpliacionModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            observacion: currentObservacion || "",
        },
    });

    const handleClose = () => {
        reset();
        setSelectedFile(null);
        onClose();
    };

    const onSubmit = (data: FormData) => {
        const updateData: { observacion?: string; file?: File } = {};

        // Solo incluir observación si cambió
        if (data.observacion && data.observacion !== currentObservacion) {
            updateData.observacion = data.observacion;
        }

        // Solo incluir archivo si se seleccionó uno nuevo
        if (selectedFile) {
            updateData.file = selectedFile;
        }

        // Validar que al menos uno de los campos esté presente
        if (!updateData.observacion && !updateData.file) {
            alert("Debes modificar al menos la observación o el archivo PDF");
            return;
        }

        onConfirm(updateData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Solo se permiten archivos PDF");
                e.target.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Información de Ampliación</DialogTitle>
                    <DialogDescription>
                        Actualiza la observación y/o el archivo PDF de la ampliación. Debes modificar al menos uno de los campos.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="observacion">
                            Observación <span className="text-xs text-muted-foreground">(opcional)</span>
                        </Label>
                        <Textarea
                            id="observacion"
                            placeholder="Ingrese observaciones sobre la ampliación..."
                            rows={4}
                            {...register("observacion", {
                                maxLength: {
                                    value: 500,
                                    message: "La observación no puede exceder 500 caracteres",
                                },
                            })}
                            disabled={isLoading}
                        />
                        {errors.observacion && (
                            <p className="text-sm text-red-500">{errors.observacion.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">
                            Archivo PDF <span className="text-xs text-muted-foreground">(opcional)</span>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className="cursor-pointer"
                            />
                            {selectedFile && (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                    <Upload className="w-4 h-4" />
                                    {selectedFile.name}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Solo archivos PDF. Si seleccionas un nuevo archivo, reemplazará el actual.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                "Actualizar"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
