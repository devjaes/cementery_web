"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Separator } from "@/shared/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  DollarSign,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit
} from "lucide-react";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useFindExhumacionByIdQuery } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-queries";
import { useUploadComprobanteMutation, useDeleteExhumacionMutation } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-mutations";
//import { useCreatePayment, useDownloadReceipt } from "@/features/payment/presentation/hooks/use-payment-mutation";
import jsPDF from 'jspdf';

// Helper function para formatear fechas de manera segura
const formatDateSafely = (dateValue: string | Date | null | undefined, formatString: string = "dd/MM/yyyy"): string => {
  if (!dateValue) return 'No disponible';
  
  try {
    let date: Date;
    if (typeof dateValue === 'string') {
      // Intentar parsear como ISO string primero
      date = parseISO(dateValue);
      // Si no es válido, intentar con new Date
      if (!isValid(date)) {
        date = new Date(dateValue);
      }
    } else {
      date = dateValue;
    }
    
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    
    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateValue);
    return 'Error en fecha';
  }
};

export default function ExhumacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exhumacionId = params.id as string;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingPayment, setGeneratingPayment] = useState(false);

  const { data: exhumacion, isLoading, error } = useFindExhumacionByIdQuery(exhumacionId);
  const uploadComprobanteMutation = useUploadComprobanteMutation();
  const deleteExhumacionMutation = useDeleteExhumacionMutation();
  //const createPaymentMutation = useCreatePayment();
  //const downloadReceiptMutation = useDownloadReceipt();

  // Debug: Log para ver la estructura de datos
  if (exhumacion) {
    console.log("📋 Datos de exhumación cargados:", exhumacion);
    console.log("📁 Campo archivos:", {
      archivos: exhumacion.archivos,
      tipo: typeof exhumacion.archivos,
      esArray: Array.isArray(exhumacion.archivos),
      longitud: exhumacion.archivos?.data?.length,
      propiedades: exhumacion.archivos ? Object.keys(exhumacion.archivos) : 'No disponible'
    });
    console.log("📅 Fechas recibidas:", {
      fechaExhumacion: exhumacion.fechaExhumacion,
      fechaCreacion: exhumacion.fechaCreacion,
      fechaActualizacion: exhumacion.fechaActualizacion,
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadComprobante = async () => {
    if (!selectedFile || !exhumacion) return;

    setUploading(true);
    try {
      await uploadComprobanteMutation.mutateAsync({
        id: exhumacion.idExhumacion,
        file: selectedFile
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir comprobante:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!exhumacion) return;
    
    if (confirm("¿Estás seguro de que deseas eliminar esta exhumación? Esta acción no se puede deshacer.")) {
      try {
        await deleteExhumacionMutation.mutateAsync(exhumacion.idExhumacion);
        router.push("/exhumaciones");
      } catch (error) {
        console.error("Error al eliminar exhumación:", error);
      }
    }
  };

  const handleDownloadArchivo = () => {
    if (!exhumacion?.archivos || exhumacion.archivos.type !== 'Buffer' || !exhumacion.archivos.data) {
      console.error('No hay archivo disponible para descargar');
      return;
    }

    try {
      // Convertir el array de bytes a Uint8Array
      const byteArray = new Uint8Array(exhumacion.archivos.data);
      
      // Crear un Blob con el contenido del archivo
      const blob = new Blob([byteArray], { 
        type: exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 
          ? 'application/pdf' 
          : 'application/octet-stream' 
      });
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}-documento.${
        exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 ? 'pdf' : 'bin'
      }`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Archivo descargado exitosamente');
    } catch (error) {
      console.error(' Error al descargar archivo:', error);
    }
  };

  const handleDownloadComprobante = () => {
    if (!exhumacion?.comprobantePago || exhumacion.comprobantePago.type !== 'Buffer' || !exhumacion.comprobantePago.data) {
      console.error('No hay comprobante de pago disponible para descargar');
      return;
    }

    try {
      // Convertir el array de bytes a Uint8Array
      const byteArray = new Uint8Array(exhumacion.comprobantePago.data);
      
      // Crear un Blob con el contenido del archivo
      const blob = new Blob([byteArray], { 
        type: exhumacion.comprobantePago.data[0] === 37 && exhumacion.comprobantePago.data[1] === 80 
          ? 'application/pdf' 
          : 'application/octet-stream' 
      });
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}-comprobante.${
        exhumacion.comprobantePago.data[0] === 37 && exhumacion.comprobantePago.data[1] === 80 ? 'pdf' : 'bin'
      }`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Comprobante descargado exitosamente');
    } catch (error) {
      console.error('❌ Error al descargar comprobante:', error);
    }
  };

  const handleDownloadAutorizacion = () => {
    if (!exhumacion) {
      console.error('No hay datos de exhumación disponibles');
      return;
    }

    try {
      // Crear nuevo documento PDF en formato A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Variables para posicionamiento
      let yPos = 8;
      const pageWidth = 210;
      const leftMargin = 8;
      const rightMargin = 202;
      const tableWidth = rightMargin - leftMargin;
      const cellHeight = 6;
      
      // Función auxiliar para dibujar bordes de tabla
      const drawTableBorder = (x: number, y: number, width: number, height: number, fill = false) => {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        if (fill) {
          pdf.setFillColor(0, 0, 0); // Negro
          pdf.rect(x, y, width, height, 'FD');
        } else {
          pdf.rect(x, y, width, height, 'D');
        }
      };

      // === ENCABEZADO CON LOGO Y TÍTULO ===
      // Borde completo del documento
      drawTableBorder(leftMargin, yPos, tableWidth, 270);
      
      // Logo municipal simulado
      pdf.setFillColor(50, 150, 50); // Verde
      pdf.rect(leftMargin + 3, yPos + 3, 4, 3, 'F');
      pdf.setFillColor(255, 200, 50); // Amarillo
      pdf.rect(leftMargin + 7, yPos + 3, 4, 3, 'F');
      pdf.setFillColor(255, 100, 100); // Rojo
      pdf.rect(leftMargin + 11, yPos + 3, 4, 3, 'F');
      pdf.setFillColor(100, 150, 255); // Azul
      pdf.rect(leftMargin + 15, yPos + 3, 4, 3, 'F');
      
      // Texto del logo
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.text("SANTIAGO DE", leftMargin + 3, yPos + 10);
      pdf.text("PÍLLARO", leftMargin + 3, yPos + 13);

      // Título principal centrado
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 0, 0); // Rojo
      pdf.text("GADM SANTIAGO DE PÍLLARO", pageWidth / 2, yPos + 8, { align: "center" });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text("DIRECCIÓN DE SERVICIOS PÚBLICOS", pageWidth / 2, yPos + 14, { align: "center" });
      
      yPos += 20;
      
      // === TABLA SUPERIOR CON FECHA ===
      // Primera fila - Fecha (span completo)
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(`FECHA: ${formatDateSafely(new Date(), "dd 'DE' MMMM 'DE' yyyy").toUpperCase()}`, leftMargin + 2, yPos + 4);


      yPos += cellHeight;
      // Segunda fila - Autorización y Código en la misma fila
      drawTableBorder(leftMargin, yPos, tableWidth * 0.45, cellHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("AUTORIZACIÓN DE EXHUMACIÓN", leftMargin + 2, yPos + 4);
      
      drawTableBorder(leftMargin + tableWidth * 0.45, yPos, tableWidth * 0.28, cellHeight);
      pdf.setFont("helvetica", "normal");
      pdf.text("Código de exhumación:", leftMargin + tableWidth * 0.45 + 2, yPos + 4);
      
      drawTableBorder(leftMargin + tableWidth * 0.73, yPos, tableWidth * 0.27, cellHeight);
      pdf.setFont("helvetica", "bold");
      pdf.text(exhumacion.codigo || '008-2025-CMC-EXH', leftMargin + tableWidth * 0.73 + 2, yPos + 4);
      
      yPos += cellHeight;
      
      // Celda separadora vacía con fondo negro
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += cellHeight;

      // === SECCIONES A) y B) - ENCABEZADOS BLANCOS ===
      drawTableBorder(leftMargin, yPos, tableWidth * 0.5, cellHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("A) Datos Institucionales:", leftMargin + (tableWidth * 0.5 / 2), yPos + 4, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.5, cellHeight, false);
      pdf.text("B) Motivo de solicitud", leftMargin + tableWidth * 0.5 + (tableWidth * 0.5 / 2), yPos + 4, { align: "center" });
      
      yPos += cellHeight;
      
      // Filas de datos institucionales y motivo
      const institutionalRows = [
        ['Cementerio:', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CENTRAL', 'Escrito', true],
        ['Funcionario o cargo:', 'WILSON HINOJOSA', 'Verbal (solo en caso de emergencia)', false]
      ];
      
      institutionalRows.forEach(row => {
        // Columna izquierda - institucional
        drawTableBorder(leftMargin, yPos, tableWidth * 0.22, cellHeight);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text(row[0] as string, leftMargin + 1, yPos + 4);
        
        drawTableBorder(leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, cellHeight);
        pdf.text(row[1] as string, leftMargin + tableWidth * 0.22 + 1, yPos + 4);
        
        // Columna derecha - motivo
        drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.42, cellHeight);
        pdf.text(row[2] as string, leftMargin + tableWidth * 0.5 + 1, yPos + 4);
        
        drawTableBorder(leftMargin + tableWidth * 0.92, yPos, tableWidth * 0.08, cellHeight);
        if (row[3]) {
          pdf.text('X', leftMargin + tableWidth * 0.94, yPos + 4);
        }
        
        yPos += cellHeight;
      });
      
      // Celda separadora vacía con fondo negro
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += cellHeight;

      // === SECCIONES C) y D) - ENCABEZADOS BLANCOS ===
      drawTableBorder(leftMargin, yPos, tableWidth * 0.5, cellHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("C) Datos del solicitante:", leftMargin + (tableWidth * 0.5 / 2), yPos + 4, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.2, cellHeight, false);
      pdf.text("D) CHECK LIST DE REQUISITOS", leftMargin + tableWidth * 0.5 + (tableWidth * 0.2 / 2), yPos + 4, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.7, yPos, tableWidth * 0.1, cellHeight, false);
      pdf.setFontSize(7);
      pdf.text("Cumple", leftMargin + tableWidth * 0.7 + (tableWidth * 0.1 / 2), yPos + 4, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.1, cellHeight, false);
      pdf.text("No cumple", leftMargin + tableWidth * 0.8 + (tableWidth * 0.1 / 2), yPos + 4, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.9, yPos, tableWidth * 0.1, cellHeight, false);
      pdf.text("Observación", leftMargin + tableWidth * 0.9 + (tableWidth * 0.1 / 2), yPos + 4, { align: "center" });
      
      yPos += cellHeight;
      
      // Datos combinados del solicitante y requisitos
      const solicitanteRequisitos = [
        ['Nombre/Apellido', exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA', 'Copia del certificado de defunción REC', true, false, ''],
        ['Parentesco (únicamente de primer grado)', 'SOBRINA', 'Certificado de Inhumación', true, false, ''],
        ['Nº Cédula de Identidad', exhumacion.inhumacion?.idFallecido?.cedula || '1800846784', 'Copia de C.I. del solicitante', true, false, ''],
        ['', '', 'Copia del T. de propiedad del nicho/lote/sitio', true, false, 'USUARIO CUENTA CON DOCUMENTO OTORGADO POR EL SERVICIOS PÚBLICOS. OFICIO DE INDUCCIÓN DE LA DIRECCIÓN MUNICIPAL'],
        ['Dirección', 'PÍLLARO CENTRO', 'Certificado de no adeudar a la municipalidad', true, false, ''],
        ['Num. Celular', '88333634', 'Haber cumplido 4 años de inhumación', true, false, ''],
        ['Correo Electrónico', '', 'Orden de un juez (en caso de efectos legales)', false, false, 'N/A'],
        ['', '', 'Pago por exhumación', exhumacion.estadoPago === 'finalizado', exhumacion.estadoPago !== 'finalizado', '']
      ];
      
      solicitanteRequisitos.forEach((row, index) => {
        // Ajustar altura para la fila con observación larga
        const currentCellHeight = index === 3 ? cellHeight + 3 : cellHeight;
        
        // Columna izquierda - solicitante
        drawTableBorder(leftMargin, yPos, tableWidth * 0.22, currentCellHeight);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text(row[0] as string, leftMargin + 1, yPos + 4);
        
        drawTableBorder(leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, currentCellHeight);
        pdf.text(row[1] as string, leftMargin + tableWidth * 0.22 + 1, yPos + 4);
        
        // Columna derecha - requisitos
        drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.2, currentCellHeight);
        const reqText = pdf.splitTextToSize(row[2] as string, (tableWidth * 0.18));
        pdf.text(reqText, leftMargin + tableWidth * 0.5 + 1, yPos + 3);
        
        drawTableBorder(leftMargin + tableWidth * 0.7, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[3]) {
          pdf.text('X', leftMargin + tableWidth * 0.73, yPos + 4);
        }
        
        drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[4]) {
          pdf.text('X', leftMargin + tableWidth * 0.83, yPos + 4);
        }
        
        drawTableBorder(leftMargin + tableWidth * 0.9, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[5]) {
          const obsText = pdf.splitTextToSize(row[5] as string, (tableWidth * 0.08));
          pdf.setFontSize(6);
          pdf.text(obsText, leftMargin + tableWidth * 0.9 + 0.5, yPos + 2);
          pdf.setFontSize(7);
        }
        
        yPos += currentCellHeight;
      });
      
      // Celda separadora vacía con fondo negro
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += cellHeight;

      // === SECCIÓN E) DATOS DEL NICHO ===
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("E) Datos del nicho/lote/sitio", leftMargin + (tableWidth / 2), yPos + 4, { align: "center" });
      
      yPos += cellHeight;
      
      const nichoRows = [
        ['Nombre del Propietario', exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA', 'Número de nicho', ''],
        ['Fecha de adquisición', '17 DE NOVIEMBRE DE 1974', 'Lugar del nicho', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CENTRAL'],
        ['Nombre del administrador', '', 'Lugar del sitio', ''],
        ['Propio', 'X', 'Arrendado/a', '', 'Firma de aceptación de exhumación', '']
      ];
      
      nichoRows.forEach((row, index) => {
        if (index === 3) { // Última fila con span adicional
          drawTableBorder(leftMargin, yPos, tableWidth * 0.12, cellHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.text(row[0], leftMargin + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.12, yPos, tableWidth * 0.13, cellHeight);
          pdf.text(row[1], leftMargin + tableWidth * 0.12 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.15, cellHeight);
          pdf.text(row[2], leftMargin + tableWidth * 0.25 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.4, yPos, tableWidth * 0.1, cellHeight);
          pdf.text(row[3], leftMargin + tableWidth * 0.4 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.3, cellHeight);
          pdf.text(row[4], leftMargin + tableWidth * 0.5 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.2, cellHeight);
          pdf.text(row[5], leftMargin + tableWidth * 0.8 + 1, yPos + 4);
        } else {
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, cellHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.text(row[0], leftMargin + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[1], leftMargin + tableWidth * 0.25 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[2], leftMargin + tableWidth * 0.5 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[3], leftMargin + tableWidth * 0.75 + 1, yPos + 4);
        }
        
        yPos += cellHeight;
      });
      
      // Celda separadora vacía con fondo negro
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += cellHeight;

      // === SECCIÓN F) DATOS DEL FALLECIDO ===
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("F) DATOS DEL FALLECIDO", leftMargin + (tableWidth / 2), yPos + 4, { align: "center" });
      
      yPos += cellHeight;
      
      const fallecidoRows = [
        ['Nombre/Apellido', `${exhumacion.inhumacion?.idFallecido?.nombres || 'LUZ EDELMIRA'} ${exhumacion.inhumacion?.idFallecido?.apellidos || 'PÁEZ RAMÍREZ'}`, 'FECHA DE EXHUMACIÓN', formatDateSafely(exhumacion.fechaExhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase()],
        ['Fecha de fallecimiento', formatDateSafely(exhumacion.inhumacion?.fechaInhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase() || '08 DE NOVIEMBRE DE 2008', 'Hora de exhumación', exhumacion.horaExhumacion || '15H00'],
        ['Fecha de Inhumación', formatDateSafely(exhumacion.inhumacion?.fechaInhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase() || '10 DE NOVIEMBRE DE 2008', 'Lugar de nueva sepultura (nicho, lote,lugar)', 'CEMENTERIO MUNICIPAL DE CALULÉ'],
        ['Lugar de sepultura (nicho, lote,lugar)', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CALULÉ', '', ''],
        ['N° Cédula de Identidad', exhumacion.inhumacion?.idFallecido?.cedula || '', 'Aprobación de los familiares', 'LA SOLICITANTE ES SOBRINA DE LA PERSONA FALLECIDA POR LO QUE ADJUNTA AUTORIZACIÓN DE LOS HIJOS DE LA PERSONA FALLECIDA.']
      ];
      
      fallecidoRows.forEach((row, index) => {
        if (index === 4) { // Última fila con span especial
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, cellHeight + 3);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.text(row[0], leftMargin + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, cellHeight + 3);
          pdf.text(row[1], leftMargin + tableWidth * 0.25 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.15, cellHeight + 3);
          pdf.text(row[2], leftMargin + tableWidth * 0.5 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.65, yPos, tableWidth * 0.35, cellHeight + 3);
          const splitText = pdf.splitTextToSize(row[3], (tableWidth * 0.33));
          pdf.text(splitText, leftMargin + tableWidth * 0.65 + 1, yPos + 2);
          
          yPos += cellHeight + 3;
        } else {
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, cellHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.text(row[0], leftMargin + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[1], leftMargin + tableWidth * 0.25 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[2], leftMargin + tableWidth * 0.5 + 1, yPos + 4);
          
          drawTableBorder(leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, cellHeight);
          pdf.text(row[3], leftMargin + tableWidth * 0.75 + 1, yPos + 4);
          
          yPos += cellHeight;
        }
      });
      
      
      
      // Celda separadora vacía con fondo negro
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += cellHeight;

      // === AUTORIZACIÓN FINAL EN CELDA ===
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      const autorizationText = "A petición del solicitante y habiendo cumplido con los requisitos de Ley, Se AUTORIZA la EXHUMACIÓN EN EL CEMENTERIO MUNICIPAL CENTRAL";
      const splitAuth = pdf.splitTextToSize(autorizationText, tableWidth - 4);
      pdf.text(splitAuth, pageWidth / 2, yPos + 4, { align: "center" });
      
      yPos += cellHeight;
      
      // === NOTA EN CELDA ===
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.text("Nota: ", leftMargin + 2, yPos + 4);
      pdf.setFont("helvetica", "normal");
      pdf.text("Se debe indicar que se ha socializado con los deudos que para realizar exhumaciones está prohibido para todos los que fallecieron a partir del 2020.", leftMargin + 15, yPos + 4);
      
      yPos += cellHeight;
      
      // === TEXTO DE ORDENANZA EN CELDA ===
      drawTableBorder(leftMargin, yPos, tableWidth, cellHeight + 8);
      pdf.setFontSize(6);
      const ordenanzaText = "El solicitante, de ser el caso, deberá dar cumplimiento a la ORDENANZA QUE REGULA LA ADMINISTRACIÓN Y FUNCIONAMIENTO DE LOS CEMENTERIOS MUNICIPALES DEL CANTÓN SANTIAGO DE PÍLLARO CAPÍTULO IV DE LAS ÁREAS DE INHUMACIÓN ART.17 Terminados los trabajos, los concesionarios o en su defecto los titulares del derecho funerario correspondiente, estarán obligados a retirar las losas, piedras, escombros y en general cualquier residuo de los materiales empleados, para que sean depositados en la escombrera municipal ubicada en EL SECTOR DE YAMBO HUASALATI GRANDE. Nº Código de exhumación después de ejecutar que han vehiculado o cualquier año determinó hayan causado en las calles, instalaciones, construcciones, etc.";
      const splitOrdenanza = pdf.splitTextToSize(ordenanzaText, tableWidth - 4);
      pdf.text(splitOrdenanza, leftMargin + 2, yPos + 3);
      
      //yPos += cellHeight + 15;
      
      // === FIRMAS EN CELDAS ===
      // drawTableBorder(leftMargin, yPos, tableWidth, cellHeight);
      // pdf.setFont("helvetica", "bold");
      // pdf.setFontSize(8);
      // pdf.text("Revisado y aprobado por:", pageWidth / 2, yPos + 4, { align: "center" });
      
      yPos += cellHeight + 3;
      
      // Celda para firmas
      //drawTableBorder(leftMargin, yPos, tableWidth * 0.5, cellHeight + 12);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("Solicitante Responsable", leftMargin + tableWidth * 0.25, yPos + 10, { align: "center" });
      pdf.line(leftMargin + 10, yPos + 15, leftMargin + tableWidth * 0.5 - 10, yPos + 15);
      pdf.setFont("helvetica", "normal");
      pdf.text(exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA', leftMargin + tableWidth * 0.25, yPos + 18, { align: "center" });
      
      //drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.5, cellHeight + 12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Directora de Servicios Públicos", leftMargin + tableWidth * 0.75, yPos + 10, { align: "center" });
      pdf.line(leftMargin + tableWidth * 0.5 + 10, yPos + 15, rightMargin - 10, yPos + 15);
      pdf.setFont("helvetica", "normal");
      pdf.text("ING. JENNY CONSTANTE", leftMargin + tableWidth * 0.75, yPos + 18, { align: "center" });
      
      // Descargar el PDF
      const filename = `autorizacion-exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}.pdf`;
      pdf.save(filename);
      
      console.log(' Autorización PDF descargada exitosamente');
    } catch (error) {
      console.error(' Error al generar autorización PDF:', error);
    }
  };

  const handleGeneratePaymentOrder = async () => {
    if (!exhumacion) {
      console.error('No hay datos de exhumación disponibles');
      return;
    }

    setGeneratingPayment(true);

    try {
      // Crear nuevo documento PDF para la orden de pago
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Variables para posicionamiento
      let yPos = 20;
      const pageWidth = 210;
      const leftMargin = 20;
      const rightMargin = 190;

      // === LOGO Y ENCABEZADO ===
      // Logo municipal simulado
      // pdf.setFillColor(50, 150, 50);
      // pdf.rect(leftMargin, yPos, 30, 20, 'F');
      
      // // Texto del logo
      // pdf.setTextColor(255, 255, 255);
      // pdf.setFont("helvetica", "bold");
      // pdf.setFontSize(8);
      // pdf.text("GADM SANTIAGO", leftMargin + 2, yPos + 8);
      // pdf.text("DE PÍLLARO", leftMargin + 2, yPos + 12);
      
      // Título principal
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("GADM SANTIAGO DE PÍLLARO", pageWidth / 2, yPos + 5, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.text("DEPARTAMENTO DE SERVICIOS PÚBLICOS", pageWidth / 2, yPos + 12, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.text("ORDEN DE PAGO EXHUMACIÓN", pageWidth / 2, yPos + 19, { align: "center" });

      yPos += 35;
      
      // === INFORMACIÓN DE FECHA Y TÍTULO ===
      pdf.setFontSize(10);
      pdf.text(`FECHA : ${formatDateSafely(new Date(), "dd/MM/yyyy")}`, leftMargin, yPos);
      pdf.text(formatDateSafely(new Date(), "HH:mm:ss"), rightMargin - 20, yPos);
      
      yPos += 10;
      
      // Título
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("TITULO :", leftMargin, yPos);
      pdf.text("000317", leftMargin + 25, yPos);
      
      yPos += 15;
      
      // === INFORMACIÓN DEL CONTRIBUYENTE ===
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      pdf.text(`CONTRIBUYENTE : ${exhumacion.duenioNicho || 'ALVAREZ BONILLA MARIA ERNESTINA'}`, leftMargin, yPos);
      yPos += 7;
      
      pdf.text(`CEDULA : ${exhumacion.inhumacion?.idFallecido?.cedula || '1800522417'}`, leftMargin, yPos);
      yPos += 7;
      
      pdf.text(`DIRECCION : ${exhumacion.ubicacion || ''}`, leftMargin, yPos);
      yPos += 7;
      
      pdf.text("CAUSA : EXHUMACION", leftMargin, yPos);
      yPos += 7;
      
      pdf.text(`OBSERVACION : EXHUMACION - ${exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL'}`, leftMargin, yPos);
      yPos += 10;
      
      // === TOTAL ===
      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL : 150,00", leftMargin, yPos);
      
      yPos += 15;
      
      // === TABLA DE CUENTA Y VALOR ===
      // Encabezados de tabla
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("CUENTA", leftMargin, yPos);
      pdf.text("VALOR", leftMargin + 120, yPos);
      
      yPos += 8;
      
      // Contenido de la tabla
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.text("EXHUMACION DE RESTOS EN EL CEMENTERIO", leftMargin, yPos);
      pdf.text("150,00", leftMargin + 120, yPos);
      
      yPos += 25;
      
      // === FIRMAS ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      // Firma izquierda
      pdf.text("ING. JENNY CONSTANTE", leftMargin + 20, yPos);
      pdf.text("DIRECTOR(A) SERVICIOS PÚBLICOS", leftMargin + 5, yPos + 5);
      
      // Firma derecha
      pdf.text(exhumacion.duenioNicho || 'ALVAREZ BONILLA MARIA ERNESTINA', rightMargin - 60, yPos);
      pdf.text(exhumacion.inhumacion?.idFallecido?.cedula || '1800522417', rightMargin - 30, yPos + 5);
      
      // Líneas para firmas
      //pdf.line(leftMargin, yPos - 5, leftMargin + 80, yPos - 5);
      //pdf.line(rightMargin - 80, yPos - 5, rightMargin, yPos - 5);
      
      // Descargar el PDF
      const filename = `orden-pago-exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}.pdf`;
      pdf.save(filename);
      
      console.log('✅ Orden de pago PDF generada exitosamente');
      alert('¡Orden de pago generada exitosamente!\n\nEl PDF se ha descargado automáticamente.');
      
    } catch (error) {
      console.error("❌ Error al generar orden de pago:", error);
      alert(`Error al generar la orden de pago.\n\nError: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setGeneratingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <ContainerApp title="Detalles de Exhumación">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando detalles de la exhumación...</p>
        </div>
      </ContainerApp>
    );
  }

  if (error || !exhumacion) {
    return (
      <ContainerApp title="Detalles de Exhumación">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los detalles de la exhumación. Por favor intenta nuevamente.
          </AlertDescription>
        </Alert>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp title="Detalles de Exhumación">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/exhumaciones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalles de Exhumación</h1>
              <p className="text-gray-600 mt-1">Código: {exhumacion.codigo || 'No asignado'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={exhumacion.estadoPago === 'finalizado' ? 'default' : 'secondary'}
              className={exhumacion.estadoPago === 'finalizado' ? 'bg-green-600' : 'bg-yellow-600'}
            >
              {exhumacion.estadoPago === 'finalizado' ? 'Finalizado' : 'Pendiente'}
            </Badge>
          </div>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Fecha y Hora</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{formatDateSafely(exhumacion.fechaExhumacion)}</span>
                    <Clock className="h-4 w-4 text-blue-600 ml-2" />
                    <span>{exhumacion.horaExhumacion || 'No disponible'}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Dueño del Nicho</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>{exhumacion.duenioNicho}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Ubicación</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{exhumacion.ubicacion}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Causa</Label>
                  <p className="mt-1">{exhumacion.causa}</p>
                </div>

                {exhumacion.observacion && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observaciones</Label>
                    <p className="mt-1 text-sm">{exhumacion.observacion}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Fechas del Sistema</Label>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Creado: {formatDateSafely(exhumacion.fechaCreacion, "dd/MM/yyyy HH:mm")}</p>
                    {exhumacion.fechaActualizacion && (
                      <p>Actualizado: {formatDateSafely(exhumacion.fechaActualizacion, "dd/MM/yyyy HH:mm")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Inhumación Original */}
        {exhumacion.inhumacion ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inhumación Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">
                      {exhumacion.inhumacion.idFallecido?.nombres || 'No disponible'} {exhumacion.inhumacion.idFallecido?.apellidos || ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Cédula:</span> {exhumacion.inhumacion.idFallecido?.cedula || 'No disponible'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Código:</span> {exhumacion.inhumacion.codigoInhumacion || 'No disponible'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Fecha de Inhumación:</span> {formatDateSafely(exhumacion.inhumacion.fechaInhumacion)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Solicitante:</span> {exhumacion.inhumacion.solicitante || 'No disponible'}
                  </div>
                  <Link href={`/inhumaciones/${exhumacion.inhumacion.idInhumacion}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Detalles de Inhumación
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inhumación Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-gray-500">
                <p>Información de inhumación no disponible</p>
                <p className="text-sm mt-1">ID: {exhumacion.inhumacionId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Archivos de Documentación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentación de Respaldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exhumacion.archivos && 
             exhumacion.archivos.type === 'Buffer' && 
             exhumacion.archivos.data && 
             Array.isArray(exhumacion.archivos.data) ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Archivo de Documentación</span>
                      <span className="text-xs text-gray-500">
                        Tamaño: {(exhumacion.archivos.data.length / 1024).toFixed(1)} KB
                        {exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 ? ' • PDF' : ' • Archivo binario'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadArchivo}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay archivos cargados</p>
            )}
          </CardContent>
        </Card>

        {/* Estado de Pago */}
        <Card className={exhumacion.estadoPago === 'finalizado' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${exhumacion.estadoPago === 'finalizado' ? 'text-green-800' : 'text-yellow-800'}`}>
              <DollarSign className="h-5 w-5" />
              Estado del Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exhumacion.estadoPago === 'finalizado' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Pago Confirmado</span>
                </div>
                {exhumacion.comprobantePago && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Comprobante de Pago</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadComprobante}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                )}
                <Button className="w-full" onClick={handleDownloadAutorizacion}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Autorización de Exhumación (PDF)
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Pago Pendiente</span>
                </div>
                
                <div className="bg-white p-4 rounded border border-yellow-200">
                  <div className="text-center mb-4">
                    <p className="font-medium text-yellow-800">Monto a Pagar</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">$150.00 USD</p>
                    <p className="text-sm text-yellow-600 mt-2">
                      Costo de exhumación según normativa municipal
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Generar Orden de Pago
                  </Label>
                  <p className="text-sm text-gray-600">
                    Genera y descarga la orden de pago oficial para realizar el pago en tesorería
                  </p>
                  <Button 
                    onClick={handleGeneratePaymentOrder}
                    disabled={generatingPayment}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {generatingPayment ? "Generando Orden de Pago..." : "Descargar Orden de Pago"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Subir Comprobante de Pago</Label>
                  <p className="text-sm text-gray-600">
                    Una vez realizado el pago, sube el comprobante aquí
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUploadComprobante}
                      disabled={!selectedFile || uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Subiendo..." : "Subir"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Formatos permitidos: PDF, JPG, PNG. Máximo 5MB.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteExhumacionMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteExhumacionMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </ContainerApp>
  );
}
