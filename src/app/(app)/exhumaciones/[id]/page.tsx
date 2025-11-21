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
import { 
  useCreatePayment, 
  useDownloadReceipt, 
  useUploadReceipt 
} from "@/features/payment/presentation/hooks/use-payment-mutation";
import { usePaymentsByProcedure } from "@/features/payment/presentation/hooks/use-payment-query";
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
  const [generatingAuthorization, setGeneratingAuthorization] = useState(false);

  const { data: exhumacion, isLoading, error } = useFindExhumacionByIdQuery(exhumacionId);
  const uploadComprobanteMutation = useUploadComprobanteMutation();
  const deleteExhumacionMutation = useDeleteExhumacionMutation();
  
  // Payment hooks
  const createPaymentMutation = useCreatePayment();
  const downloadReceiptMutation = useDownloadReceipt();
  const uploadReceiptMutation = useUploadReceipt();
  
  // Query para obtener pagos de esta exhumación
  const { data: payments } = usePaymentsByProcedure(
    'exhumation', 
    exhumacionId,
    !!exhumacionId
  );

  // Debug: Log para ver la estructura de datos
  if (exhumacion) {
    console.log(" Datos de exhumación cargados:", exhumacion);
    console.log(" Campo archivos:", {
      archivos: exhumacion.archivos,
      tipo: typeof exhumacion.archivos,
      esArray: Array.isArray(exhumacion.archivos),
      longitud: exhumacion.archivos?.data?.length,
      propiedades: exhumacion.archivos ? Object.keys(exhumacion.archivos) : 'No disponible'
    });
    console.log("Fechas recibidas:", {
      fechaExhumacion: exhumacion.fechaExhumacion,
      fechaCreacion: exhumacion.fechaCreacion,
      fechaActualizacion: exhumacion.fechaActualizacion,
    });
    
    // Análisis de campos estáticos vs dinámicos
    console.log(" ANÁLISIS DE DATOS PARA PAGOS Y DOCUMENTOS:");
    console.log(" Campos disponibles y dinámicos:", {
      'Nombre dueño': exhumacion.duenioNicho,
      'Ubicación cementerio': exhumacion.ubicacion,
      'Fecha exhumación': exhumacion.fechaExhumacion,
      'Hora exhumación': exhumacion.horaExhumacion,
      'Causa': exhumacion.causa,
      'Nombre fallecido': exhumacion.inhumacion?.idFallecido?.nombres,
      'Apellidos fallecido': exhumacion.inhumacion?.idFallecido?.apellidos,
      'Cedula fallecido': exhumacion.inhumacion?.idFallecido?.cedula,
      'Solicitante inhumación': exhumacion.inhumacion?.solicitante
    });
    console.log(" Campos faltantes en BD (hardcodeados):", {
      'Para pagos': ['cedulaDuenio', 'direccionDuenio', 'telefonoDuenio'],
      'Para PDF autorización': ['parentescoDuenio', 'fechaAdquisicionNicho', 'administradorCementerio', 'tipoPropiedad', 'directorServicios', 'funcionarioEncargado'],
      'Fallbacks temporales usados': {
        buyerDocument: 'fallecido.cedula → debería ser dueño.cedula',
        buyerDirection: 'fallecido.direccion → debería ser dueño.direccion'
      }
    });
  }

  // Debug: Log de pagos
  // if (payments) {
  //   console.log(" Pagos encontrados para esta exhumación:", payments);
  //   console.log(" Pago pendiente:", payments.find(p => p.status === 'pending'));
  //   console.log("Pago pagado:", payments.find(p => p.status === 'paid'));
  //   console.log(" Estado combinado de pago:", {
  //     estadoExhumacion: exhumacion?.estadoPago,
  //     tienePagoPaid: payments?.some(p => p.status === 'paid'),
  //     estadoFinal: (exhumacion?.estadoPago === 'finalizado' || payments?.some(p => p.status === 'paid'))
  //   });
  // }

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
      // 1. SUBIR COMPROBANTE A LA TABLA DE EXHUMACIONES (funcionalidad original)
      console.log(' Subiendo comprobante a tabla de exhumaciones...');
      await uploadComprobanteMutation.mutateAsync({
        id: exhumacion.idExhumacion,
        file: selectedFile
      });
      console.log(' Comprobante subido a tabla de exhumaciones exitosamente');

      // 2. SI EXISTE UN PAGO PENDIENTE, TAMBIÉN SUBIRLO AL MÓDULO DE PAYMENTS
      if (payments?.length) {
        const pendingPayment = payments.find(p => p.status === 'pending');
        
        if (pendingPayment) {
          console.log(' Subiendo comprobante al módulo de payments...');
          await uploadReceiptMutation.mutateAsync({
            paymentId: pendingPayment.paymentId,
            file: selectedFile,
            validatedBy: 'admin-user' // TODO: usar usuario actual
          });
          console.log(' Comprobante subido al módulo de payments exitosamente');
        } else {
          console.log(' No se encontró pago pendiente en el módulo de payments, solo se actualizó la tabla de exhumaciones');
        }
      } else {
        console.log(' No hay pagos en el módulo de payments, solo se actualizó la tabla de exhumaciones');
      }

      setSelectedFile(null);
      
    } catch (error) {
      console.error(" Error al subir comprobante:", error);
      alert(`Error al subir el comprobante.\n\nError: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
      
      console.log(' Comprobante descargado exitosamente');
    } catch (error) {
      console.error(' Error al descargar comprobante:', error);
    }
  };

  const handleDownloadAutorizacion = async () => {
    if (!exhumacion) {
      console.error('No hay datos de exhumación disponibles');
      return;
    }

    setGeneratingAuthorization(true);

    try {
      // Crear nuevo documento PDF en formato A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Variables para posicionamiento y paginación
      let yPos = 8;
      const pageWidth = 210;
      const pageHeight = 297; // A4 height in mm
      const leftMargin = 8;
      const rightMargin = 202;
      const tableWidth = rightMargin - leftMargin;
      const baseCellHeight = 6;
      const bottomMargin = 20; // Margen inferior para evitar que el contenido se corte
      
      // Función auxiliar para verificar si necesitamos una nueva página
      const checkNewPage = (requiredHeight: number) => {
        if (yPos + requiredHeight > pageHeight - bottomMargin) {
          pdf.addPage();
          yPos = 8; // Reset position to top of new page
          return true;
        }
        return false;
      };
      
      // Función auxiliar para calcular altura necesaria para texto
      const calculateTextHeight = (text: string, maxWidth: number, fontSize: number = 7) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.35; // Aproximadamente 0.35mm por punto de fuente
        return Math.max(baseCellHeight, lines.length * lineHeight + 2); // +2mm padding
      };
      
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
      
      // Función auxiliar para dibujar texto con ajuste automático
      const drawTextInCell = (text: string, x: number, y: number, maxWidth: number, cellHeight: number, fontSize: number = 7) => {
        pdf.setFontSize(fontSize);
        if (text.trim() === '') return;
        
        const lines = pdf.splitTextToSize(text, maxWidth - 2); // -2mm para padding
        const lineHeight = fontSize * 0.35;
        const startY = y + 2 + lineHeight; // Padding superior + altura de línea
        
        lines.forEach((line: string, index: number) => {
          const lineY = startY + (index * lineHeight);
          if (lineY < y + cellHeight - 1) { // Verificar que no se salga de la celda
            pdf.text(line, x + 1, lineY); // +1mm padding izquierdo
          }
        });
      };

      // === ENCABEZADO CON LOGO Y TÍTULO ===
      // Verificar si hay espacio para el documento completo, si no, comenzar en nueva página
      checkNewPage(50); // Reservar espacio para encabezado
      
      // Logo municipal real
      try {
        // Cargar el logo desde la carpeta public
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        
        // Crear una promesa para cargar la imagen
        const loadImage = new Promise((resolve, reject) => {
          logoImg.onload = () => resolve(logoImg);
          logoImg.onerror = reject;
          logoImg.src = '/municipio-pillaro.jpg';
        });

        await loadImage;
        
        // Agregar la imagen al PDF
        const logoWidth = 25; // Ancho del logo en mm
        const logoHeight = 15; // Alto del logo en mm
        
        // Convertir imagen a formato base64 para jsPDF
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }
        canvas.width = logoImg.width;
        canvas.height = logoImg.height;
        ctx.drawImage(logoImg, 0, 0);
        const logoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Insertar logo en el PDF
        pdf.addImage(logoDataUrl, 'JPEG', leftMargin + 3, yPos + 3, logoWidth, logoHeight);
        
        console.log('✅ Logo municipal cargado exitosamente');
      } catch (error) {
        console.warn('⚠️ No se pudo cargar el logo, usando texto como fallback:', error);
        
        // Fallback: texto descriptivo si no se puede cargar la imagen
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.text("GADM SANTIAGO", leftMargin + 3, yPos + 8);
        pdf.text("DE PÍLLARO", leftMargin + 3, yPos + 12);
        pdf.setFontSize(6);
        pdf.text("Logo Municipal", leftMargin + 3, yPos + 16);
      }

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
      checkNewPage(baseCellHeight * 3); // Verificar espacio para las siguientes filas
      
      // Primera fila - Fecha (span completo)
      const fechaTexto = `FECHA: ${formatDateSafely(new Date(), "dd 'DE' MMMM 'DE' yyyy").toUpperCase()}`;
      const fechaHeight = calculateTextHeight(fechaTexto, tableWidth - 4, 8);
      
      drawTableBorder(leftMargin, yPos, tableWidth, fechaHeight);
      pdf.setFont("helvetica", "bold");
      drawTextInCell(fechaTexto, leftMargin, yPos, tableWidth, fechaHeight, 8);

      yPos += fechaHeight;
      // Segunda fila - Autorización y Código en la misma fila
      const autorizacionTexto = "AUTORIZACIÓN DE EXHUMACIÓN";
      const codigoLabelTexto = "Código de exhumación:";
      const codigoValorTexto = exhumacion.codigo || '008-2025-CMC-EXH';
      
      const autorizacionHeight = Math.max(
        calculateTextHeight(autorizacionTexto, tableWidth * 0.45 - 4, 8),
        calculateTextHeight(codigoLabelTexto, tableWidth * 0.28 - 4, 7),
        calculateTextHeight(codigoValorTexto, tableWidth * 0.27 - 4, 8)
      );
      
      checkNewPage(autorizacionHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth * 0.45, autorizacionHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      drawTextInCell(autorizacionTexto, leftMargin, yPos, tableWidth * 0.45, autorizacionHeight, 8);
      
      drawTableBorder(leftMargin + tableWidth * 0.45, yPos, tableWidth * 0.28, autorizacionHeight);
      pdf.setFont("helvetica", "normal");
      drawTextInCell(codigoLabelTexto, leftMargin + tableWidth * 0.45, yPos, tableWidth * 0.28, autorizacionHeight, 7);
      
      drawTableBorder(leftMargin + tableWidth * 0.73, yPos, tableWidth * 0.27, autorizacionHeight);
      pdf.setFont("helvetica", "bold");
      drawTextInCell(codigoValorTexto, leftMargin + tableWidth * 0.73, yPos, tableWidth * 0.27, autorizacionHeight, 8);
      
      yPos += autorizacionHeight;
      
      // Celda separadora vacía con fondo negro
      checkNewPage(baseCellHeight);
      drawTableBorder(leftMargin, yPos, tableWidth, baseCellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += baseCellHeight;

      // === SECCIONES A) y B) - ENCABEZADOS BLANCOS ===
      const encabezadoA = "A) Datos Institucionales:";
      const encabezadoB = "B) Motivo de solicitud";
      
      const encabezadosHeight = Math.max(
        calculateTextHeight(encabezadoA, tableWidth * 0.5 - 4, 8),
        calculateTextHeight(encabezadoB, tableWidth * 0.5 - 4, 8)
      );
      
      checkNewPage(encabezadosHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth * 0.5, encabezadosHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(encabezadoA, leftMargin + (tableWidth * 0.5 / 2), yPos + encabezadosHeight/2 + 1, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.5, encabezadosHeight, false);
      pdf.text(encabezadoB, leftMargin + tableWidth * 0.5 + (tableWidth * 0.5 / 2), yPos + encabezadosHeight/2 + 1, { align: "center" });
      
      yPos += encabezadosHeight;
      
      // Filas de datos institucionales y motivo
      const institutionalRows = [
        ['Cementerio:', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CENTRAL', 'Escrito', true],
        ['Funcionario o cargo:', 'WILSON HINOJOSA', 'Verbal (solo en caso de emergencia)', false] // TODO: Debe venir de BD - tabla funcionarios/empleados
      ];
      
      institutionalRows.forEach(row => {
        // Calcular altura necesaria para esta fila
        const rowHeight = Math.max(
          calculateTextHeight(row[0] as string, tableWidth * 0.22 - 4, 7),
          calculateTextHeight(row[1] as string, tableWidth * 0.28 - 4, 7),
          calculateTextHeight(row[2] as string, tableWidth * 0.42 - 4, 7),
          baseCellHeight
        );
        
        checkNewPage(rowHeight);
        
        // Columna izquierda - institucional
        drawTableBorder(leftMargin, yPos, tableWidth * 0.22, rowHeight);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        drawTextInCell(row[0] as string, leftMargin, yPos, tableWidth * 0.22, rowHeight, 7);
        
        drawTableBorder(leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, rowHeight);
        drawTextInCell(row[1] as string, leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, rowHeight, 7);
        
        // Columna derecha - motivo
        drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.42, rowHeight);
        drawTextInCell(row[2] as string, leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.42, rowHeight, 7);
        
        drawTableBorder(leftMargin + tableWidth * 0.92, yPos, tableWidth * 0.08, rowHeight);
        if (row[3]) {
          pdf.setFontSize(7);
          pdf.text('X', leftMargin + tableWidth * 0.94, yPos + rowHeight/2 + 1);
        }
        
        yPos += rowHeight;
      });
      
      // Celda separadora vacía con fondo negro
      checkNewPage(baseCellHeight);
      drawTableBorder(leftMargin, yPos, tableWidth, baseCellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += baseCellHeight;

      // === SECCIONES C) y D) - ENCABEZADOS BLANCOS ===
      const encabezadoC = "C) Datos del solicitante:";
      const encabezadoD = "D) CHECK LIST DE REQUISITOS";
      
      const encabezadosHeight2 = Math.max(
        calculateTextHeight(encabezadoC, tableWidth * 0.5 - 4, 8),
        calculateTextHeight(encabezadoD, tableWidth * 0.2 - 4, 8),
        baseCellHeight
      );
      
      checkNewPage(encabezadosHeight2);
      
      drawTableBorder(leftMargin, yPos, tableWidth * 0.5, encabezadosHeight2, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(encabezadoC, leftMargin + (tableWidth * 0.5 / 2), yPos + encabezadosHeight2/2 + 1, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.2, encabezadosHeight2, false);
      pdf.text(encabezadoD, leftMargin + tableWidth * 0.5 + (tableWidth * 0.2 / 2), yPos + encabezadosHeight2/2 + 1, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.7, yPos, tableWidth * 0.1, encabezadosHeight2, false);
      pdf.setFontSize(7);
      pdf.text("Cumple", leftMargin + tableWidth * 0.7 + (tableWidth * 0.1 / 2), yPos + encabezadosHeight2/2 + 1, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.1, encabezadosHeight2, false);
      pdf.text("No cumple", leftMargin + tableWidth * 0.8 + (tableWidth * 0.1 / 2), yPos + encabezadosHeight2/2 + 1, { align: "center" });
      
      drawTableBorder(leftMargin + tableWidth * 0.9, yPos, tableWidth * 0.1, encabezadosHeight2, false);
      pdf.text("Observación", leftMargin + tableWidth * 0.9 + (tableWidth * 0.1 / 2), yPos + encabezadosHeight2/2 + 1, { align: "center" });
      
      yPos += encabezadosHeight2;
      
      // Datos combinados del solicitante y requisitos
      const solicitanteRequisitos = [
        ['Nombre/Apellido', exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA', 'Copia del certificado de defunción REC', true, false, ''],
        ['Parentesco (únicamente de primer grado)', 'SOBRINA', 'Certificado de Inhumación', true, false, ''], // TODO: Debe venir de BD - campo parentesco
        ['Nº Cédula de Identidad', exhumacion.inhumacion?.idFallecido?.cedula || '1800846784', 'Copia de C.I. del solicitante', true, false, ''], // TODO: Debe ser cédula del dueño/solicitante
        ['', '', 'Copia del T. de propiedad del nicho/lote/sitio', true, false, 'USUARIO CUENTA CON DOCUMENTO OTORGADO POR EL SERVICIOS PÚBLICOS. OFICIO DE INDUCCIÓN DE LA DIRECCIÓN MUNICIPAL'],
        ['Dirección', 'PÍLLARO CENTRO', 'Certificado de no adeudar a la municipalidad', true, false, ''], // TODO: Debe venir de BD - direccion del dueño
        ['Num. Celular', '88333634', 'Haber cumplido 4 años de inhumación', true, false, ''], // TODO: Debe venir de BD - telefono del dueño
        ['Correo Electrónico', '', 'Orden de un juez (en caso de efectos legales)', false, false, 'N/A'], // TODO: Debe venir de BD - email del dueño
        ['', '', 'Pago por exhumación', exhumacion.estadoPago === 'finalizado', exhumacion.estadoPago !== 'finalizado', '']
      ];
      
      solicitanteRequisitos.forEach((row) => {
        // Calcular altura necesaria para cada columna
        const col1Height = calculateTextHeight(row[0] as string, tableWidth * 0.22 - 4, 7);
        const col2Height = calculateTextHeight(row[1] as string, tableWidth * 0.28 - 4, 7);
        const col3Height = calculateTextHeight(row[2] as string, tableWidth * 0.2 - 4, 7);
        const col6Height = calculateTextHeight(row[5] as string, tableWidth * 0.1 - 4, 6);
        
        // La altura de la fila es el máximo entre todas las columnas
        const currentCellHeight = Math.max(col1Height, col2Height, col3Height, col6Height, baseCellHeight);
        
        checkNewPage(currentCellHeight);
        
        // Columna izquierda - solicitante
        drawTableBorder(leftMargin, yPos, tableWidth * 0.22, currentCellHeight);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        drawTextInCell(row[0] as string, leftMargin, yPos, tableWidth * 0.22, currentCellHeight, 7);
        
        drawTableBorder(leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, currentCellHeight);
        drawTextInCell(row[1] as string, leftMargin + tableWidth * 0.22, yPos, tableWidth * 0.28, currentCellHeight, 7);
        
        // Columna derecha - requisitos
        drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.2, currentCellHeight);
        drawTextInCell(row[2] as string, leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.2, currentCellHeight, 7);
        
        drawTableBorder(leftMargin + tableWidth * 0.7, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[3]) {
          pdf.setFontSize(7);
          pdf.text('X', leftMargin + tableWidth * 0.73, yPos + currentCellHeight/2 + 1);
        }
        
        drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[4]) {
          pdf.setFontSize(7);
          pdf.text('X', leftMargin + tableWidth * 0.83, yPos + currentCellHeight/2 + 1);
        }
        
        drawTableBorder(leftMargin + tableWidth * 0.9, yPos, tableWidth * 0.1, currentCellHeight);
        if (row[5] && typeof row[5] === 'string' && row[5].trim() !== '') {
          drawTextInCell(row[5], leftMargin + tableWidth * 0.9, yPos, tableWidth * 0.1, currentCellHeight, 6);
        }
        
        yPos += currentCellHeight;
      });
      
      // Celda separadora vacía con fondo negro
      checkNewPage(baseCellHeight);
      drawTableBorder(leftMargin, yPos, tableWidth, baseCellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += baseCellHeight;

      // === SECCIÓN E) DATOS DEL NICHO ===
      const encabezadoE = "E) Datos del nicho/lote/sitio";
      const encabezadoEHeight = calculateTextHeight(encabezadoE, tableWidth - 4, 8);
      
      checkNewPage(encabezadoEHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth, encabezadoEHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(encabezadoE, leftMargin + (tableWidth / 2), yPos + encabezadoEHeight/2 + 1, { align: "center" });
      
      yPos += encabezadoEHeight;
      
      const nichoRows = [
        ['Nombre del Propietario', exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA', 'Número de nicho', ''], // TODO: Número debe venir del nicho relacionado
        ['Fecha de adquisición', '17 DE NOVIEMBRE DE 1974', 'Lugar del nicho', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CENTRAL'], // TODO: Debe venir de BD - fecha adquisicion del nicho
        ['Nombre del administrador', '', 'Lugar del sitio', ''], // TODO: Debe venir de BD - administrador del cementerio
        ['Propio', 'X', 'Arrendado/a', '', 'Firma de aceptación de exhumación', ''] // TODO: Debe venir de BD - tipo de propiedad del nicho
      ];
      
      nichoRows.forEach((row, index) => {
        if (index === 3) { // Última fila con span adicional
          const rowHeight = Math.max(
            calculateTextHeight(row[0], tableWidth * 0.12 - 4, 7),
            calculateTextHeight(row[1], tableWidth * 0.13 - 4, 7),
            calculateTextHeight(row[2], tableWidth * 0.15 - 4, 7),
            calculateTextHeight(row[3], tableWidth * 0.1 - 4, 7),
            calculateTextHeight(row[4], tableWidth * 0.3 - 4, 7),
            calculateTextHeight(row[5], tableWidth * 0.2 - 4, 7),
            baseCellHeight
          );
          
          checkNewPage(rowHeight);
          
          drawTableBorder(leftMargin, yPos, tableWidth * 0.12, rowHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          drawTextInCell(row[0], leftMargin, yPos, tableWidth * 0.12, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.12, yPos, tableWidth * 0.13, rowHeight);
          drawTextInCell(row[1], leftMargin + tableWidth * 0.12, yPos, tableWidth * 0.13, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.15, rowHeight);
          drawTextInCell(row[2], leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.15, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.4, yPos, tableWidth * 0.1, rowHeight);
          drawTextInCell(row[3], leftMargin + tableWidth * 0.4, yPos, tableWidth * 0.1, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.3, rowHeight);
          drawTextInCell(row[4], leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.3, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.2, rowHeight);
          drawTextInCell(row[5], leftMargin + tableWidth * 0.8, yPos, tableWidth * 0.2, rowHeight, 7);
          
          yPos += rowHeight;
        } else {
          const rowHeight = Math.max(
            calculateTextHeight(row[0], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[1], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[2], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[3], tableWidth * 0.25 - 4, 7),
            baseCellHeight
          );
          
          checkNewPage(rowHeight);
          
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, rowHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          drawTextInCell(row[0], leftMargin, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[1], leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[2], leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[3], leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, rowHeight, 7);
          
          yPos += rowHeight;
        }
      });
      
      // Celda separadora vacía con fondo negro
      checkNewPage(baseCellHeight);
      drawTableBorder(leftMargin, yPos, tableWidth, baseCellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += baseCellHeight;

      // === SECCIÓN F) DATOS DEL FALLECIDO ===
      const encabezadoF = "F) DATOS DEL FALLECIDO";
      const encabezadoFHeight = calculateTextHeight(encabezadoF, tableWidth - 4, 8);
      
      checkNewPage(encabezadoFHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth, encabezadoFHeight, false);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(encabezadoF, leftMargin + (tableWidth / 2), yPos + encabezadoFHeight/2 + 1, { align: "center" });
      
      yPos += encabezadoFHeight;
      
      const fallecidoRows = [
        ['Nombre/Apellido', `${exhumacion.inhumacion?.idFallecido?.nombres || 'LUZ EDELMIRA'} ${exhumacion.inhumacion?.idFallecido?.apellidos || 'PÁEZ RAMÍREZ'}`, 'FECHA DE EXHUMACIÓN', formatDateSafely(exhumacion.fechaExhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase()],
        ['Fecha de fallecimiento', formatDateSafely(exhumacion.inhumacion?.fechaInhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase() || '08 DE NOVIEMBRE DE 2008', 'Hora de exhumación', exhumacion.horaExhumacion || '15H00'],
        ['Fecha de Inhumación', formatDateSafely(exhumacion.inhumacion?.fechaInhumacion, "dd 'DE' MMMM 'DE' yyyy").toUpperCase() || '10 DE NOVIEMBRE DE 2008', 'Lugar de nueva sepultura (nicho, lote,lugar)', 'CEMENTERIO MUNICIPAL DE CALULÉ'],
        ['Lugar de sepultura (nicho, lote,lugar)', exhumacion.ubicacion || 'CEMENTERIO MUNICIPAL CALULÉ', '', ''],
        ['N° Cédula de Identidad', exhumacion.inhumacion?.idFallecido?.cedula || '', 'Aprobación de los familiares', 'LA SOLICITANTE ES SOBRINA DE LA PERSONA FALLECIDA POR LO QUE ADJUNTA AUTORIZACIÓN DE LOS HIJOS DE LA PERSONA FALLECIDA.']
      ];
      
      fallecidoRows.forEach((row, index) => {
        if (index === 4) { // Última fila con span especial
          const rowHeight = Math.max(
            calculateTextHeight(row[0], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[1], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[2], tableWidth * 0.15 - 4, 7),
            calculateTextHeight(row[3], tableWidth * 0.35 - 4, 7),
            baseCellHeight
          );
          
          checkNewPage(rowHeight);
          
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, rowHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          drawTextInCell(row[0], leftMargin, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[1], leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.15, rowHeight);
          drawTextInCell(row[2], leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.15, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.65, yPos, tableWidth * 0.35, rowHeight);
          drawTextInCell(row[3], leftMargin + tableWidth * 0.65, yPos, tableWidth * 0.35, rowHeight, 7);
          
          yPos += rowHeight;
        } else {
          const rowHeight = Math.max(
            calculateTextHeight(row[0], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[1], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[2], tableWidth * 0.25 - 4, 7),
            calculateTextHeight(row[3], tableWidth * 0.25 - 4, 7),
            baseCellHeight
          );
          
          checkNewPage(rowHeight);
          
          drawTableBorder(leftMargin, yPos, tableWidth * 0.25, rowHeight);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          drawTextInCell(row[0], leftMargin, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[1], leftMargin + tableWidth * 0.25, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[2], leftMargin + tableWidth * 0.5, yPos, tableWidth * 0.25, rowHeight, 7);
          
          drawTableBorder(leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, rowHeight);
          drawTextInCell(row[3], leftMargin + tableWidth * 0.75, yPos, tableWidth * 0.25, rowHeight, 7);
          
          yPos += rowHeight;
        }
      });
      
      
      
      // Celda separadora vacía con fondo negro
      checkNewPage(baseCellHeight);
      drawTableBorder(leftMargin, yPos, tableWidth, baseCellHeight, true);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("", leftMargin + 2, yPos + 4);

      yPos += baseCellHeight;

      // === AUTORIZACIÓN FINAL EN CELDA ===
      const autorizationText = "A petición del solicitante y habiendo cumplido con los requisitos de Ley, Se AUTORIZA la EXHUMACIÓN EN EL CEMENTERIO MUNICIPAL CENTRAL";
      const authHeight = calculateTextHeight(autorizationText, tableWidth - 4, 6);
      
      checkNewPage(authHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth, authHeight);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      drawTextInCell(autorizationText, leftMargin, yPos, tableWidth, authHeight, 6);
      
      yPos += authHeight;
      
      // === NOTA EN CELDA ===
      const notaText = "Nota: Se debe indicar que se ha socializado con los deudos que para realizar exhumaciones está prohibido para todos los que fallecieron a partir del 2020.";
      const notaHeight = calculateTextHeight(notaText, tableWidth - 4, 7);
      
      checkNewPage(notaHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth, notaHeight);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.text("Nota: ", leftMargin + 2, yPos + notaHeight/2 + 1);
      pdf.setFont("helvetica", "normal");
      const notaTextoSolo = "Se debe indicar que se ha socializado con los deudos que para realizar exhumaciones está prohibido para todos los que fallecieron a partir del 2020.";
      drawTextInCell(notaTextoSolo, leftMargin + 12, yPos, tableWidth - 12, notaHeight, 7);
      
      yPos += notaHeight;
      
      // === TEXTO DE ORDENANZA EN CELDA ===
      const ordenanzaText = "El solicitante, de ser el caso, deberá dar cumplimiento a la ORDENANZA QUE REGULA LA ADMINISTRACIÓN Y FUNCIONAMIENTO DE LOS CEMENTERIOS MUNICIPALES DEL CANTÓN SANTIAGO DE PÍLLARO CAPÍTULO IV DE LAS ÁREAS DE INHUMACIÓN ART.17 Terminados los trabajos, los concesionarios o en su defecto los titulares del derecho funerario correspondiente, estarán obligados a retirar las losas, piedras, escombros y en general cualquier residuo de los materiales empleados, para que sean depositados en la escombrera municipal ubicada en EL SECTOR DE YAMBO HUASALATI GRANDE. Nº Código de exhumación después de ejecutar que han vehiculado o cualquier año determinó hayan causado en las calles, instalaciones, construcciones, etc.";
      const ordenanzaHeight = calculateTextHeight(ordenanzaText, tableWidth - 4, 6);
      
      checkNewPage(ordenanzaHeight);
      
      drawTableBorder(leftMargin, yPos, tableWidth, ordenanzaHeight);
      drawTextInCell(ordenanzaText, leftMargin, yPos, tableWidth, ordenanzaHeight, 6);
      
      yPos += ordenanzaHeight + 3;
      
      // === FIRMAS ===
      const firmasHeight = 25; // Altura fija para las firmas
      
      checkNewPage(firmasHeight);
      
      // Firmas lado a lado
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("Solicitante Responsable", leftMargin + tableWidth * 0.25, yPos + 10, { align: "center" });
      pdf.line(leftMargin + 10, yPos + 15, leftMargin + tableWidth * 0.5 - 10, yPos + 15);
      pdf.setFont("helvetica", "normal");
      const solicitanteNombre = exhumacion.duenioNicho || 'CAMPAÑA PÁEZ GLORIA TERESA';
      pdf.text(solicitanteNombre, leftMargin + tableWidth * 0.25, yPos + 18, { align: "center" });
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Directora de Servicios Públicos", leftMargin + tableWidth * 0.75, yPos + 10, { align: "center" });
      pdf.line(leftMargin + tableWidth * 0.5 + 10, yPos + 15, rightMargin - 10, yPos + 15);
      pdf.setFont("helvetica", "normal");
      pdf.text("ING. JENNY CONSTANTE", leftMargin + tableWidth * 0.75, yPos + 18, { align: "center" }); // TODO: Debe venir de BD - director de servicios públicos
      
      // === BORDE FINAL DEL DOCUMENTO ===
      // Dibujar borde completo en todas las páginas
      const totalPages = (pdf.internal as { pages: unknown[] }).pages.length - 1; // -1 porque el array incluye un elemento vacío al inicio
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        // Borde exterior de toda la página con margen
        pdf.rect(leftMargin, 8, tableWidth, pageHeight - 16, 'D');
      }

      // Descargar el PDF
      const filename = `autorizacion-exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}.pdf`;
      pdf.save(filename);
      
      console.log(' Autorización PDF descargada exitosamente');
    } catch (error) {
      console.error(' Error al generar autorización PDF:', error);
      alert('Error al generar el PDF de autorización. Por favor, inténtalo nuevamente.');
    } finally {
      setGeneratingAuthorization(false);
    }
  };

  // ===== FUNCIÓN PARA ORDEN DE PAGO (USA BACKEND ORIGINAL) =====
  const handleGeneratePaymentOrder = async () => {
    if (!exhumacion) {
      console.error('No hay datos de exhumación disponibles');
      return;
    }

    setGeneratingPayment(true);

    try {
      // 1. Verificar si ya existe un pago para esta exhumación
      let paymentToUse = payments?.find(p => p.status === 'pending');
      
      // 2. Si no existe pago pendiente, crear uno nuevo
      if (!paymentToUse) {
        console.log(' Creando nuevo pago para la exhumación...');
        
        // Crear datos completos del pago directamente
        const fallecidoCompleto = `${exhumacion.inhumacion?.idFallecido?.nombres || ''} ${exhumacion.inhumacion?.idFallecido?.apellidos || ''}`.trim();
        const buyerName = exhumacion.duenioNicho || 'Sin nombre';
        
        //  CAMPOS FALTANTES EN EL MODELO - Necesitan ser agregados a ExhumacionEntity:
        // - cedulaDuenio: string (cédula del dueño del nicho)
        // - direccionDuenio: string (dirección del dueño del nicho)
        // - telefonoDuenio: string (teléfono del dueño del nicho)
        // Mientras tanto, usar datos disponibles:
        const buyerDocument = exhumacion.inhumacion?.idFallecido?.cedula || '1800846784'; // TEMPORAL: usar cédula del fallecido como fallback
        const buyerDirection = exhumacion.inhumacion?.idFallecido?.direccion || 'PÍLLARO CENTRO'; // TEMPORAL: usar dirección del fallecido como fallback
        const procedureTitle = 'ORDEN DE PAGO EXHUMACIÓN';
        const causa = 'EXHUMACIÓN';
        const ubicacion = exhumacion.ubicacion || 'Cementerio Municipal';
        const concepto = 'EXHUMACIÓN DE RESTOS MORTALES';
        
        // Crear observaciones como JSON
        // const observationsJson = JSON.stringify({
        //   description: `Pago para exhumación de ${fallecidoCompleto}`,
        //   buyerName,
        //   buyerDocument,
        //   buyerDirection,
        //   causa,
        //   procedureTitle,
        //   ubicacion,
        //   fallecidoNombre: fallecidoCompleto,
        //   concepto
        // });
        
        const paymentData = {
          procedureType: 'exhumation' as const,
          procedureId: exhumacion.idExhumacion,
          amount: 150.00,
          generatedBy: 'admin-user', // TODO: usar usuario actual
          observations: `Pago para exhumación de ${fallecidoCompleto} - ${concepto}`, // Campo estándar de la API
          // Campos REQUERIDOS que ya existen en la BD
          buyerName,
          buyerDocument,
          buyerDirection,
          // Campos adicionales para la generación del PDF
          causa,
          reason: causa, // Campo alternativo por si el backend lo busca así
          procedureTitle,
          title: procedureTitle, // Campo alternativo para el título
          documentTitle: procedureTitle, // Otro campo alternativo
          ubicacion,
          fallecidoNombre: fallecidoCompleto,
          concepto,
          // Campos adicionales que el backend podría buscar
          observacion: concepto, // Por si busca 'observacion' sin 's'
          total: 150.00 // Campo alternativo para amount
        };
        
        // Log para verificar los datos que enviamos
        console.log(' Datos del pago a enviar:', {
          ...paymentData,
          '🔧 Campos críticos': {
            buyerName: `"${buyerName}"`,
            buyerDocument: `"${buyerDocument}"`, 
            buyerDirection: `"${buyerDirection}"`,
            procedureTitle: `"${procedureTitle}"`,
            causa: `"${causa}"`
          },
          ' Campos usando datos temporales': {
            buyerDocument_fuente: 'fallecido.cedula (debería ser dueño.cedula)',
            buyerDirection_fuente: 'fallecido.direccion (debería ser dueño.direccion)',
            campos_faltantes_en_BD: ['cedulaDuenio', 'direccionDuenio', 'telefonoDuenio']
          }
        });
        
        // Crear el pago en el backend
        const paymentResult = await createPaymentMutation.mutateAsync(paymentData);
        console.log(' Pago creado exitosamente:', paymentResult);
        paymentToUse = paymentResult;
      }

      // 3. Descargar el PDF directamente del backend (SIN MODIFICAR NADA)
      if (paymentToUse) {
        console.log(' Descargando comprobante PDF del backend...');
        await downloadReceiptMutation.mutateAsync(paymentToUse.paymentId);
        console.log(' Comprobante descargado exitosamente');
      }
      
    } catch (error) {
      console.error(" Error al generar orden de pago:", error);
      alert(`Error al generar la orden de pago.\n\nError: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      // Fallback: recargar la página para intentar recuperar el estado
      console.log(' Recargando página como fallback...');
      window.location.reload();
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
                  {/* <Link href={`/inhumaciones/${exhumacion.inhumacion.idInhumacion}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Detalles de Inhumación
                    </Button>
                  </Link> */}
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
        <Card className={(exhumacion.estadoPago === 'finalizado' || payments?.some(p => p.status === 'paid')) ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${(exhumacion.estadoPago === 'finalizado' || payments?.some(p => p.status === 'paid')) ? 'text-green-800' : 'text-yellow-800'}`}>
              <DollarSign className="h-5 w-5" />
              Estado del Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(exhumacion.estadoPago === 'finalizado' || payments?.some(p => p.status === 'paid')) ? (
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
                <Button 
                  className="w-full" 
                  onClick={handleDownloadAutorizacion}
                  disabled={generatingAuthorization}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {generatingAuthorization ? "Generando Autorización..." : "Descargar Autorización de Exhumación (PDF)"}
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
                    <p className="text-2xl font-bold text-yellow-900 mt-1">$150.00</p>
                    <p className="text-sm text-yellow-600 mt-2">
                      Costo de exhumación según normativa municipal
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Debug: Información de ambos sistemas de pago */}
                {/* <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium text-gray-800">Estado de Sistemas de Pago:</p>
                  <div className="mt-2 space-y-1">
                     <div className="text-gray-700">
                      <span className="font-medium">Tabla Exhumaciones:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        exhumacion.estadoPago === 'finalizado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {exhumacion.estadoPago || 'pendiente'}
                      </span>
                    </div> */}
                    {/* <div className="text-gray-700">
                      <span className="font-medium">Módulo Payments:</span>
                      {payments && payments.length > 0 ? (
                        <div className="ml-2">
                          {payments.map(payment => (
                            <div key={payment.paymentId} className="text-xs">
                              • {payment.paymentCode} - 
                              <span className={`ml-1 px-1 py-0.5 rounded ${
                                payment.status === 'paid' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status}
                              </span>
                              - ${payment.amount}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="ml-2 text-xs text-gray-500">Sin pagos registrados</span>
                      )}
                    </div> 
                  </div>
                </div> */}

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Generar Orden de Pago
                  </Label>
                  {/* <p className="text-sm text-gray-600">
                    Genera y descarga la orden de pago oficial para realizar el pago en tesorería
                  </p> */}
                  <Button 
                    onClick={handleGeneratePaymentOrder}
                    disabled={generatingPayment}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {generatingPayment ? "Generando Orden de Pago..." : "Descargar Orden de Pago"}
                  </Button>
                  {/* <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                     Este PDF viene directamente del backend para diagnosticar los datos vacíos
                  </p> */}
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
                  {/* <p className="text-xs text-gray-500">
                    Formatos permitidos: PDF, JPG, PNG. Máximo 5MB.
                  </p> */}
                  {/* <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                     El comprobante se guardará en la tabla de exhumaciones y actualizará el estado automáticamente.
                    {payments?.find(p => p.status === 'pending') && ' También se actualizará en el módulo de payments.'}
                  </p> */}
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
