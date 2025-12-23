import jsPDF from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { OwnerReport, DeceasedReport, DeceasedFilters } from "./reports.service";

export const reportsPdfService = {
  generateOwnersReportPdf: async (owners: OwnerReport[]) => {
    const pdf = new jsPDF("p", "mm", "a4");
    await addHeader(pdf, "REPORTE DE PROPIETARIOS DE NICHOS");

    let yPos = 50;
    const leftMargin = 10;
    const colWidths = [60, 30, 40, 30, 30]; // Nombre, Cédula, Nicho, Tipo, Fecha
    const headers = ["Nombre", "Cédula", "Nicho", "Tipo", "Fecha Adq."];

    // Draw Table Header
    drawTableRow(pdf, headers, leftMargin, yPos, colWidths, true);
    yPos += 8;

    // Draw Rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    owners.forEach((owner) => {
      if (yPos > 270) {
        pdf.addPage();
        addHeader(pdf, "REPORTE DE PROPIETARIOS DE NICHOS");
        yPos = 50;
        drawTableRow(pdf, headers, leftMargin, yPos, colWidths, true);
        yPos += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
      }

      const rowData = [
        `${owner.id_persona.nombres} ${owner.id_persona.apellidos}`,
        owner.id_persona.cedula,
        owner.id_nicho?.numero
          ? `${owner.id_nicho.tipo} - ${owner.id_nicho.numero}`
          : `B${owner.id_nicho?.id_bloque?.numero || "?"}-F${
              owner.id_nicho?.fila
            }-C${owner.id_nicho?.columna}`,
        owner.tipo,
        owner.fecha_adquisicion,
      ];

      drawTableRow(pdf, rowData, leftMargin, yPos, colWidths, false);
      yPos += 8;
    });

    pdf.save(`reporte_propietarios_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  },

  generateDeceasedReportPdf: async (deceased: DeceasedReport[], filters: DeceasedFilters) => {
    const pdf = new jsPDF("p", "mm", "a4");
    await addHeader(pdf, "REPORTE DE PERSONAS SEPULTADAS");

    // Add Filters Info
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    let filterText = "Filtros aplicados: ";
    if (filters.startDate) filterText += `Desde: ${filters.startDate} `;
    if (filters.endDate) filterText += `Hasta: ${filters.endDate} `;
    if (filters.nicheId) filterText += `Nicho: ${filters.nicheId} `;
    if (filters.cause) filterText += `Causa: ${filters.cause} `;
    
    pdf.text(filterText, 10, 45);

    let yPos = 55;
    const leftMargin = 10;
    const colWidths = [60, 25, 40, 35, 30]; // Nombre, Fecha Def., Causa, Nicho, Fecha Inh.
    const headers = ["Nombre", "F. Defunción", "Causa", "Nicho", "F. Inhumación"];

    // Draw Table Header
    drawTableRow(pdf, headers, leftMargin, yPos, colWidths, true);
    yPos += 8;

    // Draw Rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    deceased.forEach((record) => {
      if (yPos > 270) {
        pdf.addPage();
        addHeader(pdf, "REPORTE DE PERSONAS SEPULTADAS");
        yPos = 55;
        drawTableRow(pdf, headers, leftMargin, yPos, colWidths, true);
        yPos += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
      }

      const rowData = [
        `${record.id_fallecido.nombres} ${record.id_fallecido.apellidos}`,
        record.id_fallecido.fecha_defuncion,
        record.id_fallecido.causa_defuncion,
        record.id_nicho?.numero
          ? `${record.id_nicho.tipo} - ${record.id_nicho.numero}`
          : `B${record.id_nicho?.id_bloque?.numero || "?"}-F${
              record.id_nicho?.fila
            }-C${record.id_nicho?.columna}`,
        record.fecha_inhumacion,
      ];

      drawTableRow(pdf, rowData, leftMargin, yPos, colWidths, false);
      yPos += 8;
    });

    pdf.save(`reporte_fallecidos_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  },
};

// Helper Functions

const addHeader = async (pdf: jsPDF, title: string) => {
  const pageWidth = 210;
  const leftMargin = 10;

  // Logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
      logoImg.src = "/municipio-pillaro.jpg";
    });

    const canvas = document.createElement("canvas");
    canvas.width = logoImg.width;
    canvas.height = logoImg.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(logoImg, 0, 0);
      const logoDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      pdf.addImage(logoDataUrl, "JPEG", leftMargin, 10, 25, 15);
    }
  } catch (error) {
    console.warn("Could not load logo", error);
    pdf.setFontSize(8);
    pdf.text("GADM SANTIAGO DE PÍLLARO", leftMargin, 15);
  }

  // Title
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 0, 0);
  pdf.text("GADM SANTIAGO DE PÍLLARO", pageWidth / 2, 18, { align: "center" });

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.text("DIRECCIÓN DE SERVICIOS PÚBLICOS", pageWidth / 2, 24, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.text(title, pageWidth / 2, 35, { align: "center" });

  // Date
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  const dateStr = format(new Date(), "dd 'DE' MMMM 'DE' yyyy", { locale: es }).toUpperCase();
  pdf.text(`FECHA: ${dateStr}`, pageWidth - 10, 15, { align: "right" });
};

const drawTableRow = (
  pdf: jsPDF,
  data: string[],
  x: number,
  y: number,
  widths: number[],
  isHeader: boolean
) => {
  pdf.setFont("helvetica", isHeader ? "bold" : "normal");
  pdf.setFontSize(isHeader ? 9 : 8);
  
  let currentX = x;
  data.forEach((text, index) => {
    const width = widths[index];
    pdf.rect(currentX, y, width, 8);
    
    // Truncate text if too long
    let displayText = text || "";
    if (pdf.getTextWidth(displayText) > width - 2) {
       // Simple truncation for now
       while (pdf.getTextWidth(displayText + "...") > width - 2 && displayText.length > 0) {
         displayText = displayText.slice(0, -1);
       }
       displayText += "...";
    }

    pdf.text(displayText, currentX + 2, y + 5);
    currentX += width;
  });
};
