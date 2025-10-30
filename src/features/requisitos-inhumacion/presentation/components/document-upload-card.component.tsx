"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

interface DocumentUploadCardProps {
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
  existingDocument?: string;
}

export function DocumentUploadCard({ onFileSelect, selectedFile: externalSelectedFile, existingDocument }: DocumentUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(externalSelectedFile || null);
  const [fileError, setFileError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }
    // Solo validar tipo PDF, sin validar peso/tamaño
    if (file.type !== "application/pdf") {
      setFileError("Solo se permiten archivos PDF");
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }
    setFileError("");
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        setFileError("Solo se permiten archivos PDF");
        setSelectedFile(null);
        onFileSelect?.(null);
        return;
      }
      setFileError("");
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardContent className="pt-3">
        <Input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

        {/* Zona de arrastrar y soltar + clic */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer ${
            isDragOver ? "border-purple-500 bg-purple-100" : "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className={`h-6 w-6 ${isDragOver ? "text-purple-700" : "text-purple-600"}`} />
            <div className="text-sm font-medium text-purple-800">Arrastra y suelta tu PDF aquí</div>
            <div className="text-xs text-purple-600">o haz clic para seleccionar</div>
          </div>
        </div>

        {/* Información del archivo seleccionado */}
        {selectedFile && (
          <div className="relative bg-white border border-purple-200 rounded-lg p-3 mt-3">
            <button type="button" aria-label="Quitar archivo" onClick={clearSelectedFile} className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-gray-100">
              <X className="h-3.5 w-3.5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900 truncate" title={selectedFile.name}>{selectedFile.name}</span>
            </div>
          </div>
        )}
        {fileError && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{fileError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}


